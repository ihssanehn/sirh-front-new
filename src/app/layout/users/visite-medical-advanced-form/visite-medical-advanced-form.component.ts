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
    medical_center: 'medical_center',
    date_last_vm: 'date_last_vm',
    date_next_vm: 'date_next_vm',
    sent_invit: 'sent_invit'
  }
  formLabels =  {
    personal_id: 'personal_id',
    medical_center: 'Centre médical',
    date_last_vm: 'Date dernière visite médicale',
    date_next_vm: 'Date prochaine visite médicale',
    sent_invit: 'Convocation envoyée'
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
      medical_center: [null],
      date_last_vm: [null],
      date_next_vm: [null],
      sent_invit: [null]
    });

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
    this.submitvm.emit(this.formGroup.value);
  }

  clearDateInput(input: string) {
    this.formGroup.patchValue({
      [input]: null
    })
  }
}
