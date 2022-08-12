import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "@app/core/entities";
import {ErrorService, UserService} from "@app/core/services";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {getFormValidationErrors, markFormAsDirty, SharedClasses} from "@shared/Utils/SharedClasses";
import {$userRoles} from "@shared/Objects/sharedObjects";
import * as moment from "moment";
import {isMoment} from "moment";
import {MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";

@Component({
  selector: 'app-group-add-stepper',
  templateUrl: './group-add-stepper.component.html',
  styleUrls: ['./group-add-stepper.component.scss']
})
export class GroupAddStepperComponent implements OnInit, AfterViewInit {
  groupFormGroup: FormGroup;
  errors : Array<any> = [];
  $userRoles = $userRoles;
  allRoles = [
    'manager', 'superadmin', 'user'
  ];
  error = '';
  warning = '';
  @Input() submitting: boolean;

  formInputs = {
    personal_id: 'personal_id',
    cp_id: 'cp_id',
    entry_date: 'entry_date',
    old_cp: 'old_cp',
  }
  formLabels =  {
    personal_id: 'Utilisateur',
    cp_id: 'Nouveau Centre de profit',
    entry_date: 'Date d\'entrée',
    old_cp: 'Base',
  }

  errorLoadData: boolean;
  loadingData: boolean;
  submittingPhoto: boolean;
  validators_conge =  [];
  loadingLists: boolean;
  @Input() title = '';
  @Input() type = '';
  @Input()  idUser: any;
  profit_centers = [];
  users = [];
  id_entite = null;
  loadingUsers = false;


  constructor(private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private router: Router,
              private location: Location,
              private modalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private translate: TranslateService,
              private changeDetectorRef: ChangeDetectorRef,
              private listService: ListsService,
              private mainStore: MainStore,
              private userService : UserService) {

    this.noWhitespaceValidator.bind(this);
    this.initFormBuilder();
    this.modalService.dismissAll();
  }


  initFormBuilder(){
    this.groupFormGroup = this.formBuilder.group({
      personal_id: [null, [Validators.required]],
      cp_id: [null, [Validators.required]],
      entry_date: [null, [Validators.required]],
      old_cp: null,
    });
  }

  ngAfterViewInit(): void {

  }

  async ngOnInit(){
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    if(!this.id_entite){
      this.error = 'Veillez penser à sélectionner une entité';
    }else{
      this.error = '';
    }

    try{ this.profit_centers = await this.listService.getAll(this.listService.list.PROFIT_CENTER, {id: this.id_entite}).toPromise();} catch (e) {console.log('error filter PROFIT_CENTER', e);}

  }

  async openSelect(selectname, list){

    if(selectname === 'users'){
      if(!this.groupFormGroup.value.old_cp){
        return;
      }
      try{
        this.loadingUsers = true;
        this.users = await this.listService.getPersonalsByCpId({cp_id: this.groupFormGroup.value.old_cp}).toPromise();
      } catch (e) {
        console.log('error filter PROFIT_CENTER', e);
      }finally {
        this.loadingUsers = false;
      }
    }

  }



  isRequired(control) {
    return SharedClasses.isControlRequired(this.groupFormGroup.controls[control]) ? '(*)': '';
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
  }

  goback() {
    this.location.back();
  }

  cancelEditting() {

  }

  async save() {
    this.error = '';
    markFormAsDirty(this.groupFormGroup);
    if(!this.groupFormGroup.valid ){
      this.error = 'Il y a des éléments qui nécessitent votre attention';
      getFormValidationErrors(this.groupFormGroup);
      return;
    }
      try{
        this.submitting = true;
        const toSubmit = {
          personal_id: this.groupFormGroup.value.personal_id,
          cp_id: this.groupFormGroup.value.cp_id,
          entry_date: this.groupFormGroup.value['entry_date'] && isMoment(moment(this.groupFormGroup.value['entry_date'], MY_CUSTOM_DATETIME_FORMATS.supportedFormats)) ? moment(this.groupFormGroup.value['entry_date'], MY_CUSTOM_DATETIME_FORMATS.supportedFormats)?.format('YYYY-MM-DD'): null,
        }
        const res = await this.userService.submitUserGroup(toSubmit).toPromise();
        this.initFormBuilder();
        this.messageService.add({
          severity: 'success',
          summary: 'Parfait!',
          detail: 'Mise à jour réussie',
          sticky: false,
        });
      }catch (e){
        this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être sauvegardées`, 'error');
      }finally {
        this.submitting = false;
      }
  }

  clearDateInput(input: string) {
    this.groupFormGroup.patchValue({
      [input]: null
    })
  }

  returnfalse(){
    return false;
  }
}
