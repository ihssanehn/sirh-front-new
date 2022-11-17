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
    date_entree: 'date_entree',
    date_sortie: 'date_sortie',
    date_reception_courrier: 'date_reception_courrier',
    motif: 'motif',
    fin_normal_preavis: 'fin_normal_preavis',
    date_limit_reponse: 'date_limit_reponse',

    mail_direction_bm: 'mail_direction_bm',
    mail_admin: 'mail_admin',
    courrier_reponse: 'courrier_reponse',
    radiation_ats: 'radiation_ats',
    date_envoi_stc: 'date_envoi_stc',
    envoi_recommande_number: 'envoi_recommande_number',
    sortie_sirh: 'sortie_sirh',
    radiation_apicil: 'radiation_apicil',
    virement_amandine: 'virement_amandine',
  }
  formLabels =  {
    personal_id: 'personal_id',
    date_entree: 'Date d\'entrée',
    date_sortie: 'Date de sortie',
    date_reception_courrier: 'Date reception courrier',
    motif: 'Motif',
    fin_normal_preavis: 'Fin normal preavis',
    date_limit_reponse: 'Date limite de réponse',
    mail_direction_bm: 'Mail Direction + BM',
    mail_admin: 'Mail Admin',
    courrier_reponse: 'courrier réponse',
    radiation_ats: 'Radiation ATS',
    date_envoi_stc: 'Date d’envoi STC',
    envoi_recommande_number: 'Envoi recommandé N°',
    sortie_sirh: 'sortie SIRH',
    radiation_apicil: 'Radiation APICIL',
    virement_amandine: 'Virement Amandine',
  }
  etats = [];
  errorLoadData: boolean;
  loadingData: boolean;
  loadingLists: boolean;
  @Input() title = '';
  @Input() type = '';
  @Input()  idUser: any;
  @Input()  profile_id: any;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Output() submitSortie: EventEmitter<any> = new EventEmitter();
  showHistory = false;
  medicalCenters = [];
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
    this.formGroup = this.formBuilder.group({
      personal_id: [null],
      date_entree: [null],
      date_sortie: [null],
      date_reception_courrier: [null],
      motif: [null],
      fin_normal_preavis: [null],
      date_limit_reponse: [null],
    });

    this.modalService.dismissAll();
  }

  mockupData(){
    const data = {
      personal_id: null,
      date_entree: null,
      date_sortie:  null,
      date_reception_courrier:  null,
      motif:  null,
      fin_normal_preavis:  null,
      date_limit_reponse:  null
    };
    this.formGroup.patchValue(data);
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
      this.formGroup.patchValue({
        personal_id: user.id,
        ...user.parameter
      });
    }
  }


  isRequired(control) {
    return SharedClasses.isControlRequired(this.formGroup.controls[control]) ? '(*)': '';
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
    this.submitSortie.emit(this.formGroup.value);
  }

  clearDateInput(input: string) {
    this.formGroup.patchValue({
      [input]: null
    })
  }
}


