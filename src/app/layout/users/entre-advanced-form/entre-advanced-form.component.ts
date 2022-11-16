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
  selector: 'app-entre-advanced-form',
  templateUrl: './entre-advanced-form.component.html',
  styleUrls: ['./entre-advanced-form.component.scss'],
})
export class EntreAdvancedFormComponent implements OnInit, AfterViewInit {
  formGroup: FormGroup;
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
    verification_ts_prefacture: 'verification_ts_prefacture',
    identity_card: 'identity_card',
    info_mail: 'info_mail',
    bilan_integration: 'bilan_integration',
    demande_autorisation_travail: 'demande_autorisation_travail',
    attestation_CPAM: 'attestation_CPAM',
    mail_embauche: 'mail_embauche',
    journee_integration_remise_kit: 'journee_integration_remise_kit',
    contrat_signe: 'contrat_signe',
    rib: 'rib',
    envoi_code_sirh: 'envoi_code_sirh',
    bouteille_champagne: 'bouteille_champagne',
    dpae: 'dpae',
    relance_mail_doc: 'relance_mail_doc',
    saisi_adp: 'saisi_adp',
    apicil_doc: 'apicil_doc',
    apicil_affiliation: 'apicil_affiliation',
    inscription_ast: 'inscription_ast',
    maj_tableau_primes: 'maj_tableau_primes',
    creation_sirh: 'creation_sirh',
    modif_matricule_sirh: 'modif_matricule_sirh',
  }
  formLabels =  {
    personal_id: 'personal_id',
    verification_ts_prefacture: 'Salariés étrangers (Vérification TS préfecture)',
    identity_card: 'Carte d’identité',
    info_mail: 'Mail informatique',
    bilan_integration: 'Bilan d’intégration',
    demande_autorisation_travail: 'Salariés étrangers (Demande d’Autorisation de Travail)',
    attestation_CPAM: 'Attestation CPAM',
    mail_embauche: 'Mail Embauche',
    journee_integration_remise_kit: 'Journée D\'intégration + Remise Du Kit',
    contrat_signe: 'Contrat signné',
    rib: 'RIB',
    envoi_code_sirh: 'Envoi Code SIRH',
    bouteille_champagne: 'Bouteille De Champagne',
    dpae: 'DPAE',
    relance_mail_doc: 'Relance Mail Documents',
    saisi_adp: 'Saisie ADP',
    apicil_doc: 'APICIL (Doc)',
    apicil_affiliation: 'APICIL (Affiliation)',
    inscription_ast: 'Inscription AST',
    maj_tableau_primes: 'MAJ Tableau Primes',
    creation_sirh: 'Création SIRH',
    modif_matricule_sirh: 'Modif Matricule SIRH'
  }

  errorLoadData: boolean;
  loadingData: boolean;
  @Input() title = '';
  @Input() type = '';
  @Input()  idUser: any;
  @Input()  profile_id: any;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Output() submitEntree: EventEmitter<any> = new EventEmitter();
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

    this.formGroup = this.formBuilder.group({
      personal_id: [null],
      verification_ts_prefacture: [null],
      identity_card: [null],
      info_mail: [null],
      bilan_integration: [null],
      demande_autorisation_travail: [null],
      attestation_CPAM: [null],
      mail_embauche: [null],
      journee_integration_remise_kit: [null],
      contrat_signe: [null],
      rib: [null],
      envoi_code_sirh: [null],
      bouteille_champagne: [null],
      dpae: [null],
      relance_mail_doc: [null],
      saisi_adp: [null],
      apicil_doc: [null],
      apicil_affiliation: [null],
      inscription_ast: [null],
      maj_tableau_primes: [null],
      creation_sirh: [null],
      modif_matricule_sirh: [null],
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
    this.formGroup.patchValue(data);
  }

  ngAfterViewInit(): void {

  }

  async ngOnInit(){
    // const id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
  }

  initFormBuilder(user: User){
    if(user){
      this.formGroup.patchValue({
        personal_id: user.id,
      });
    }
  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.formGroup.controls[control]) ? '(*)': '';
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
    markFormAsDirty(this.formGroup);
    if(!this.formGroup.valid ){
      this.error = 'Il y a des éléments qui nécessitent votre attention';
      getFormValidationErrors(this.formGroup);
      return;
    }
    Object.keys(this.formGroup.value).forEach(key => {
      if(this.formGroup.value[key] === 'false'){
        this.formGroup.value[key] = false;
      }
    });
    this.submitEntree.emit(this.formGroup.value);
  }
}

