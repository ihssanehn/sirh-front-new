import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {getFormValidationErrors, markFormAsDirty, SharedClasses} from '@shared/Utils/SharedClasses';
import {Location} from '@angular/common';
import {User} from "@app/core/entities";
import { NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";



@Component({
  selector: 'app-basic-info-form',
  templateUrl: './user-basic-form.component.html',
  styleUrls: ['./user-basic-form.component.scss'],
})
export class UserBasicFormComponent implements OnInit, AfterViewInit {
  userFormGroup: FormGroup;
  errors : Array<any> = [];

  permissions = [];
  profiles =  [];
  error = '';
  warning = '';
  formInputs = {
    id: 'id',
    last_name: 'last_name',
    first_name: 'first_name',
    email: 'email',
    password: 'password',
    password_confirm: 'password_confirm',
    address: 'address',
    permission_ids: 'permission_ids',
    profile_id: 'profile_id',
  }

  errorLoadData: boolean;
  loadingData: boolean;

  loadingSelect = {};
  id_entite = null;
  showChangePassword = false;
  constructor(private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private router: Router,
              private location: Location,
              private modalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private translate: TranslateService,
              private changeDetectorRef: ChangeDetectorRef,
              public listService: ListsService,
              private mainStore: MainStore,
              private userService : UserService) {

    this.passwordConfirming = this.passwordConfirming.bind(this);
    this.userFormGroup = this.formBuilder.group({
      id: [null],
      email: [null, Validators.required],
      last_name: [null, Validators.required],
      first_name: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(6)]],
      password_confirm: [null, [Validators.required, Validators.minLength(6)]],
      address: [],
      permission_ids: [[]],
      profile_id: [null]
    }, {validator: this.passwordConfirming});

    this.modalService.dismissAll();

    this.activatedRoute.params.subscribe(async params => {
      console.log('params', params);
      if(Number(params.id)){
          await this.getUser(params.id);
      }
    })
  }

  ngAfterViewInit(): void {
    // if(this.idUser){
    //   this.getUser(this.idUser);
      // this.changeDetectorRef.detectChanges();
    // }
  }

  async ngOnInit(){
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
    this.changeDetectorRef.detectChanges();
  }


  initFormBuilder(user: User) {
    if(user){
      this.userFormGroup.patchValue({
        ...user,
        permission_ids: user.permission_ids?.map(item => item.id) || [],
      });
      if(!(this.permissions?.length>0) && Array.isArray(user.permission_ids)){
        this.permissions = user.permission_ids || [];
      }
      this.getFilterList('permissions', this.listService.list.PERMISSIONS_BY_ELEMENT);
      this.getFilterList('profiles', this.listService.list.PROFILE);
    }
  }


  async submit() {
    // Object.keys(this.userFormGroup.controls).forEach(key => {
    //   this.userFormGroup.get(key).markAsDirty();
    // });
    // if(!this.userFormGroup.valid ){
    //   return;
    // }
    // let toSubmit = Object.assign({}, this.userFormGroup.value,
    //   // {
    //     // function: this.fonctionsPersonnels.find(el => el.id === this.userFormGroup.value.function_id),
    //     // status: this.status.find(el => el.id === this.userFormGroup.value.status_id),
    //     // category: this.categoriesFonctions.find(el => el.id === this.userFormGroup.value.contract_id),
    //     // family_situation: this.situationsfamilles.find(el => el.id === this.userFormGroup.value.family_situation_id)},
    //  );
    //
    // //Adapting it with backend
    //
    // this.submitting = true;
    // try {
    //   const result = await this.userService.update(toSubmit).toPromise();
    //   if (result) {
    //     this.getUser(this.userFormGroup.value.id);
    //     this.messageService.add({severity: 'success', summary: 'Succès',
    //       detail: 'Utilisateur mis à jour avec succès', sticky: false});
    //   } else {
    //     throw new Error();
    //   }
    // } catch (error) {
    //   console.log('e', error);
    //   this.messageService.add({severity: 'error', summary: this.translate.instant('FAILURE!'), detail: 'Erreur de mise à jour des informations de cet utilisateur',  sticky: false});
    // } finally {
    //   this.submitting = false;
    // }
  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.userFormGroup.controls[control]) ? '(*)': '';
  }

  goback() {
    this.router.navigate(['/users'],
      { queryParams: this.activatedRoute.snapshot.queryParams }
      );
  }

  passwordConfirming(c: AbstractControl) {
    if(this.showChangePassword){
      if(c.get('password').value) {
        if (c.get('password')?.value.length < 6) {
          return {minLength: true};
        }

        if (!(new RegExp("(?=.*[A-Z])")).test(c.get('password').value)) {
          return {requiresUppercase: true};
        }

        if (!(new RegExp("(?=.*[a-z])")).test(c.get('password').value)) {
          return {requiresLowercase: true};
        }

        if (!(new RegExp("(?=.*[0-9])")).test(c.get('password').value)) {
          return {requiresDigit: true};
        }

        if (!(new RegExp("(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?])")).test(c.get('password').value)) {
          return {requiresSpecialChars: true};
        }

        if (c.get('password').value !== c.get('password_confirm').value && c.get('password_confirm').value !== null) {
          return {passwordMismatch: true};
        }
      }
    }
  }

  cancelEditting() {

  }

  isDisabled() {
    // markFormAsDirty(this.userFormGroup)
  }

  async saveUser() {
    this.error = '';
    markFormAsDirty(this.userFormGroup);
    if(!this.userFormGroup.valid ){
      this.error = 'Il y a des éléments qui nécessitent votre attention';
      getFormValidationErrors(this.userFormGroup);
      return;
    }
    try{
      const res = await this.userService.addUserWithPermissions(this.userFormGroup.value).toPromise();
      this.goToList();
      this.messageService.add({severity: 'success', summary: 'Succès',
        detail: 'Utilisateur ajouté avec succès', sticky: false});
    }catch (e) {
      this.messageService.add({severity: 'error', summary: this.translate.instant('FAILURE!'), detail: 'Erreur d\'ajout de l\'utilisateur',  sticky: false});
    }finally {

    }
  }


  async updateUser() {

    const params = {...this.userFormGroup.value}
    if(this.showChangePassword){
      this.userFormGroup.controls[this.formInputs.password].setValidators(Validators.required);
      this.userFormGroup.controls[this.formInputs.password].updateValueAndValidity();

      this.userFormGroup.controls[this.formInputs.password_confirm].setValidators(Validators.required);
      this.userFormGroup.controls[this.formInputs.password_confirm].updateValueAndValidity();
    }else{
      this.userFormGroup.controls[this.formInputs.password].clearValidators();
      this.userFormGroup.controls[this.formInputs.password].updateValueAndValidity();

      this.userFormGroup.controls[this.formInputs.password_confirm].clearValidators();
      this.userFormGroup.controls[this.formInputs.password_confirm].updateValueAndValidity();
      delete params.password;
      delete params.password_confirm;
    }

    this.error = '';
    markFormAsDirty(this.userFormGroup);
    if(!this.userFormGroup.valid ){
      this.error = 'Il y a des éléments qui nécessitent votre attention';
      getFormValidationErrors(this.userFormGroup);
      return;
    }

    try{
      const res = await this.userService.updateUserWithPermissions (params).toPromise();
          this.messageService.add({severity: 'success', summary: 'Succès',
            detail: 'Utilisateur mis à jour avec succès', sticky: false});
          this.getUser(this.userFormGroup.value.id);
    }catch (e) {
        this.messageService.add({severity: 'error', summary: this.translate.instant('FAILURE!'), detail: 'Erreur de mise à jour des informations de cet utilisateur',  sticky: false});
    }finally {

    }
  }

  async getFilterList(items, list_name, list_param?){
    try{
      this.loadingSelect[list_name] = true;
      this[items] = await this.listService.getAll(list_name, list_param).toPromise();
      console.log('this[items]', this[items]);
      if(items === 'permissions'){
        const formatted_permissions = [];
        this.permissions.forEach(p => {
          p.access.forEach(item => {
            item.group_by = p.label;
            formatted_permissions.push(item)
          })
        });
        this.permissions = formatted_permissions;
      }
    } catch (e) {
      console.log('error filter', e);
    } finally {
      this.loadingSelect[list_name] = false;
    }
  }

  cancel() {
    this.userFormGroup.reset();
  }

  goToList() {
    this.router.navigate(['/users/list']);
  }

  private async getUser(id: any) {
    try {
      this.loadingData = true;
      const res = await this.userService.getOneUser(id).toPromise();
      this.initFormBuilder(res?.result?.data);
      console.log('res', res?.result?.data);
    } catch (e) {
      console.log('error', e);
      this.messageService.add({severity: 'error', summary: this.translate.instant('FAILURE!'), detail: 'Erreur de chargement des informations de cet utilisateur',  sticky: false});
      this.goback();
    } finally {
      this.loadingData = false;
    }
  }
}

