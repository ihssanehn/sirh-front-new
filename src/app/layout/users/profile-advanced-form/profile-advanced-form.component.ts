import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListsService } from '@app/core/services/lists.service';
import { PersonalService } from '@app/core/services/personal.service';
import { MessageService } from 'primeng/api';
import { SharedClasses, markFormAsDirty } from '@app/shared/Utils/SharedClasses';
import {User} from "@app/core/entities";

@Component({
  selector: 'app-profile-advanced-form',
  templateUrl: './profile-advanced-form.component.html',
  styleUrls: ['./profile-advanced-form.component.scss']
})
export class ProfileAdvancedFormComponent implements OnInit {
  error = '';
  warning = '';
  civilities = [];
  entities = [];
  contrats = [];
  status = [];
  sieges = [];
  managers = [];
  bus = [];
  @Input() submitting: boolean;
  @Output() onUpdatePersonal: EventEmitter<any> = new EventEmitter();

  @Input()
  public set personal(val: User) {
    if(val){
      console.log('input of user :: ',val)
      this.initFormBuilder(val)
    }
  }
  errorLoadData: boolean;
  loadingData: boolean;
  submittingUpdate:boolean;
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
    is_active:'is_active',
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
    is_active:'Actif ?',
    siege:'Siège'
  }

    constructor(
      private formBuilder: FormBuilder,
      private listService: ListsService,
      private personalService: PersonalService,
      private messageService:MessageService,
) {

    this.formGroup = this.formBuilder.group({
      id: [null, Validators.compose([Validators.required])],
      civility: [null],
      registration_number: [null],
      last_name: [null, Validators.compose([Validators.required])],
      first_name: [null, Validators.compose([Validators.required])],
      email: [null],
      contrat_id: [null, Validators.compose([Validators.required])],
      manager_id: [null, Validators.compose([Validators.required])],
      status_id: [null, Validators.compose([Validators.required])],
      entity_id: [null, Validators.compose([Validators.required])],
      entry_date: [null, Validators.compose([Validators.required])],
      siege_id: [null, Validators.compose([Validators.required])],
      is_externe: [false],
      is_active: [null],
    });

    this.civilities =[
      {id:1, label:'M.'},
      {id:2, label:'Mme.'}
    ]
    this.submittingUpdate = false;

  }

  ngOnInit(): void {
    this.initLists()



  }

  initFormBuilder(personal: any){
    if(personal){
      console.log('init form buimder personal::', personal)
      this.formGroup.patchValue({
        ...personal,
        first_name:personal?.prenom,
        last_name:personal?.nom
      });
      console.log(this.formGroup)
    }
  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.formGroup.controls[control]) ? '(*)': '';
  }

  async initLists(){
    this.status = await this.listService.getAll('status','PERSONAL').toPromise();
    this.contrats = await this.listService.getAll('contrat_type').toPromise();
    this.sieges = await this.listService.getAll('siege_type').toPromise();
    this.managers = await this.personalService.getManagers({'without_archive':1}).toPromise();
    this.entities = await this.personalService.getMetaData('ENTITY').toPromise();
    this.bus = await this.personalService.getMetaData('BU').toPromise();
   }


  async updatePersonal() {
    markFormAsDirty(this.formGroup);
    if (!this.formGroup.valid) {
      return;
    }
    try{
      this.submittingUpdate = true;
      const params = this.formGroup.getRawValue();
      this.personalService.update(params).toPromise().then( val => {
        if(val && val?.result?.data){
          this.onUpdatePersonal.emit(val.result.data);
          this.submittingUpdate = false;
          this.messageService.add({severity:'success', summary: 'Succès',   detail: val.result.message, sticky: false});
        }

      }).catch( err => {
        const errors = [];
        Object.keys(err.error.errors).map((key: any) => {
            errors.push(key + ' : ' + err.error.errors[key]);
          this.messageService.add({severity:'error', summary: 'Echec', detail:  err.error.errors[key].message, sticky: false});
        });
        this.submittingUpdate = false;
      })

    }catch (e){

    }finally {
    }
  }

  clearDateInput(input: string) {
    this.formGroup.controls[input].setValue(null);
  }

}
