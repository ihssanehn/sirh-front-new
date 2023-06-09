import {Component, Input, LOCALE_ID, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment/moment";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {PersonalService} from "@services/personal.service";
import {MessageService} from "primeng/api";
import {
  formatDateForBackend,
  formatDateTimeForBackend,
  markFormAsDirty,
  SharedClasses
} from "@shared/Utils/SharedClasses";
import {OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl} from "ng-pick-datetime";
import {CustomDateTimeIntl, MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";
import {IDatePickerConfig} from "ng2-date-picker/lib/date-picker/date-picker-config.model";
import {isMoment} from "moment/moment";

// import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
// import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_FORMATS } from 'ng-pick-datetime-moment';
export const MY_CUSTOM_FORMATS = {
  parseInput: 'LL LT',
  fullPickerInput: 'LL LT',
  datePickerInput: 'LL',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@Component({
  selector: 'app-modal-add-sortie',
  templateUrl: './modal-add-sortie.component.html',
  styleUrls: ['./modal-add-sortie.component.scss'],
  providers: [],
})
export class ModalAddSortieComponent implements OnInit {
  error = '';
  warning = '';
  submitting: boolean;
  errorLoadData: boolean;
  loadingData: boolean;
  validators_conge =  [];
  loadingLists: boolean;
  formGroup: FormGroup;
  display_radio_end_date:boolean=false;

  config: IDatePickerConfig = {
    format: 'DD/MM/YYYY HH:mm',
    showTwentyFourHours: true,
  }

  // personal_id
  // motif_id
  // requested_at
  // end_date_preavis

  formMetaData = {
    personal_id: {
      input: 'personal_id',
      label: 'Salarié',
      placeholder: 'Selectionner le salarié',
      errorRequired: 'Le salarié est obligatoire'
    },
    motif_id: {
      input: 'motif_id',
      label: 'Motif',
      placeholder: 'Selectionner le motif',
      errorRequired: 'Le motif est obligatoire'
    },
    requested_at: {
      input: 'requested_at',
      label: 'Date reception courrier',
      placeholder: 'La date de reception du courrier',
      errorRequired: 'La date de reception du courrier est obligatoire'
    },
    end_date_preavis: {
      input: 'end_date_preavis',
      label: 'Date fin normal préavis',
      placeholder: 'La date fin normal préavis',
      errorRequired: 'La date fin normal préavis est obligatoire'
    },
    end_date: {
      input: 'end_date',
      label: 'Date de sortie',
      placeholder: 'La date de sortie',
      errorRequired: 'La date de sortie est obligatoire'
    },
    is_provisional_date: {
      input: 'is_provisional_date',
      label: 'Date de fin saisie',
      placeholder: 'La date de fin est-elle provisoire ?',
      errorRequired: 'La date fin normal préavis est obligatoire'
    }
  }

  personals = [];
  motifs = [];
  loadingSelect = {};
  id_entite = null;
  item = null;
  @Input() set data(val){
    this.item = val;
    if(this.formGroup){
      this.formGroup.patchValue({
        ...val,
        requested_at: val.requested_at ? moment(val.requested_at).format('YYYY-MM-DD'): null,
        end_date_preavis: val.end_date_preavis ? moment(val.end_date_preavis).format('DD/MM/YYYY HH:mm'): null,
        end_date: val.end_date ? moment(val.end_date).format('YYYY-MM-DD'): null,
        
      });
    }
    this.getFilterList('motifs', this.listService.list.EXIT_TYPE);
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
      motif_id: [this.item?.motif_id || null, Validators.compose([Validators.required])],
      requested_at: [this.item ? moment(this.item.requested_at).format('YYYY-MM-DD') : null, Validators.compose([Validators.required])],
      end_date_preavis: [this.item ? moment(this.item.end_date_preavis).format('YYYY-MM-DD') : null, Validators.compose([Validators.required])],
      end_date: [this.item ? moment(this.item.end_date).format('YYYY-MM-DD') : null, Validators.compose([Validators.required])],
      is_provisional_date: [this.item?.is_provisional_date || 0],
      
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
        this[items] = await this.personalService.getPersonnelAnnex({with_exited:true}).toPromise();
      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }else{
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.listService.getAll(list_name, list_param).toPromise();
        if(items ==='motifs')
          this.onMotifChanged()
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
      console.log('submit', this.formGroup.getRawValue())
      this.submitting = true;
      const params: any = {
        personal_id: this.formGroup.getRawValue().personal_id,
        motif_id: this.formGroup.getRawValue().motif_id,
        requested_at: formatDateForBackend(this.formGroup.getRawValue().requested_at),
        end_date: formatDateForBackend(this.formGroup.getRawValue().end_date),
        end_date_preavis: formatDateTimeForBackend(moment(this.formGroup.getRawValue().end_date_preavis, 'DD/MM/YYYY HH:mm')),
        is_provisional_date:this.formGroup.getRawValue().is_provisional_date
      }
      console.log('params', params);
      let res;
      if(this.item?.id){
        params.id = this.item.id;
        res = await this.personalService.exitPersonal(params).toPromise();
        this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Sortie modifié avec succès'});
      }else{
        res = await this.personalService.exitPersonal(params).toPromise();
        console.log('res ajout::',res)
        this.messageService.add({severity: res?.result?.severity ? res?.result?.severity :'success', 
                                  summary:res?.result?.severity == 'success'?'Succès':'Attention', 
                                  life:10000,
                                  detail: res?.result?.message?res.result.message:'Sortie ajouté avec succès'});
      }

      console.log('res add/update sortie', res);
      this.modal.close(res);
    }catch (e){
      if(this.item?.id){
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la modification de la sortie'});
      }else{
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'ajout de la sortie'});
      }
    }finally {
      this.submitting = false;
    }
  }

  async getPreavisCalculation() {
    const {personal_id, motif_id, requested_at} = this.formGroup.getRawValue();
    console.log('getPreavisCalculation', personal_id, motif_id, requested_at);
    if(!personal_id || !motif_id || !requested_at){
      return;
    }
    try {
      const params = {
        personal_id,
        motif_id,
        requested_at: formatDateForBackend(requested_at)
      }

      const res = await this.personalService.getPreavisCalculation(params).toPromise();
      console.log('res getPreavisCalculation', res);
      if(moment(res.calculated_date)?.isValid()) {
        this.formGroup.patchValue({end_date_preavis: moment(res.calculated_date).format('DD/MM/YYYY HH:mm')});
      }
    }catch (e) {
      console.log('error getPreavisCalculation', e);
    }finally {

    }
  }

  onMotifChanged(){
    console.log(this.formGroup.getRawValue().motif_id)
    const motifFound = this.motifs.find(motif => motif.id === this.formGroup.getRawValue().motif_id);
    console.log(motifFound)
    if(motifFound && motifFound?.code === 'demission')
      this.display_radio_end_date = true;
    else
      this.display_radio_end_date = false;
  }

  clearDateInput(input: string) {
    this.formGroup.patchValue({
      [input]: null
    })
  }
}
