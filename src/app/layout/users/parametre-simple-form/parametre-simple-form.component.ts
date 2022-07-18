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
import {isMoment} from "moment";
import {MainStore} from "@store/mainStore.store";



@Component({
  selector: 'app-parametre-simple-form',
  templateUrl: './parametre-simple-form.component.html',
  styleUrls: ['./parametre-simple-form.component.scss'],
})
export class ParametreSimpleFormComponent implements OnInit, AfterViewInit {
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
    billing_admin_id: 'billing_admin_id',
    project_creation_right_id: 'project_creation_right_id',
    has_internal_billing_admin: 'has_internal_billing_admin',
    has_admin_gp: 'has_admin_gp',
    has_travel_admin: 'has_travel_admin',
    formation_admin_id: 'formation_admin_id',
    cash_management_id: 'cash_management_id',
    management_obs_manager_id: 'management_obs_manager_id',
    interview_access_id: 'interview_access_id',
    theoretical_interview_date_id: 'theoretical_interview_date_id',
    has_trial_period_access: 'has_trial_period_access',
    has_multi_etp_access: 'has_multi_etp_access',
    satisfaction_consultant_id: 'satisfaction_consultant_id',
    security_review_id: 'security_review_id',
    access_proposals_id: 'access_proposals_id',
    employee_follow_up_id: 'employee_follow_up_id',
    has_advance_management: 'has_advance_management',
    has_access_management_predefined_states: 'has_access_management_predefined_states',
    package_management_id: 'package_management_id',
    questionnaire_access_id: 'questionnaire_access_id',
    ct_request_model_management_id: 'ct_request_model_management_id',
    hr_document_access_id: 'hr_document_access_id',
    has_not_interviewed: 'has_not_interviewed',
    /// Part 2
    has_ar_final_validation: 'has_ar_final_validation',
    ra_cancellation_right_id: 'ra_cancellation_right_id',
    fee_confirmation_id: 'fee_confirmation_id',
    profile_caption_overload_id: 'profile_caption_overload_id',
    is_virtual_user: 'is_virtual_user',
    has_right_da: 'has_right_da',
    has_right_br: 'has_right_br',
    has_view_all_da: 'has_view_all_da',
    has_purchase_invoice_right: 'has_purchase_invoice_right',
    has_admin_settings: 'has_admin_settings',
    supplier_reference_right_id: 'supplier_reference_right_id',
    closing_synthesis_right_id: 'closing_synthesis_right_id',
    prevention_plan_admin_id: 'prevention_plan_admin_id',
    is_employee_subject_local_scheme: 'is_employee_subject_local_scheme',
    has_access_medical_visits: 'has_access_medical_visits',
    has_master_project_management: 'has_master_project_management',
    has_visu_commercial_margin: 'has_visu_commercial_margin',
    document_administration_id: 'document_administration_id',
    has_administration_type_rh_document: 'has_administration_type_rh_document',
    has_right_validate_pointing: 'has_right_validate_pointing',
    has_meal_ticket_right: 'has_meal_ticket_right'
  }

  formLabels =  {
    id: 'id',
    billing_admin_id: 'Admin facturation',
    project_creation_right_id: 'Droit création projet',
    has_internal_billing_admin: 'Admin facturation interne',
    has_admin_gp: 'Admin GP',
    has_travel_admin: 'Admin déplacements',
    formation_admin_id: 'Admin formation',
    cash_management_id: 'Cash management (paiement des factures)',
    management_obs_manager_id: 'Gestion des responsables OBS',
    interview_access_id: 'Accès entretiens',
    theoretical_interview_date_id: 'Date théorique entretien',
    has_trial_period_access: 'Accès période essai',
    has_multi_etp_access: 'Accès multi ETP',
    satisfaction_consultant_id: 'Satisfaction consultant',
    security_review_id: 'Revue sécurité',
    access_proposals_id: 'Accès Propositions',
    employee_follow_up_id: 'Suivi salariés',
    has_advance_management: 'Gestion des avances',
    has_access_management_predefined_states: 'Gestion accès états prédéfinis',
    package_management_id: 'Gestion forfait',
    questionnaire_access_id: 'Accès questionnaires',
    ct_request_model_management_id: 'Gestion modèle demande CT',
    hr_document_access_id: 'Accés document RH',
    has_not_interviewed: 'Non soumis aux entretiens',
    /// Part 2
    has_ar_final_validation: 'Validation finale RA',
    ra_cancellation_right_id: 'Droit Annulation RA',
    fee_confirmation_id: 'Validation frais',
    profile_caption_overload_id: 'Surcharge libellé profil',
    is_virtual_user: 'Utilisateur Virtuel',
    has_right_da: 'Droit DA',
    has_right_br: 'Droit BR',
    has_view_all_da: 'Visu toutes DA',
    has_purchase_invoice_right: 'Droit facture achat',
    has_admin_settings: 'Ddmin paramétrage',
    supplier_reference_right_id: 'Droit référentiel fournisseur',
    closing_synthesis_right_id: 'Droit synthère cloture',
    prevention_plan_admin_id: 'Admin plan de prévention',
    is_employee_subject_local_scheme: 'Salarié soumis au régime local (Alsace/Moselle)',
    has_access_medical_visits: 'Accès visites médicales',
    has_master_project_management: 'Gestion Master Projet',
    has_visu_commercial_margin: 'Visu Marge commerciale',
    document_administration_id: 'Adminstration documents',
    has_administration_type_rh_document: 'Administration type documents RH (référentiel)',
    has_right_validate_pointing: 'Droit validation pointage',
    has_meal_ticket_right: 'Droit ticket restaurant'
  }


  billing_admins = [];
  project_creation_rights = [];
  formation_admins =  [];
  cash_managements = [];
  management_obs_managers = [];
  interview_accesses = [];
  theoretical_interview_dates = [];
  satisfaction_consultants = [];
  security_reviews = [];
  access_proposals = [];
  employee_follow_ups = [];
  package_managements = [];
  questionnaire_accesses =  [];
  ct_request_model_managements = [];
  hr_document_accesses = [];
  ra_cancellation_rights = [];
  fee_confirmations = [];
  profile_caption_overloads = [];
  supplier_reference_rights = [];
  closing_synthesis_rights  = [];
  prevention_plan_admins = [];
  document_administrations = [];

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
  @Input()
  public set user(val: User) {
    if(val){
      this.initFormBuilder(val);
    }
  }

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
    this.userFormGroup = this.formBuilder.group({
      id: [null],
      billing_admin_id: [null],
      project_creation_right_id: [null],
      has_internal_billing_admin: [null],
      has_admin_gp: [null],
      has_travel_admin: [null],
      formation_admin_id: [null],
      cash_management_id: [null],
      management_obs_manager_id: [null],
      interview_access_id: [null],
      theoretical_interview_date_id: [null],
      has_trial_period_access: [null],
      has_multi_etp_access: [null],
      satisfaction_consultant_id: [null],
      security_review_id: [null],
      access_proposals_id: [null],
      employee_follow_up_id: [null],
      has_advance_management: [null],
      has_access_management_predefined_states: [null],
      package_management_id: [null],
      questionnaire_access_id: [null],
      ct_request_model_management_id: [null],
      hr_document_access_id: [null],
      has_not_interviewed: [null],
      /// Part 2
      has_ar_final_validation: [null],
      ra_cancellation_right_id: [null],
      fee_confirmation_id: [null],
      profile_caption_overload_id: [null],
      is_virtual_user: [null],
      has_right_da: [null],
      has_right_br: [null],
      has_view_all_da: [null],
      has_purchase_invoice_right: [null],
      has_admin_settings: [null],
      supplier_reference_right_id: [null],
      closing_synthesis_right_id: [null],
      prevention_plan_admin_id: [null],
      is_employee_subject_local_scheme: [null],
      has_access_medical_visits: [null],
      has_master_project_management: [null],
      has_visu_commercial_margin: [null],
      document_administration_id: [null],
      has_administration_type_rh_document: [null],
      has_right_validate_pointing: [null],
      has_meal_ticket_right: [null],
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
    // if(this.idUser){
    //   this.getUser(this.idUser);
      // this.changeDetectorRef.detectChanges();
    // }
  }

  async ngOnInit(){
    if(this.activatedRoute.snapshot.params.id){
      // this.getUser(this.activatedRoute.snapshot.params.id);
    }
    const id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    // try{ this.family_situations = await this.listService.getAll(this.listService.list.FAMILY_SITUATION).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}

    this.changeDetectorRef.detectChanges();
  }


  initFormBuilder(user: User){
    console.log('initFormBuilder', user);
    user = {
      ...user,
      is_head_office: user?.is_head_office  ? true: false,
      is_part_time: user?.is_part_time ? true: false
    }
     this.userFormGroup.patchValue({
       ...user,
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
          photo_profile: file
        });

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
      // this.getUser(this.userFormGroup.value.id, false);
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
      return;
    }
    const {start_date, end_date, birthday} = this.userFormGroup.value;
    const submit = Object.assign(this.userFormGroup.value,
      {
        profile_id: this.profile_id,
        start_date: start_date && isMoment(moment(start_date)) ? moment(start_date)?.format(' YYYY-MM-DD'): null,
        end_date: end_date && isMoment(moment(end_date)) ? moment(end_date)?.format(' YYYY-MM-DD'): null,
        birthday: birthday && isMoment(moment(birthday)) ? moment(birthday)?.format(' YYYY-MM-DD'): null,
      })
    this.submitUser.emit(this.userFormGroup.value);
  }
}

