import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListsService } from '@app/core/services/lists.service';
import { PersonalService } from '@app/core/services/personal.service';
import { SharedClasses, markFormAsDirty } from '@app/shared/Utils/SharedClasses';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-modal-add-entree',
  templateUrl: './modal-add-entree.component.html',
  styleUrls: ['./modal-add-entree.component.scss']
})

export class ModalAddEntreeComponent implements OnInit {
  error = '';
  warning = '';
  civilities = [];
  entities = [];
  contrats = [];
  status = [];
  sieges = [];
  managers = [];
  @Input() submitting: boolean;
  errorLoadData: boolean;
  loadingData: boolean;
  submittingCreate:boolean;
  validators_conge =  [];
  loadingLists: boolean;
  formGroup: FormGroup;

  formInputs = {
    civility: 'civility',
    matricule: 'registration_number',
    last_name: 'last_name',
    first_name: 'first_name',
    email: 'email',
    contrat: 'contrat_id',
    centre_profit: 'manager_id',
    status: 'status',
    entity: 'entity_id',
    date_entree: 'entry_date',
    is_externe:'is_externe',
    is_pe:'is_pe',
    siege:'siege_id'
  }
  formLabels =  {
    civility: 'Civilité',
    matricule: 'Matricule',
    last_name: 'Nom',
    first_name: 'Prénom',
    email: 'Email',
    contrat: 'Contrat',
    centre_profit: 'Centre de profit',
    status: 'Statut',
    entity:  'Entité',
    date_entree: 'Date d\'entrée',
    is_externe:  'Externe',
    is_pe:'Période d\'essai ?',
    siege:'Siège'
  }

    constructor(
      private formBuilder: FormBuilder,
      public modal: NgbActiveModal,
      private listService: ListsService,
      private personalService: PersonalService,
      private messageService:MessageService
) {

    this.formGroup = this.formBuilder.group({
      civility: [null, Validators.compose([Validators.required])],
      registration_number: [null],
      last_name: [null, Validators.compose([Validators.required])],
      first_name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      contrat_id: [null, Validators.compose([Validators.required])],
      manager_id: [null, Validators.compose([Validators.required])],
      status: [null, Validators.compose([Validators.required])],
      entity_id: [null, Validators.compose([Validators.required])],
      entry_date: [null, Validators.compose([Validators.required])],
      siege_id: [null, Validators.compose([Validators.required])],
      is_externe: [false],
      is_pe: [true],
    });

    this.civilities =[
      {id:1, label:'M.'},
      {id:2, label:'Mme.'}
    ]
    this.submittingCreate = false;

  }

  ngOnInit(): void {
    this.initLists()



  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.formGroup.controls[control]) ? '(*)': '';
  }

  async initLists(){
    this.status = await this.listService.getAll('status','PERSONAL').toPromise();
    this.contrats = await this.listService.getAll('contrat_type').toPromise();
    this.sieges = await this.listService.getAll('siege_type').toPromise();
    this.entities = await this.listService.getAll('entity').toPromise();
    this.managers = await this.listService.getAll('manager').toPromise();
   }


  async submitUser() {
    markFormAsDirty(this.formGroup);
    if (!this.formGroup.valid) {
      return;
    }
    try{
      this.submittingCreate = true;
      const params = this.formGroup.getRawValue();
      this.personalService.submitEntree(params).toPromise().then( val => {
        this.messageService.add({severity:'success', summary: 'Succès',   detail: val.result.message, sticky: false});
        this.modal.close();

      }).catch( err => {
        const errors = [];
        console.log('errors::::',err)
        Object.keys(err.error.errors).map((key: any) => {
            errors.push(key + ' : ' + err.error.errors[key]);
          this.messageService.add({severity:'error', summary: 'Echec', detail:  err.error.errors[key].message, sticky: false});
        });
        this.submittingCreate = false;
      })

    }catch (e){

    }finally {
      this.submittingCreate = false;
    }
  }

  clearDateInput(input: string) {
    this.formGroup.controls[input].setValue(null);
  }
}
