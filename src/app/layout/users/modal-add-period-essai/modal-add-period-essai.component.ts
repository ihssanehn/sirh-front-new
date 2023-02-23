import { Component, Input, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ListsService } from '@app/core/services/lists.service';
import { PersonalService } from '@app/core/services/personal.service';
import {
  formatDateForBackend,
  getFormValidationErrors,
  markFormAsDirty,
  SharedClasses
} from '@app/shared/Utils/SharedClasses';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import {MainStore} from "@store/mainStore.store";
import * as moment from "moment";
import {isMoment} from "moment/moment";

@Component({
  selector: 'app-modal-add-period-essai',
  templateUrl: './modal-add-period-essai.component.html',
  styleUrls: ['./modal-add-period-essai.component.scss']
})

export class ModalAddPeriodEssaiComponent implements OnInit {
  error = '';
  warning = '';
  submitting: boolean;
  errorLoadData: boolean;
  loadingData: boolean;
  validators_conge =  [];
  loadingLists: boolean;
  formGroup: FormGroup;

  formMetaData = {
    personal: {
      input: 'personal',
      label: 'Salarié',
      placeholder: 'Selectionner le personnel',
      errorRequired: 'Le personnel est obligatoire'
    },
    decision: {
      input: 'decision',
      label: 'Décision',
      placeholder: 'Sélectionner la décision',
      errorRequired: 'La décision est obligatoire'
    },
    date_fin_period_essai: {
      input: 'date_fin_period_essai',
      label: 'Date de fin de période d\'essai',
      placeholder: 'Sélectionner la date de fin de période d\'essai',
      errorRequired: 'La date de fin de PE est obligatoire'
    },
    date_entree: {
        input: 'date_entree',
        label: 'Date d\'entrée',
        placeholder: 'Sélectionner la date d\'entrée',
        errorRequired: 'La date d\'entrée est obligatoire'
    },
    date_sortie: {
        input: 'date_sortie',
        label: 'Date de sortie',
        placeholder: 'Sélectionner la date de sortie',
        errorRequired: 'La date de sortie est obligatoire'
    },
    renewal_date: {
        input: 'renewal_date',
        label: 'Date de fin de renouvellement',
        placeholder: 'Sélectionner la date de fin de renouvellement',
        errorRequired: 'La date de fin de renouvellement est obligatoire'
    },
    motif_id: {
      input: 'motif_id',
      label: 'Motif',
      placeholder: 'Sélectionner le motif',
      errorRequired: 'Le motif est obligatoire'
    }
  }

  current_pe;
  personals = [];
  entretien_types = [];
  loadingSelect = {};
  id_entite = null;
  item = null;
  motifs = [];
  decisions = [];
  @Input() set data(val){
    this.item = val;
    console.log('set data', val)
    if(this.formGroup){
        this.formGroup.patchValue({
        ...val,
        date_fin_period_essai:val.end_date
      });
    }
    this.getFilterList('personals', this.listService.list.PERSONAL);
    this.getFilterList('decisions', this.listService.list.STATUS, 'decision_trail_period')
  }

  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbActiveModal,
    public listService: ListsService,
    public mainStore: MainStore,
    private personalService: PersonalService,
    private messageService: MessageService
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      personal: [null],
      decision: [null],
      date_entree: [null],
      date_sortie: [null],
      renewal_date: [null],
      date_fin_period_essai: [null],
      motif_id:[null]
    });
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
  }

  ngOnInit(): void {

  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.formGroup.controls[control]) ? '(*)': '';
  }

  async getFilterList(items, list_name, list_param?){
    if(items === 'personals'){
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.personalService.getPersonnelAnnex().toPromise();
        console.log('this.item this.personals', this.personals);
      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }else{
      try{
        this.loadingSelect[list_name] = true;
        const _result = await this.listService.getAll(list_name, list_param).toPromise();
        if(items === 'motifs'){
          this[items] =  _result.filter(motif => {
              return motif.code.includes('fin_pe');
          });
        }
        else
          this[items] = _result

      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }
  }

  clearDateInput(input: string) {
    this.formGroup.patchValue({
      [input]: null
    })
  }

  async getTrialPeriodRenewCalculation(code:string) {
    console.log(this.formGroup.getRawValue())
    if(code != 'renouvellement')
      return;
    const {personal, date_fin_period_essai} = this.formGroup.getRawValue();
    if(!personal  || !date_fin_period_essai){
      return;
    }
    try {
      const params = {
        personal_id:personal.id,
        end_date: formatDateForBackend(this.current_pe?.end_date)
      }
      const res = await this.personalService.getTrialPeriodRenewCalculation(params).toPromise();
      console.log('res renew calculation', res);
      if(moment(res.calculated_date)?.isValid()) {
        console.log('patching end_date_preavis')
        this.formGroup.patchValue({renewal_date: moment(res.calculated_date).toISOString(), date_fin_period_essai: moment(res.calculated_date).toISOString()});
      }else
        this.formGroup.patchValue({renewal_date:null})
    }catch (e) {
      console.log('error getPreavisCalculation', e);
    }finally {

    }
  }

  async submit() {
    markFormAsDirty(this.formGroup);
    if(!this.formGroup.valid ){
      getFormValidationErrors(this.formGroup);
      return;
    }

    const dates = ['renewal_date', 'date_fin_period_essai', 'date_sortie'];
    const saveData = {
      ...this.formGroup.value
    }
    dates.forEach(date => {
      saveData[date] = saveData[date] && isMoment(moment(saveData[date])) ? moment(saveData[date]).format('YYYY-MM-DD') : null
    });
    saveData.personal_id = saveData.personal.id;

    let res = null;
    try {
        res = await this.personalService.createOrUpdateTrialPeriod(saveData).toPromise();
        this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Période d\'essai modifiée avec succès'});
        this.modal.close(res);
    }catch (e) {
      this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la modification de la période d\'essai'});
    }finally {
      this.submitting = false;
    }
  }
}
