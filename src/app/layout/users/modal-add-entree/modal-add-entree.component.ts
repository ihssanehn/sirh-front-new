import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListsService } from '@app/core/services/lists.service';
import { PersonalService } from '@app/core/services/personal.service';
import { SharedClasses } from '@app/shared/Utils/SharedClasses';
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
    status: 'status_id',
    entity: 'entity_id',
    date_entree: 'entry_date',
    is_externe:'is_externe',
    is_pe:'is_pe',
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
    is_pe:'Période d\'essai ?'
  }
    
    constructor(
      private formBuilder: FormBuilder, 
      public modal: NgbActiveModal,
      private listService: ListsService,
      private personalService: PersonalService,
      private messageService:MessageService
) {

    this.formGroup = this.formBuilder.group({
      // civility: [null],
      // registration_number: [null],
      // last_name: [null],
      // first_name: [null],
      // email: [null],
      // contrat_id: [null],
      // manager_id: [null],
      // status_id: [null],
      // entity_id: [null],
      // entry_date: [null],
      // is_externe: [false],
      // is_pe: [true],
      civility: ['Mme.'],
      registration_number: [1234567890965432],
      last_name: ['CHARLIST'],
      first_name: ['John'],
      email: ['user@123.mail.fr'],
      contrat_id: [95],
      manager_id: [3],
      status_id: [4],
      entity_id: [6],
      entry_date: [null],
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
    this.entities = await this.listService.getAll('entity').toPromise();
    this.managers = await this.listService.getAll('manager').toPromise();
   }


  async submitUser() {
    try{
      this.submittingCreate = true;
      const params = this.formGroup.getRawValue();
      console.log('reactive form params ::::',params)
      this.personalService.submitEntree(params).toPromise().then( val => {
        this.submittingCreate = false;
        console.log(val)
        this.messageService.add({severity:'success', summary: 'Succès',   detail: val.result.message, sticky: false});
        this.modal.close();

      }).catch( err => {
        const errors = [];
        console.log('errors::::',err)
        Object.keys(err.error.errors).map((key: any) => {
          console.log('key',key)
            errors.push(key + ' : ' + err.error.errors[key]);
          this.messageService.add({severity:'error', summary: 'Echec', detail:  err.error.errors[key].message, sticky: false});
        });
        this.submittingCreate = false;
      })
     
    }catch (e){

    }finally {

    }
  }

}
