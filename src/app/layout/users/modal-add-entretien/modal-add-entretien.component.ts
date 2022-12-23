import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ListsService } from '@app/core/services/lists.service';
import { PersonalService } from '@app/core/services/personal.service';
import {formatDateForBackend, markFormAsDirty, SharedClasses} from '@app/shared/Utils/SharedClasses';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import {MainStore} from "@store/mainStore.store";
import * as moment from "moment";

@Component({
  selector: 'app-modal-add-entretien',
  templateUrl: './modal-add-entretien.component.html',
  styleUrls: ['./modal-add-entretien.component.scss']
})

export class ModalAddEntretienComponent implements OnInit {
  error = '';
  warning = '';
  submitting: boolean;
  errorLoadData: boolean;
  loadingData: boolean;
  validators_conge =  [];
  loadingLists: boolean;
  formGroup: FormGroup;

  formMetaData = {
    personal_id: {
      input: 'personal_id',
      label: 'Personnel',
      placeholder: 'Selectionner le personnel',
      errorRequired: 'Le personnel est obligatoire'
    },
    type_id: {
      input: 'type_id',
      label: 'Type d\'entretien',
      placeholder: 'Selectionner le type d\'entretien',
      errorRequired: 'Le type d\'entretien est obligatoire'
    },
    theoretical_date: {
      input: 'theoretical_date',
      label: 'Date théorique',
      placeholder: 'La date théorique',
      errorRequired: 'La date théorique est obligatoire'
    },
    effective_date: {
      input: 'effective_date',
      label: 'Date effective',
      placeholder: 'La date effective',
      errorRequired: 'La date effective est obligatoire'
    }
  }

  personals = [];
  entretien_types = [];
  loadingSelect = {};
  id_entite = null;
  item = null;
  @Input() set data(val){
    this.item = val;
    if(this.formGroup){
        this.formGroup.patchValue({
        ...val,
        theoretical_date: moment(val.theoretical_date).format('YYYY-MM-DD'),
        effective_date: moment(val.effective_date).format('YYYY-MM-DD'),
      });
    }
    this.getFilterList('entretien_types', this.listService.list.INTERVIEW_TYPE);
    this.getFilterList('personals', this.listService.list.PERSONAL);
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
      id: [this.item?.id || null],
      personal_id: [this.item?.personal_id || null, Validators.compose([Validators.required])],
      type_id: [this.item?.type_id || null, Validators.compose([Validators.required])],
      theoretical_date: [this.item ? moment(this.item.theoretical_date).format('YYYY-MM-DD') : null, Validators.compose([Validators.required])],
      effective_date: [this.item ? moment(this.item.effective_date).format('YYYY-MM-DD') : null],
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
        this[items] = await this.listService.getAll(list_name, list_param).toPromise();

      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }
  }

  async submit() {
    markFormAsDirty(this.formGroup);
    if (!this.formGroup.valid) {
      return;
    }
    try{
      this.submitting = true;
      const params: any = {
        personal_id: this.formGroup.getRawValue().personal_id,
        type_id: this.formGroup.getRawValue().type_id,
        theoretical_date: formatDateForBackend(this.formGroup.getRawValue().theoretical_date),
      }
      if(this.formGroup.getRawValue().effective_date){
        params.effective_date = formatDateForBackend(this.formGroup.getRawValue().effective_date);
      }
      console.log('params', params);
      let res;
      if(this.item?.id){
        params.id = this.item.id;
        res = await this.personalService.updateEntretien(params).toPromise();
        this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Entretien modifié avec succès'});
      }else{
        res = await this.personalService.addEntretien(params).toPromise();
        this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Entretien ajouté avec succès'});
      }

      console.log('res add/update Entretien', res);
      this.modal.close(res);
    }catch (e){
      if(this.item?.id){
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la modification de l\'entretien'});
      }else{
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'ajout de l\'entretien'});
      }
    }finally {
      this.submitting = false;
    }
  }

  async getTheoricalDateCalulation() {
    const {personal_id, type_id} = this.formGroup.getRawValue();
    if(!personal_id || !type_id){
      return;
    }
    try {
      const params = {
        personal_id,
        type_id,
      }
      const res = await this.personalService.getTheoricalDateCalulation(params).toPromise();
      console.log('res getTheoricalDateCalulation', res);
      this.formGroup.patchValue({theoretical_date: res.calculatedDate});
    }catch (e) {
      console.log('error getTheoricalDateCalulation', e);
    }finally {

    }
  }

  clearDateInput(input: string) {
    this.formGroup.patchValue({
      [input]: null
    })
  }
}
