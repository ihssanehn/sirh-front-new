import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ListsService } from '@app/core/services/lists.service';
import { PersonalService } from '@app/core/services/personal.service';
import {formatDateForBackend, markFormAsDirty, SharedClasses} from '@app/shared/Utils/SharedClasses';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import {MainStore} from "@store/mainStore.store";
import {User} from "@app/core/entities";

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
    }
  }

  personals = [];
  entretien_types = [];
  loadingSelect = {};
  id_entite = null;
  @Input() idItem = null;
  @Input()
  public set setIdItem(id) {
    if(id && this.formGroup){
      this.formGroup.patchValue({
        id: id
      });
    }
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
      id: [this.idItem, Validators.compose([Validators.required])],
      personal_id: [null, Validators.compose([Validators.required])],
      type_id: [null, Validators.compose([Validators.required])],
      theoretical_date: [null, Validators.compose([Validators.required])],
      effective_date: [null],
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
        this[items] = await this.listService.getPersonalsByCpId({entity_id: this.id_entite}).toPromise();
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
      const params = {
        ...this.formGroup.getRawValue(),
        [this.formMetaData.theoretical_date.input]:  formatDateForBackend(this.formGroup.value[this.formMetaData.theoretical_date.input])
      }
      const res = await this.personalService.addEntretien(params).toPromise();
      console.log('res addEntretien', res);
      this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Entretien ajouté avec succès'});
      this.modal.close(res);
    }catch (e){
      this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'ajout de l\'entretien'});
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
      this.formGroup.patchValue({theoretical_date: res.theoretical_date});
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
