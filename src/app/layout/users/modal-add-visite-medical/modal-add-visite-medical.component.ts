import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ListsService } from '@app/core/services/lists.service';
import { PersonalService } from '@app/core/services/personal.service';
import {formatDateForBackend, markFormAsDirty, SharedClasses} from '@app/shared/Utils/SharedClasses';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import {MainStore} from "@store/mainStore.store";
import {User} from "@app/core/entities";
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import * as moment from "moment/moment";
import {MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-modal-add-visite-medical',
  templateUrl: './modal-add-visite-medical.component.html',
  styleUrls: ['./modal-add-visite-medical.component.scss']
})

export class ModalAddVisiteMedicalComponent implements OnInit {
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
    centre: {
      input: 'centre',
      label: 'Centre medical',
      placeholder: 'Selectionner le centre medical',
      errorRequired: 'Le centre medical est obligatoire'
    },
    scheduled_date: {
      input: 'scheduled_date',
      label: 'Date de la visite',
      placeholder: 'Sélectionner la date de la visite',
      errorRequired: 'La date est obligatoire'
    }
  }

  personals = [];
  medical_centers = [];
  loadingSelect = {};
  id_entite = null;
  item = null;
  @Input() set data(val){
    this.item = val;
    if(this.formGroup){
      this.formGroup.patchValue({
        ...val,
        scheduled_date: moment(val.scheduled_date).format('YYYY-MM-DD')
      });
    }
    this.getFilterList('personals', this.listService.list.PERSONAL);
  }

  @Input()
  public set setIdItem(id) {
    if(id && this.formGroup){
      this.formGroup.patchValue({
        id: id
      });
    }
  }

  searching = false;

  medical_center_search =  (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap( (term) => {
          return this.listService.getAll(this.listService.list.MEDICAL_CENTER, {keyword: term});
        }
      ),
      tap(() => (this.searching = false)),
    );


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
      personal_id: [this.item?.type_id || null, Validators.compose([Validators.required])],
      centre: [this.item?.type_id || null, Validators.compose([Validators.required])],
      scheduled_date: [this.item ? moment(this.item.effective_date).format('YYYY-MM-DD') : null]
    });
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    // this.getFilterList('medical_centers', this.listService.list.MEDICAL_CENTER);
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
console.log('this.item this.medical_centers', this.medical_centers);
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
        centre: this.formGroup.getRawValue().centre,
        scheduled_date: formatDateForBackend(this.formGroup.getRawValue().scheduled_date),
      }

      let res;
      if(this.item?.id){
        params.id = this.item?.id;
        res = await this.personalService.updateVM(params).toPromise();
        this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Visite medicale modifié avec succès'});
      }else{
        res = await this.personalService.addVM(params).toPromise();
        this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Visite medicale ajouté avec succès'});
      }

      console.log('res add/update medical visite', res);
      this.modal.close(res);
    }catch (e){
      if(this.item?.id){
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la modification de la visite médicale'});
      }else{
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'ajout de la visite médicale'});
      }
    }finally {
      this.submitting = false;
    }
  }


  clearDateInput(input: string) {
    this.formGroup.patchValue({
      [input]: null
    })
  }
}
