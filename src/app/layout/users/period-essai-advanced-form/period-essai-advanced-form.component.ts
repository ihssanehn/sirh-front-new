import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray,} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {formatDateForBackend, getFormValidationErrors, markFormAsDirty, SharedClasses} from '@shared/Utils/SharedClasses';
import {Location} from '@angular/common';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {User} from "@app/core/entities";
import { NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import { PersonalService } from '@app/core/services/personal.service';
import * as moment from 'moment';
import { isMoment } from 'moment';



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
  loadingSelect = {};
  @Input() submitting: boolean;
  formInputs = {
    personal_id: 'personal_id',
    statut_salarie: 'statut_salarie',
    decision: 'decision',
    date_entree: 'date_entree',
    date_sortie: 'date_sortie',
    renewal_date: 'renewal_date',
    date_fin_period_essai: 'date_fin_period_essai',
    suivi_evolution_perido_essai: 'suivi_evolution_perido_essai',
    gestion_courrier_gp: 'gestion_courrier_gp',
    reception_bilan_pe: 'reception_bilan_pe',
    id:'id',
    motif_id: 'motif_id',

  }
  formLabels =  {
    personal_id: 'personal_id',
    statut_salarie: 'Statut salarié',
    decision: 'Décision',
    date_entree: 'Date d\'entrée',
    date_sortie: 'Date de sortie',
    renewal_date: 'Date de fin de renouvellement',
    date_fin_period_essai: 'Date de fin de période d\'essai',
    suivi_evolution_perido_essai: 'Suivi de l\'évolution période d\'essai',
    gestion_courrier_gp:  'Gestion courrier GP',
    reception_bilan_pe: 'Réception bilan PE',
    motif_id: 'Motif',

  }

  errorLoadData: boolean;
  loadingData: boolean;
  validators_conge =  [];
  loadingLists: boolean;
  current_pe;
  idUser;
  @Input() title = '';
  @Input() type = '';
  @Input()  profile_id: any;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Output() submitPeriodEssai: EventEmitter<any> = new EventEmitter();
  @Input()
  public set user(val: User) {
    if(val){
      this.idUser = val.id;
      console.log('here', val.id)
      this.formGroup.patchValue({personal_id: val.id})
      // this.initFormBuilder(val);
    }
  }
  @Input()
  public set trial_period(val:any) {
    if(val){
      this.current_pe = val;
      this.initFormBuilder(this.current_pe);

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
              private personalService: PersonalService,
              private userService : UserService) {

    this.noWhitespaceValidator.bind(this);
    this.formGroup = this.formBuilder.group({
      personal_id: [null],
      statut_salarie: [null],
      decision: [null],
      date_entree: [null],
      date_sortie: [null],
      renewal_date: [null],
      date_fin_period_essai: [null],
      histos: new FormArray([]),
      id:[null],
      motif_id:[null]
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
    this.getDecisions()
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

  async markActionAsDone(id, is_done){
    let marked = await this.userService.markActionAsDone({id:id}).toPromise();
    if(marked)
      this.messageService.add({
        severity: 'success',
        summary: 'Parfait!',
        detail: 'L\'action a bien été marquée comme réalisée',
        sticky: false,
      });
  }

  async getDecisions(){
    this.decisions = await this.listService.getAll('status','decision_trail_period').toPromise();
   }

   get histosFromArray() {
    return this.formGroup.controls.histos as FormArray;
  }
  test(){
    console.log(this.formGroup)
  }

  initFormBuilder(pe: any){
    if(pe){
      if(pe.histos){
        pe.histos.forEach((_histo) => this.histosFromArray.push((new FormControl({checked:_histo?.done_at?true:false}))));
      }
      this.formGroup.patchValue({
        decision:pe.decision,
        date_entree: pe?.entrance?pe.entrance?.entry_date:null,
        date_sortie: [null],
        renewal_date: pe?.renewal_date?pe.renewal_date:null,
        date_fin_period_essai: pe.end_date,
        suivi_evolution_perido_essai: [null],
        statut_salarie:this.user?.status_id,
        id:pe.id
      });
      console.log(this.formGroup)
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

  async getTrialPeriodRenewCalculation(code:string) {
    console.log(this.formGroup.getRawValue())
    if(code != 'renouvellement')
      return;
    const {personal_id, date_fin_period_essai} = this.formGroup.getRawValue();
    if(!personal_id  || !date_fin_period_essai){
      return;
    }
    try {
      const params = {
        personal_id,
        end_date: formatDateForBackend(this.current_pe?.end_date)
      }
      const res = await this.personalService.getTrialPeriodRenewCalculation(params).toPromise();
      console.log('res renew calculation', res);
      if(moment(res.calculated_date)?.isValid()) {
        console.log('patching end_date_preavis')
        this.formGroup.patchValue({renewal_date: moment(res.calculated_date).toISOString(), date_fin_period_essai: moment(res.calculated_date).toISOString()});
      }else
        this.formGroup.patchValue({renewal_date:null})
    }catch (e) {
      console.log('error getPreavisCalculation', e);
    }finally {

    }
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

  
  async save() {
    this.error = '';
    markFormAsDirty(this.formGroup);
    if(!this.formGroup.valid ){
      this.error = 'Des éléments bloquants nécessitent votre attention';
      getFormValidationErrors(this.formGroup);
      return;
    }

    Object.keys(this.formGroup.value).forEach(key => {
      if(this.formGroup.value[key] === 'false'){
        this.formGroup.value[key] = false;
      }
    });
    
    const dates = ['renewal_date', 'date_fin_period_essai', 'date_sortie'];
    const saveData = {
      ...this.formGroup.value
    }
    dates.forEach(date => {
      saveData[date] = saveData[date] && isMoment(moment(saveData[date])) ? moment(saveData[date]).format('YYYY-MM-DD') : null
    });


    // this.submitvm.emit(saveData);
    console.log(saveData)
    let res = null;
    if(saveData){
      res = await this.personalService.createOrUpdateTrialPeriod(saveData).toPromise();
      if(res.result && res.result.data){
        this.submitting = false;
        this.reset();
      }
      this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Période d\'essai modifiée avec succès'});
    }
  }

  clearDateInput(input: string) {
    this.formGroup.patchValue({
      [input]: null
    })
  }

  reset(){
    this.formGroup.reset()
    this.formGroup.patchValue({
      personal_id: this.idUser,
    });
  }

  async getFilterList(items, list_name, list_param?){
    
    try{
      this.loadingSelect[list_name] = true;
      const _result = await this.listService.getAll(list_name, list_param).toPromise();
      this[items] =  _result.filter(motif => {
        return motif.code.includes('fin_pe');
    });

    } catch (e) {
      console.log('error filter', e);
    } finally {
      this.loadingSelect[list_name] = false;
    }
  
}
}

