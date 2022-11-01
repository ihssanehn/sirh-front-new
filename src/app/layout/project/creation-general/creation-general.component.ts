import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ErrorService, UserService} from "@app/core/services";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {getFormValidationErrors, markFormAsDirty, SharedClasses} from "@shared/Utils/SharedClasses";
import {isMoment} from "moment/moment";
import * as moment from "moment/moment";


@Component({
  selector: 'app-creation-general',
  templateUrl: './creation-general.component.html',
  styleUrls: ['./creation-general.component.scss']
})
export class CreationGeneralComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  errors = [];
  error = '';
  warning = '';
  errorLoadData = false;
  loadingData = false;
  formInputs = {
    start_date: 'start_date',
    end_date: 'end_date',
    initial_number_of_days: 'initial_number_of_days',
    left_number_of_days: 'left_number_of_days',
    personal_id: 'personal_id',
    short_mission_title: 'short_mission_title',
    devise_id: 'devise_id',
    is_active: 'is_active',
    has_mail_to_manager: 'has_mail_to_manager',
    end_estimated_date: 'end_estimated_date',
    mission_title: 'mission_title',
    tariff: 'tariff',
    cp_id: 'cp_id'
  }
  @Input()
  public set data(obj){
    if(obj){
      this.fillForm(obj);
    }
  }
  @Input() title = '';
  @Input() type = '';
  @Input()  idProject: any;
  @Input()  submitting: boolean;
  @Output() refreshGlobalData: EventEmitter<any> = new EventEmitter();
  @Output() submitStep: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  personals = [];
  cps = [];
  loadingSelect = {};
  id_entite;
  devises = [];
  edittingMode: any;


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
              private mainStore: MainStore) {
    this.dateValidator = this.dateValidator.bind(this);
    this.formGroup = this.formBuilder.group({
      start_date: [null,  Validators.compose([Validators.required])],
      end_date: [null,  Validators.compose([Validators.required])],
      initial_number_of_days: [null,  Validators.compose([Validators.required])],
      left_number_of_days: [null,  Validators.compose([Validators.required])],
      personal_id: [null,  Validators.compose([Validators.required])],
      short_mission_title: [null,  Validators.compose([Validators.required])],
      devise_id: [null, Validators.compose([Validators.required])],
      is_active: [null],
      has_mail_to_manager: [null],
      end_estimated_date: [null,  Validators.compose([Validators.required])],
      mission_title: [null,  Validators.compose([Validators.required])],
      tariff: [null, Validators.compose([Validators.required])],
      cp_id: [null,  Validators.compose([Validators.required])]
    }, {validator: this.dateValidator});
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    // this.formGroup.valueChanges.subscribe(val => {
    //   console.log('formGroup.valueChanges', val);
    //   this.refreshGlobalData.emit(val);
    // });
  }

  ngOnInit(): void {
  }

  fillForm(data){
    console.log('fillForm general', data);
    this.getFilterList('personals', null);
    this.getFilterList('devises', this.listService.list.DEVISE);
    this.getFilterList('cps', this.listService.list.PROFIT_CENTER, {id: this.id_entite})
    this.formGroup.patchValue({
      personal_id: data.personal_id,
      cp_id: data.cp_id,
      devise_id: data.devise_id,
      end_date: data.end_date,
      end_estimated_date: data.end_estimated_date,
      has_mail_to_manager: data.has_mail_to_manager,
      initial_number_of_days: data.initial_number_of_days,
      is_active: data.is_active,
      left_number_of_days: data.left_number_of_days,
      mission_title:  data.mission_title,
      short_mission_title:  data.short_mission_title,
      start_date: data.start_date,
      tariff: data.tariff
    })
    this.edittingMode = data.id;
  }

  dateValidator(control: AbstractControl){
    let startDate = control.get(this.formInputs.start_date).value;
    let endDate = control.get(this.formInputs.end_date).value;


    this.errors = [];
    if(!startDate || !endDate){
      return ;
    }
    if(!(startDate instanceof moment)){
      startDate = moment(startDate);
    }
    if(!(endDate instanceof moment)){
      endDate = moment(endDate);
    }

    if( startDate.isAfter(endDate) ) {
      this.errors.push({
        code: 1,
        message: 'La date de début doit être avant la date de fin'
      });
      return {dateOrderError: true};
    }else{
      this.errors = this.errors.filter(error => error.code !== 1);
    }
  }

  save() {
    console.log('save 1', this.formGroup.value);
    this.error = '';
    markFormAsDirty(this.formGroup);
    if(!this.formGroup.valid ){
      this.error = 'Il y a des éléments qui nécessitent votre attention';
      // console.log('getFormValidationErrors', );
      getFormValidationErrors(this.formGroup);
      return;
    }

    // this.photoBase64 = null;
    this.submitStep.emit(this.formGroup.value);
  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.formGroup.controls[control]) ? '(*)': '';
  }

  async getFilterList(items, list_name, list_param?){
    if(items === 'personals'){
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.listService.getPersonalsByCpId({entity_id: this.id_entite}).toPromise();
      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }else{
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.listService.getAll(list_name, list_param).toPromise();
      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }
  }

  onCheckChange(input, $event) {
    console.log('event', input, $event?.target?.checked);
    this.formGroup.patchValue({
      [input]: $event?.target?.checked
    });
  }

  clearDateInput(date) {
    this.formGroup.patchValue({
      [date]: null
    });
  }

  inputChanged() {
    this.refreshGlobalData.emit(this.formGroup.value);
  }

  ngOnDestroy() {
    console.log('firing ngOnDestroy' );
  }
}
