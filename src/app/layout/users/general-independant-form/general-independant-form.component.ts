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
import {ModalPeriodeEssaiComponent} from "@layout/users/modal-periode-essai/modal-periode-essai.component";
import {MainStore} from "@store/mainStore.store";
import {MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";



@Component({
  selector: 'app-general-independant-form',
  templateUrl: './general-independant-form.component.html',
  styleUrls: ['./general-independant-form.component.scss'],
})
export class GeneralIndependantFormComponent implements OnInit, AfterViewInit {
  userFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  errors : Array<any> = [];
  $userRoles = $userRoles;
  allRoles = [
      'manager', 'superadmin', 'user'
  ];
  error = '';
  warning = '';
  @Input() submitting: boolean;
  submittingPassword: boolean;
  formInputs = {
      id: "id",
     registration_number: "registration_number",
    first_name: "first_name",
    last_name: "last_name",
    email: "email",
    civility: "civility",
    fiche_to_be_completed: "fiche_to_be_completed",
    birth_date: "birth_date",
    number_security_social: "number_security_social",
    nationality_id: "nationality_id",
    city_id: "city_id",
    address: "address",
    code_postal: "code_postal",
    telephone_fix: "telephone_fix",
    telephone_bureau: "telephone_bureau",
    telephone_portable: "telephone_portable",
    profile_id: "profile_id",
    role_id: "role_id",
    member_ship_id: "member_ship_id",
    supplier_id: "supplier_id",
    cp_id: "cp_id",
    original_company_id: "original_company_id",
    attachment_agency_id: "attachment_agency_id",
    not_billable: "not_billable",
    in_out_office: "in_out_office",
    is_part_time: "is_part_time",
    time_entry_id: "time_entry_id",
    calendar_id: "calendar_id",
    emission_of_contract_date: "emission_of_contract_date",
    signature_of_contract_date: "signature_of_contract_date",
    group_start_date: "group_start_date",
    is_group_mutation_entry: "is_group_mutation_entry",
    entry_date: "entry_date",
    depart_mail_received_date: "depart_mail_received_date",
    theory_end_date: "theory_end_date",
    end_date: "end_date",
    could_be_manager: "could_be_manager",
    manager_id: "manager_id",
    manage_holidays: "manage_holidays",
    validator_absence_id: "validator_absence_id",
    fiscal_car_power_id: "fiscal_car_power_id",
    complex_charge: "complex_charge",
    is_exclusion_etp: "is_exclusion_etp",
    is_exclusion_reporting: "is_exclusion_reporting",
    creator_id: "creator_id",
    comment: "comment",
    send_info_to_user: "send_info_to_user"
  }
  formLabels = {
    id: "id",
    //Coordonnées du salarié
    registration_number: "Matricule",
    first_name: "Prénom",
    last_name: "Nom",
    civility: "Civilité",
    birth_date: "Date de naissance",
    number_security_social: "Num sécurité sociale",
    nationality_id: "Nationalité",
    city_id: "Ville",
    address: "Adresse",
    code_postal: "Code postal",
    email: "E-mail",
    telephone_fix: "Tel fixe",
    telephone_bureau: "Tel bureau",
    telephone_portable: "Tel portable",
    //Affectations société
    profile_id: "Profil",
    role_id: "Rôle",
    member_ship_id: "Appartenance",
    supplier_id: "Fournisseur",
    cp_id: "Centre de profit",
    original_company_id: "Société d'origine",
    attachment_agency_id: "Agence de rattachement",
    not_billable: "Non Facturable",
    in_out_office: "Hors Siège",
    time_entry_id: "Saisie temps",
    calendar_id: "Calendrier",
    is_part_time: "Temps partiel",
    fiche_to_be_completed: "Fiche utilisateur à compléter", // to be done // no known
    //IN
    emission_of_contract_date: "Date d'émission du contrat de travail",
    signature_of_contract_date: "Date de signature du contrat de travail",
    group_start_date: "Date d'entrée groupe",
    is_group_mutation_entry: "Entrée par mutation groupe",
    entry_date: "Date d'entrée",
    // OUT
    depart_mail_received_date: "Date de réception du courier en cas de départ", // to be done // to add in forminputs
    theory_end_date: "Date de fin théorique", // to be done
    end_date: "Date de sortie", // to be done
    // Competence
    could_be_manager: "Salarié qui peut être chef de projet", // to be done
    manager_id: "Choix du chef de projet", // to be done
    // Gestion des congés
    manage_holidays: "Gestion des congés", // to be done
    validator_absence_id: "Validation des absences", // to be done
    // Gestion des frais
    fiscal_car_power_id: "Puissance fiscale du véhicule", // to be done
    complex_charge: "Concerne les ingénieurs conseil par exemple", // to be done
    // Reporting Opérationnel
    is_exclusion_etp: "Si cette case est cochée, l'utilisateur est exclu du reporting ETP", // to be done
    is_exclusion_reporting: "Si cette case est cochée, l'utilisateur est exclu du reporting opérationnel", // to be done
    // Commentaire
    comment: "Commentaire", // to be done
    send_info_to_user: "Envoyer les informations Sirh par mail à l'utilisateur", // to be done
    creator_id: "creator_id", // to be done
  }
  // user: User;


  family_situations = [];
  status = [];
  functions = [];
  contracts = [];
  profiles =  [];
  entities =  [];
  managers =  [];
  roles = [];
  countries = [];
  cities = [];
  companies = [];
  appartenances = [];
  suppliers = [];
  profit_centers =  [];
  attachment_agences =  [];
  time_entries =  [];
  calendiers =  [];
  fiscal_car_powers = [];

  errorLoadData: boolean;
  loadingData: boolean;
  submittingPhoto: boolean;
  loadingCities: boolean;
  photoBase64 = null;
  validators_conge =  [];
  id_entite = null;
  @Input() title = '';
  @Input() type = '';
  @Input()  idUser: any;
  @Input()  profile_id: any;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Output() submitUser: EventEmitter<any> = new EventEmitter();
  @Input()
  public set user(val: User) {
    console.log('Input()', val);
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
              public mainStore: MainStore,
              private userService : UserService) {

    this.noWhitespaceValidator.bind(this);
    const userTest = {
      id: null,
        registration_number: 323232,
      first_name:'Anass',
      last_name:'CHBANI',
      email:'a.chbani@piman-group.fr',
      civility:'M',
      fiche_to_be_completed:true,
      birth_date: moment('1995-03-23').format('DD/MM/YYYY'),
      // Validators.pattern(/^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/[0-9]{4}$/)
      number_security_social: 23223,
      nationality_id: 4,
      city_id: 227,
      address: 'Test',
      code_postal: '2020',
      telephone_fix: '0330230',
      telephone_bureau: '0330230',
      telephone_portable: '0330230',
      profile_id: 3,
      role_id: 2,
      member_ship_id: 2,
      supplier_id: 13,
      cp_id: 13,
      original_company_id: 2,
      attachment_agency_id: 2,
      not_billable: true,
      in_out_office: true,
      is_part_time: true,
      time_entry_id: 7,
      calendar_id: 5,
      emission_of_contract_date: moment('2017-01-21', MY_CUSTOM_DATETIME_FORMATS.backend_calendar_format).format('DD/MM/YYYY'),
      signature_of_contract_date: moment('2018-02-09', MY_CUSTOM_DATETIME_FORMATS.backend_calendar_format).format('DD/MM/YYYY'),
      group_start_date: moment('2016-11-03', MY_CUSTOM_DATETIME_FORMATS.backend_calendar_format).format('DD/MM/YYYY'),
      is_group_mutation_entry: true,
      entry_date: moment('2019-05-12', MY_CUSTOM_DATETIME_FORMATS.backend_calendar_format).format('DD/MM/YYYY'),
      depart_mail_received_date: moment('20220-05-12', MY_CUSTOM_DATETIME_FORMATS.backend_calendar_format).format('DD/MM/YYYY'),
      theory_end_date: moment('2025-02-19', MY_CUSTOM_DATETIME_FORMATS.backend_calendar_format).format('DD/MM/YYYY'),
      end_date: moment('2028-03-23', MY_CUSTOM_DATETIME_FORMATS.backend_calendar_format).format('DD/MM/YYYY'),
      could_be_manager: true,
      manager_id: 6,
      manage_holidays: true,
      validator_absence_id: 7,
      fiscal_car_power_id: 13,
      complex_charge: true,
      is_exclusion_etp: true,
      is_exclusion_reporting: true,
      comment: "More details",
      send_info_to_user: true
    };
    this.userFormGroup = this.formBuilder.group({
        id: [null],
        registration_number: [null,Validators.required], //Matricule *
        photo_profile: [null],
        first_name: [null],
        last_name: [null],
        email: [null],
        civility: [null],
        fiche_to_be_completed: [false],
        birth_date: [ null,
                  // Validators.pattern(/^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/[0-9]{4}$/)
        ],
        number_security_social: [null,Validators.required],
        nationality_id: [null,Validators.required],
        city_id: [null,Validators.required],
        address: [null,Validators.required],
        code_postal: [null,Validators.required],
        telephone_fix: [null,Validators.required],
        telephone_bureau: [null,Validators.required],
        telephone_portable: [null,Validators.required],
        profile_id: [null],
        role_id: [null, Validators.required],
        member_ship_id: [5, Validators.required],
        supplier_id: [null, Validators.required],
        cp_id: [null, Validators.required],
        original_company_id: [null, Validators.required],
        attachment_agency_id: [null, Validators.required],
        not_billable: [false],
        in_out_office: [false],
        is_part_time: [false],
        time_entry_id: [null],
        calendar_id: [null],
        emission_of_contract_date: [null, Validators.required],
        signature_of_contract_date: [null, Validators.required],
        group_start_date: [null],
        is_group_mutation_entry: [false],
        entry_date: [null],
        depart_mail_received_date: [null],
        theory_end_date: [null],
        end_date: [null],
        could_be_manager: [null],
        manager_id: [null, Validators.required],
        manage_holidays: [null],
        validator_absence_id: [null, Validators.required],
        fiscal_car_power_id: [null, Validators.required],
        complex_charge: [null],
        is_exclusion_etp: [false],
        is_exclusion_reporting: [false],
        comment: [null],
        send_info_to_user: [null],
        // creator_id:[null]
      });

    // this.modalService.dismissAll();

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

  getIdEntite(){
     return  this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
  }

  async ngOnInit(){
    if(this.activatedRoute.snapshot.params.id){
      // this.getUser(this.activatedRoute.snapshot.params.id);
    }

    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    if(!this.id_entite){
      this.error = 'Veillez penser à sélectionner une entité';
    }else{
      this.error = '';
    }
    try{ this.family_situations = await this.listService.getAll(this.listService.list.FAMILY_SITUATION).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.functions = await this.listService.getAll(this.listService.list.FUNCTION).toPromise();} catch (e) {console.log('error filter FUNCTION', e);}
    try{ this.contracts = await this.listService.getAll(this.listService.list.CONTRACT).toPromise();} catch (e) {console.log('error filter CONTRACT', e);}
    try{ this.entities = await this.listService.getAll(this.listService.list.ENTITY).toPromise();} catch (e) {console.log('error filter ENTITY', e);}
    try{  this.managers = await this.listService.getAll(this.listService.list.MANAGER).toPromise();} catch (e) {console.log('error filter MANAGER', e);}
    try{ this.profiles = await this.listService.getAll(this.listService.list.PROFILE).toPromise();} catch (e) {console.log('error filter PROFILE', e);}
    try{ this.status = await this.listService.getAll(this.listService.list.STATUS, this.listService.list.PERSONAL).toPromise();} catch (e) {console.log('error filter PERSONAL', e);}
    try{ this.profit_centers = await this.listService.getAll(this.listService.list.PROFIT_CENTER, {id: this.id_entite}).toPromise();} catch (e) {console.log('error filter PROFIT_CENTER', e);}
    try{ this.suppliers = await this.listService.getAll(this.listService.list.SUPPLIER, {id: this.id_entite}).toPromise();} catch (e) {console.log('error filter SUPPLIER', e);}
    try{ this.appartenances = await this.listService.getAll(this.listService.list.MEMBER_SHIP).toPromise();} catch (e) {console.log('error filter MEMBER_SHIP', e);}
    try{ this.calendiers = await this.listService.getAll(this.listService.list.CALENDAR).toPromise();} catch (e) {console.log('error filter CALENDAR', e);}
    try{ this.time_entries = await this.listService.getAll(this.listService.list.TEMPS).toPromise();} catch (e) {console.log('error filter TEMPS', e);}
    try{ this.fiscal_car_powers = await this.listService.getAll(this.listService.list.FISCAL_POWER).toPromise();} catch (e) {console.log('error filter FISCAL_POWER', e);}
    try{ this.roles = await this.listService.getAll(this.listService.list.ROLE).toPromise();} catch (e) {console.log('error filter ROLE', e);}
    try{ this.countries = await this.listService.getAll(this.listService.list.COUNTRY).toPromise();} catch (e) {console.log('error filter COUNTRIES', e);}
    // try{ this.cities = await this.listService.getAll(this.listService.list.CITIES).toPromise();} catch (e) {console.log('error filter CITIES', e);}

    this.changeDetectorRef.detectChanges();
    this.userFormGroup.controls[this.formInputs.nationality_id].valueChanges.subscribe(async value => {
      this.userFormGroup.patchValue({city_id: null});
      this.cities = [];
      if(value){
        this.getCities(value);
      }
    });
  }

  async getCities(id_country){
    try{
      this.loadingCities = true;
      this.cities = await this.listService.getAll(this.listService.list.CITY, {id: id_country}).toPromise();
    } catch (e) {
      console.log('error filter CITIES', e);
    }finally {
      this.loadingCities = false;
    }
  }

  initFormBuilder(user: User){
    console.log('initFormBuilder', user);
    user = {
      ...user,
      is_head_office: user?.is_head_office  ? true: false,
      is_part_time: user?.is_part_time ? true: false
    }
    this.mainStore.images = this.mainStore.images.filter(item => item.name !== user.photo_profile);

     this.userFormGroup.patchValue({
       ...user,
    });
    this.getCities(user.nationality_id);
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
    console.log('this.userFormGroup.value', this.userFormGroup.value);
    const date_inputs = [
      'start_date',
      'birth_date',
      'emission_of_contract_date',
      'signature_of_contract_date',
      'group_start_date',
      'entry_date',
      'depart_mail_received_date',
      'theory_end_date',
      'end_date'
    ];
    const submit = Object.assign(this.userFormGroup.value);
    date_inputs.forEach(input => {
      submit[input] = this.userFormGroup.value[input] && isMoment(moment(this.userFormGroup.value[input], MY_CUSTOM_DATETIME_FORMATS.supportedFormats)) ? moment(this.userFormGroup.value[input], MY_CUSTOM_DATETIME_FORMATS.supportedFormats)?.format('YYYY-MM-DD'): null;
    });
    console.log('this.userFormGroup.value submit', submit);
    // this.photoBase64 = null;
    this.submitUser.emit(this.userFormGroup.value);
  }

  clearDateInput(input: string) {
    this.userFormGroup.patchValue({
      [input]: null
    })
  }

  // birth_place: ["Invalid value"]
  // birth_date: ["Invalid value"]
  // contract_id: ["contract_id is not valid"]
  // is_head_office: ["Invalid value"]
  // nationality: ["Invalid value"]
  // profile_id: ["profile_id not valid"]
  // start_date: ["Invalid value"]

  isValidMoment(date) {
    if(!this.userFormGroup.value[date]){
      return false;
    }
    const momentEntryDate = moment(this.userFormGroup.value[date]);
    if(!momentEntryDate.isValid()){
      return false;
    }
    return true;
  }

  inputChanged(event, input) {
    console.log('channged', input, event);
  }
  returnfalse(){
    return false;
  }

  deleteProfilePicture() {
    this.userFormGroup.patchValue({
      photo_profile: null
    });
    this.photoBase64 = null
  }
}

