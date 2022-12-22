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
import {isMoment} from "moment";
import * as moment from "moment";
import { DateMessagePipe } from '@app/shared/pipes/dateMessage.pipe';



@Component({
  selector: 'app-visite-medical-advanced-form',
  templateUrl: './visite-medical-advanced-form.component.html',
  styleUrls: ['./visite-medical-advanced-form.component.scss'],
})
export class VisiteMedicalAdvancedFormComponent implements OnInit, AfterViewInit {
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
    centre: 'centre',
    date_last_vm: 'date_last_vm',
    scheduled_date: 'scheduled_date',
    sent_convocation: 'sent_convocation'
  }
  formLabels =  {
    personal_id: 'personal_id',
    centre: 'Centre médical',
    date_last_vm: 'Date dernière visite médicale',
    scheduled_date: 'Date de la visite médicale',
    sent_convocation: 'Convocation envoyée'
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
  @Output() submitvm: EventEmitter<any> = new EventEmitter();
  showHistory = false;
  medicalCenters = [];
  last_vm;
  _medical_visits;
  @Input()
  public set user(val: User) {
    if(val){
      // this.initFormBuilder(val);
    }
  }
  @Input()
  public set medical_visits(val: any) {
    if(val){
      this.last_vm = val[0]
      this._medical_visits =val;
      this.initFormBuilder(val[0]);
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
              private dateMessagePipe:DateMessagePipe,
              private userService : UserService) {

    this.noWhitespaceValidator.bind(this);
    this.formGroup = this.formBuilder.group({
      personal_id: [null],
      centre: [null],
      date_last_vm: [null],
      scheduled_date: [null],
      sent_convocation: [null]
    });
    console.clear()

    this.modalService.dismissAll();
  }

  mockupData(){
    const data = {
      personal_id: 11,
      type_vm: null,
      etat: null,
      date_effective: null,
      date_theorique: null,
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

  initFormBuilder(vm){
    if(vm){
      console.log('initFormBuilder :::',vm.histos)
      const _convoc_sent = vm.histos.filter(histo => {
          return histo.action.slug == 'CONVOCATION_SENT';
      });
      console.log('is sent convicaion ??',_convoc_sent)
      let is_checked_convoc = false;
      if(_convoc_sent && _convoc_sent.length > 0){
        is_checked_convoc = _convoc_sent[0].done_at?true:false;
        this.last_vm.tooltip_msg= 'le '+this.dateMessagePipe.transform(_convoc_sent[0].done_at)+' par '+(_convoc_sent[0].user?(_convoc_sent[0].user.prenom +' '+_convoc_sent[0].user.nom):'N.R');
      }

      this.formGroup.patchValue({
        personal_id: vm.personal_id,
        scheduled_date:vm.scheduled_date,
        centre: vm.centre,
        sent_convocation:is_checked_convoc
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

    const dates = ['date_last_vm', 'scheduled_date'];
    const saveData = {
      ...this.formGroup.value
    }
    dates.forEach(date => {
      saveData[date] = saveData[date] && isMoment(moment(date)) ? moment(saveData[date]).format('YYYY-MM-DD') : null
    });


    this.submitvm.emit(saveData);
  }

  clearDateInput(input: string) {
    this.formGroup.patchValue({
      [input]: null
    })
  }
}
