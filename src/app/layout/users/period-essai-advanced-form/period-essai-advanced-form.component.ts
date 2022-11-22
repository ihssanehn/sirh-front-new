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
  selector: 'app-period-essai-advanced-form',
  templateUrl: './period-essai-advanced-form.component.html',
  styleUrls: ['./period-essai-advanced-form.component.scss'],
})
export class PeriodEssaiAdvancedFormComponent implements OnInit, AfterViewInit {
  formGroup: FormGroup;
  errors : Array<any> = [];
  $userRoles = $userRoles;
  allRoles = [
      'manager', 'superadmin', 'user'
  ];
  error = '';
  warning = '';
  status = [];
  decisions = [];
  @Input() submitting: boolean;
  formInputs = {
    personal_id: 'personal_id',
    statut_salarie: 'statut_salarie',
    decision: 'decision',
    date_entree: 'date_entree',
    date_sortie: 'date_sortie',
    date_fin_renouvelement: 'date_fin_renouvelement',
    date_fin_period_essai: 'date_fin_period_essai',
    suivi_evolution_perido_essai: 'suivi_evolution_perido_essai',
    gestion_courrier_gp: 'gestion_courrier_gp',
    reception_bilan_pe: 'reception_bilan_pe'
  }
  formLabels =  {
    personal_id: 'personal_id',
    statut_salarie: 'Statut salarié',
    decision: 'Décision',
    date_entree: 'Date d\'entrée',
    date_sortie: 'Date de sortie',
    date_fin_renouvelement: 'Date de fin de renouvellement',
    date_fin_period_essai: 'Date de fin de période d\'essai',
    suivi_evolution_perido_essai: 'Suivi de l\'évolution période d\'essai',
    gestion_courrier_gp:  'Gestion courrier GP',
    reception_bilan_pe: 'Réception bilan PE'
  }

  errorLoadData: boolean;
  loadingData: boolean;
  validators_conge =  [];
  loadingLists: boolean;
  @Input() title = '';
  @Input() type = '';
  @Input()  idUser: any;
  @Input()  profile_id: any;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Output() submitPeriodEssai: EventEmitter<any> = new EventEmitter();
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
      statut_salarie: [null],
      decision: [null],
      date_entree: [null],
      date_sortie: [null],
      date_fin_renouvelement: [null],
      date_fin_period_essai: [null],
      suivi_evolution_perido_essai: [null],
      gestion_courrier_gp: [null],
      reception_bilan_pe: [null]
    });

    this.modalService.dismissAll();
  }

  mockupData(){
    const data = {
      personal_id: 11,

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
    this.submitPeriodEssai.emit(this.formGroup.value);
  }

  clearDateInput(input: string) {
    this.formGroup.patchValue({
      [input]: null
    })
  }
}
