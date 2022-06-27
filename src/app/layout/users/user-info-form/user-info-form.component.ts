import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {getFormValidationErrors, markFormAsDirty, SharedClasses} from '@shared/Utils/SharedClasses';
import {Location} from '@angular/common';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {User} from "@app/core/entities";
import * as moment from "moment";
import { NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ImageCropperComponent} from "@shared/components/image-cropper/image-cropper.component";
import {ListsService} from "@services/lists.service";



@Component({
  selector: 'app-user-info-form',
  templateUrl: './user-info-form.component.html',
  styleUrls: ['./user-info-form.component.scss'],
})
export class UserInfoFormComponent implements OnInit, AfterViewInit {
  userFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  errors : Array<any> = [];
  $userRoles = $userRoles;
  allRoles = [
      'manager', 'superadmin', 'user'
  ];
  error = '';
  warning = '';
  submitting: boolean;
  submittingPassword: boolean;
  formInputs = {
    id: 'id',
    civility: 'civility',
    last_name: 'last_name',
    first_name: 'first_name',
    telephone_personal: 'telephone_personal',
    email_personal: 'email_personal',
    address: 'address',
    code_postal: 'code_postal',
    birthday: 'birthday',
    birth_place: 'birth_place',
    nationality: 'nationality',
    number_security_social: 'number_security_social',
    family_situation_id: 'family_situation_id',
    city: 'city',

    registration_number: 'registration_number',
    start_date: 'start_date',
    end_date: 'end_date',
    telephone_professional: 'telephone_professional',
    function_id: 'function_id',
    status_id: 'status_id',
    email_professional: 'email_professional',
    urgency_name_1: 'urgency_name_1',
    urgency_telephone_1: 'urgency_telephone_1',
    family_link_1: 'family_link_1',
    contract_id: 'contract_id',
    urgency_name_2: 'urgency_name_2',
    urgency_telephone_2: 'urgency_telephone_2',
    family_link_2: 'family_link_2',

    manager_id: 'manager_id',
    cp_id: 'cp_id',
    is_virtual: 'is_virtual',
    kids_number: 'kids_number',
    validator_absence_id:  'validator_absence_id',
    profile_id: 'profile_id',
    is_part_time: 'is_part_time',
    first_annual_salary: 'first_annual_salary',

    is_head_office: 'is_head_office',
    benefits: 'benefits',
    number_carte_vitale: 'number_carte_vitale',


    // creator_id: 'creator_id',
    // archive: 'archive',
    // profil_conges_id: 'profil_conges_id',
    // profil_conges_custom: 'profil_conges_custom',
    // profil_conges_customs_id: 'profil_conges_customs_id',
    // cout_revient: 'cout_revient',
    // cout_vente: 'cout_vente',
    // remember_token: 'remember_token',
    // is_temps_partiel: 'is_temps_partiel',
    // is_hors_siege: 'is_hors_siege',
    // contract_id: 'contract_id',
    // validite_titre_sejour: 'validite_titre_sejour',

    // validateur_absence_id: 'validateur_absence_id',
    // is_fr: 'is_fr',
    // titre_sejour_id: 'titre_sejour_id',
    // date_fin_periode_essais: 'date_fin_periode_essais',
    // has_done_periode_essais: 'has_done_periode_essais',
    // periode_essais_comment: 'periode_essais_comment',
    // type_titre_sejour: 'type_titre_sejour',
    // num_titre_sejour: 'num_titre_sejour',
    // status_pe_id: 'status_pe_id',
    // photo_profil_id: 'photo_profil_id',
    // duree_mission: 'duree_mission',
    //
    //
    // nombre_enfants: 'nombre_enfants',
    // salaire_brut: 'salaire_brut',
    // compte_salarie: 'compte_salarie',
    // avantage_nature: 'avantage_nature',
    // has_tjm_fixed: 'has_tjm_fixed',
    // is_travailleur_handicape: 'is_travailleur_handicape',
    // cp_cp_id: 'cp_cp_id',
  }
  user: User;


  family_situations = [];
  status = [];
  functions = [];
  contracts = [];
  profiles =  [];
  entities =  [];
  managers =  [];
  profit_centers =  [];

  errorLoadData: boolean;
  loadingData: boolean;
  submittingPhoto: boolean;
  photoBase64 = null;
  validators_conge =  [];
  @Input() title = '';
  @Input() type = '';
  @Input()  idUser: any;
  @Input()  profile_id: any;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Output() submitUser: EventEmitter<any> = new EventEmitter();

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
              private userService : UserService) {

    this.noWhitespaceValidator.bind(this);
    this.userFormGroup = this.formBuilder.group({
      id: [null],
      civility: [null, Validators.required],
      last_name: [null, Validators.required],
      first_name: [null, Validators.required],
      telephone_personal: [null, Validators.required],  //to add
      email_personal: [null],
      address: [null],
      code_postal: [null],
      birthday: [null, Validators.required],
      birth_place: [null, Validators.required],
      nationality: [null, Validators.required],
      number_security_social: [null],
      family_situation_id: [null],
      city: [null],

      registration_number: [null],
      start_date: [null, Validators.required],
      end_date: [null],
      telephone_professional: [null],
      function_id: [null],
      status_id: [null, Validators.required],
      email_professional: [null, Validators.required],

      urgency_name_1: [null],
      urgency_telephone_1: [null],
      family_link_1: [null],
      contract_id: [null, Validators.required],

      urgency_name_2: [null],
      urgency_telephone_2: [null],
      family_link_2: [null],


      manager_id: [null, Validators.required],
      cp_id: [null, Validators.required],
      is_virtual: [false],
      kids_number: [null],

      validator_absence_id: [null],
      profile_id: [null, Validators.required],
      is_head_office: [null, Validators.required],
      is_part_time: [null],
      first_annual_salary: [null],

      benefits: [null],
      number_carte_vitale: [null],
      // creator_id: [null, Validators.required],
      // archive: [null, Validators.required],
      // profil_conges_id: [null, Validators.required],
      // profil_conges_custom: [null, Validators.required],
      // profil_conges_customs_id: [null, Validators.required],
      // cout_revient: [null, Validators.required],
      // cout_vente: [null, Validators.required],
      // remember_token: [null, Validators.required],
      // is_temps_partiel: [null, Validators.required],
      // is_hors_siege: [null, Validators.required],

      // validite_titre_sejour: [null, Validators.required],
      // validateur_absence_id: [null, Validators.required],
      // is_fr: [null, Validators.required],
      // titre_sejour_id: [null, Validators.required],
      // date_fin_periode_essais: [null, Validators.required],
      // has_done_periode_essais: [null, Validators.required],
      // periode_essais_comment: [null, Validators.required],
      // type_titre_sejour: [null, Validators.required],
      // num_titre_sejour: [null, Validators.required],
      // status_pe_id: [null, Validators.required],
      // photo_profil_id: [null, Validators.required],
      // duree_mission: [null, Validators.required],
      //
      //
      // nombre_enfants: [null, Validators.required],
      // salaire_brut: [null, Validators.required],
      // compte_salarie: [null, Validators.required],
      // avantage_nature: [null, Validators.required],
      // has_tjm_fixed: [null, Validators.required],
      // is_travailleur_handicape: [null, Validators.required],
      // cp_cp_id: [null, Validators.required],
    });

    this.modalService.dismissAll();

    this.passwordFormGroup = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirm_password: [null, [Validators.required, Validators.minLength(6)]],
    }, {validator: this.passwordConfirming});
    this.activatedRoute.params.subscribe(params => {
      console.log('params', params);
    })
  }

  ngAfterViewInit(): void {
    if(this.idUser){
      this.getUser(this.idUser);
      this.changeDetectorRef.detectChanges();
    }
  }

  async ngOnInit(){
    if(this.activatedRoute.snapshot.params.id){
      this.getUser(this.activatedRoute.snapshot.params.id);
    }

    try{ this.family_situations = await this.listService.getAll(this.listService.list.FAMILY_SITUATION).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.functions = await this.listService.getAll(this.listService.list.FUNCTION).toPromise();} catch (e) {console.log('error filter FUNCTION', e);}
    try{ this.contracts = await this.listService.getAll(this.listService.list.CONTRACT).toPromise();} catch (e) {console.log('error filter CONTRACT', e);}
    try{ this.entities = await this.listService.getAll(this.listService.list.ENTITY).toPromise();} catch (e) {console.log('error filter ENTITY', e);}
    try{  this.managers = await this.listService.getAll(this.listService.list.MANAGER).toPromise();} catch (e) {console.log('error filter MANAGER', e);}
    try{ this.profiles = await this.listService.getAll(this.listService.list.PROFILE).toPromise();} catch (e) {console.log('error filter PROFILE', e);}
    try{ this.status = await this.listService.getAll(this.listService.list.STATUS, this.listService.list.PERSONAL).toPromise();} catch (e) {console.log('error filter PERSONAL', e);}
    try{ this.profit_centers = await this.listService.getAll(this.listService.list.PROFIT_CENTER, this.listService.list.PROFIT_CENTER).toPromise();} catch (e) {console.log('error filter PROFIT_CENTER', e);}

    this.changeDetectorRef.detectChanges();
  }


  async getUser(id, initForm=true) {
    try {
      this.loadingData = true;
      this.errorLoadData = false;
      const res = await this.userService.getOne(id).toPromise();
      console.log('getUser', res);
      this.user = res.result;
      if(initForm){
        this.initFormBuilder(this.user);
      }
      this.changeDetectorRef.detectChanges();
    } catch (error) {
      console.log('e', error);
      this.errorLoadData = false;
      this.messageService.add({severity: 'error', summary: this.translate.instant('FAILURE!'), detail: 'Une erreur est survenue lors de la réccupération des donnnées de ccet utilisateur',  sticky: false});
    } finally {
      this.loadingData = false;
    }
  }

  initFormBuilder(user: User){
    console.log('initFormBuilder', user);
     this.userFormGroup.patchValue({
       ...user
    });
  }

  // submit(){
  //   this.errors = [];
  //   this.userService.update(this.userFormGroup.value).toPromise().then((val) => {
  //     this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  //   }).catch( err => {
  //     this.errors = this.errorService.format(err);
  //   })
  // }


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


  async submitChangePassword() {
    Object.keys(this.passwordFormGroup.controls).forEach(key => {
      this.passwordFormGroup.get(key).markAsDirty();
    });
    if(!this.passwordFormGroup.valid ){
      return;
    }
    let toSubmit = this.passwordFormGroup.value;
    toSubmit.id = this.userFormGroup.value.id;

    this.submittingPassword = true;
    try {
      const result = await this.userService.update(toSubmit).toPromise();
      if (result) {
        this.getUser(this.userFormGroup.value.id);
        this.messageService.add({severity: 'success', summary: 'Succès',
          detail: 'Mot de passe mis à jour avec succès', sticky: false});
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log('e', error);
      this.messageService.add({severity: 'error', summary: this.translate.instant('FAILURE!'), detail: 'Erreur de mise à jour du mot de passe de cet utilisateur',  sticky: false});
    } finally {
      this.submittingPassword = false;
      this.passwordFormGroup.reset();
    }
  }


  isRequired(control) {
    return SharedClasses.isControlRequired(this.userFormGroup.controls[control]) ? '(*)': '';
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
  }

  goback() {
    this.location.back();
  }

  passwordConfirming(c: AbstractControl): { passwordMismatch: boolean } {
    if (c.get('password').value !== c.get('confirm_password').value
        && c.get('confirm_password').value !== null) {
      console.log('passwordMismatch');
      return {passwordMismatch: true};
    }
  }

  uploadFile(e: Event) {
    console.log('uploadFile', e);

  }

  getAnciente() {
    const info = this.userFormGroup?.value;
    if(info){

      const diff = moment().diff(moment(info.start_date, 'YYYY-MM-DD'), 'months');
      let ans: any = Math.floor(diff/12);

      const month = diff % ans;
      ans = ans > 2 ? ans+' ans' : ans+' année';
      return ans + ' et '+month+ ' mois';
    }else {
      return '';
    }
  }

  filechanged(event) {
    // if(this.modalService.hasOpenModals()){
    //   return;
    // }
    const modalRef = this.modalService.open(ImageCropperComponent);
    modalRef.componentInstance.title = 'Photo de profil';
    modalRef.componentInstance.file = event.target.files[0];
    modalRef.componentInstance.submitImage.subscribe(({file, base64}) => {
      console.log('cropper result ', file);
      this.photoBase64 = base64;
      if (file instanceof File) {
        this.userFormGroup.patchValue({
          photo_de_profil: file
        });
        if(this.userFormGroup?.value?.id){
          this.onSubmitProfilePicture(file);
        }
      }
    });
  }

  private async onSubmitProfilePicture(file) {
    if(this.submittingPhoto){
      return;
    }
    try{
      this.submittingPhoto = true;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('id', this.userFormGroup.value.id);
      const res = await this.userService.setProfilePicture(fd).toPromise();
      this.getUser(this.userFormGroup.value.id, false);
    }catch (e){

    }finally {
      this.submittingPhoto = false;
    }
  }

  cancelEditting() {

  }

  isDisabled() {
    // markFormAsDirty(this.userFormGroup)
  }







  async onSubmit() {
    console.log('submit', this.userFormGroup.value);
    markFormAsDirty(this.userFormGroup);
    if(!this.userFormGroup.valid){
      return;
    }
    const params = {
      id: this.user?.id,
      ...this.userFormGroup.value,
        // fonction: this.fonctionsPersonnels.find(el => el.id === this.userFormGroup.value.function_id),
        // status: this.status.find(el => el.id === this.userFormGroup.value.status_id),
        // category: this.categoriesFonctions.find(el => el.id === this.userFormGroup.value.contract_id),
        // situation_famille: this.situationsfamilles.find(el => el.id === this.userFormGroup.value.situation_famille_id)
    }

    this.submitting = true;
    try{
      const res = await this.userService.update(params).toPromise();
      console.log('res', res);
      this.getUser(this.user.id);
      this.messageService.add({severity: 'success', summary: 'Parfait!', detail: 'Informations Mis à jour avec succès'});
    }catch (e){
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Une erreur est survenue'});
    }finally {
      this.submitting = false;
    }
  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }

  saveUser() {
    this.error = '';
    markFormAsDirty(this.userFormGroup);
    if(!this.userFormGroup.valid ){
      this.error = 'Il y a des éléments qui nécessitent votre attention';
      // console.log('getFormValidationErrors', );
      getFormValidationErrors(this.userFormGroup);
      // return;
    }
    this.submitUser.emit(this.userFormGroup.value);
  }
}

