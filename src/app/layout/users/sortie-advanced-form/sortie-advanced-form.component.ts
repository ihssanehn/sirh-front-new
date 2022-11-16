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
import { NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";



@Component({
  selector: 'app-sortie-advanced-form',
  templateUrl: './sortie-advanced-form.component.html',
  styleUrls: ['./sortie-advanced-form.component.scss'],
})
export class SortieAdvancedFormComponent implements OnInit, AfterViewInit {
  parametersFormGroup: FormGroup;
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
    profile_caption_overload: 'profile_caption_overload',
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
    personal_id: 'personal_id',
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
    profile_caption_overload: 'Surcharge libellé profil',
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
  access_proposals = [];
  billing_admin = [];
  cash_management = [];
  closing_synthesis_right = []
  ct_request_model_management = []
  document_administration = []
  employee_follow_up = []
  fee_confirmation = []
  formation_admin = []
  hr_document_access = []
  interview_access = []
  management_obs_manager = []
  package_management = []
  prevention_plan_admin = []
  project_creation_right = []
  questionnaire_access = []
  ra_cancellation_right = []
  satisfaction_consultant = []
  security_review = []
  supplier_reference_right = []
  theoretical_interview_date = []




  errorLoadData: boolean;
  loadingData: boolean;
  submittingPhoto: boolean;
  photoBase64 = null;
  validators_conge =  [];
  loadingLists: boolean;
  @Input() title = '';
  @Input() type = '';
  @Input()  idUser: any;
  @Input()  profile_id: any;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Output() submitParameters: EventEmitter<any> = new EventEmitter();
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
    this.parametersFormGroup = this.formBuilder.group({
      personal_id: [null],
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
      profile_caption_overload: [null],
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
  }

  mockupData(){
    const data = {
      personal_id: 11,
      billing_admin_id: 13,
      project_creation_right_id: 15,
      has_internal_billing_admin: 1,
      has_admin_gp: 1,
      has_travel_admin: 1,
      formation_admin_id: 19,
      cash_management_id: 21,
      management_obs_manager_id: 22,
      interview_access_id: 26,
      theoretical_interview_date_id: 29,
      has_trial_period_access: 1,
      has_multi_etp_access: 1,
      satisfaction_consultant_id: 32,
      security_review_id: 36,
      access_proposals_id: 37,
      employee_follow_up_id: 42,
      has_advance_management: 1,
      has_access_management_predefined_states: 0,
      package_management_id: 46,
      questionnaire_access_id: 52,
      ct_request_model_management_id: 55,
      hr_document_access_id: 58,
      has_not_interviewed: 1,
      has_ar_final_validation: 1,
      ra_cancellation_right_id: 60,
      fee_confirmation_id: 65,
      profile_caption_overload: 'Profile Label',
      is_virtual_user: 1,
      has_right_da: 0,
      has_right_br: 1,
      has_view_all_da: 1,
      has_purchase_invoice_right: 0,
      has_admin_settings: 1,
      supplier_reference_right_id: 66,
      closing_synthesis_right_id: 68,
      prevention_plan_admin_id: 72 ,
      is_employee_subject_local_scheme: 1,
      has_access_medical_visits: 0,
      has_master_project_management: 1,
      has_visu_commercial_margin: 1,
      document_administration_id: 74,
      has_administration_type_rh_document: 0,
      has_right_validate_pointing: 1,
      has_meal_ticket_right: 1
    };
    this.parametersFormGroup.patchValue(data);
  }

  ngAfterViewInit(): void {

  }

  async ngOnInit(){
    if(this.activatedRoute.snapshot.params.id){
      // this.getUser(this.activatedRoute.snapshot.params.id);
    }
    const id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
    this.getParametersLists();
    // this.mockupData();
    this.changeDetectorRef.detectChanges();
  }

  async getParametersLists(){
    try{
      this.loadingLists = true;
      const res = await this.listService.getParameters().toPromise();
      console.log('res getParametersLists', res);
      if(res){
        Object.keys(res).forEach(key => {
          this[key] = res[key];
        });
      }
    }catch (e){

    }finally {
      this.loadingLists = false;
    }
  }

  initFormBuilder(user: User){
    if(user){
      this.parametersFormGroup.patchValue({
        personal_id: user.id,
        ...user.parameter
      });
    }
  }


  isRequired(control) {
    return SharedClasses.isControlRequired(this.parametersFormGroup.controls[control]) ? '(*)': '';
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

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }

  save() {
    this.error = '';
    markFormAsDirty(this.parametersFormGroup);
    if(!this.parametersFormGroup.valid ){
      this.error = 'Il y a des éléments qui nécessitent votre attention';
      getFormValidationErrors(this.parametersFormGroup);
      return;
    }
    Object.keys(this.parametersFormGroup.value).forEach(key => {
      if(this.parametersFormGroup.value[key] === 'false'){
        this.parametersFormGroup.value[key] = false;
      }
    });
    this.submitParameters.emit(this.parametersFormGroup.value);
  }
}

