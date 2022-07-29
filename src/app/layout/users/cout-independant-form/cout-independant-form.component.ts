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
  selector: 'app-cout-independant-form',
  templateUrl: './cout-independant-form.component.html',
  styleUrls: ['./cout-independant-form.component.scss'],
})
export class CoutIndependantFormComponent implements OnInit, AfterViewInit {
  coutFormGroup: FormGroup;
  errors : Array<any> = [];
  $userRoles = $userRoles;
  allRoles = [
      'manager', 'superadmin', 'user'
  ];
  error = '';
  warning = '';
  @Input() submitting: boolean;

  formInputs = {
    tjm_client: 'tjm_client',
    tjm_service_provider: 'tjm_service_provider',
    is_subject_to_vats: 'is_subject_to_vats',
    has_costs_billable_service_provider: 'has_costs_billable_service_provider',
    vat_rate: 'vat_rate',
    comment_service_provider: 'comment_service_provider',
  }
  formLabels =  {
    tjm_client: 'TJM facturé au client',
    tjm_service_provider: 'TJM facturé par le prestataire',
    is_subject_to_vats: 'Assujetti à la TVA',
    has_costs_billable_service_provider: 'Frais facturables par le prestataire',
    vat_rate: 'Taux de TVA (%)',
    comment_service_provider: 'Commentaire'
  }

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
  @Output() submitCout: EventEmitter<any> = new EventEmitter();
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
    this.coutFormGroup = this.formBuilder.group({
      tjm_client: [],
      tjm_service_provider: [],
      is_subject_to_vats: [false],
      has_costs_billable_service_provider: [false],
      vat_rate: [],
      comment_service_provider: [],
    });

    this.modalService.dismissAll();
  }


  ngAfterViewInit(): void {

  }

  async ngOnInit(){
    if(this.activatedRoute.snapshot.params.id){
      // this.getUser(this.activatedRoute.snapshot.params.id);
    }

    // this.changeDetectorRef.detectChanges();
  }

  initFormBuilder(user: User){
    if(user){
      this.coutFormGroup.patchValue({
        personal_id: user.id,
        tjm_client: user.tjm_client,
        tjm_service_provider: user.tjm_service_provider,
        is_subject_to_vats: user.is_subject_to_vats? true: false,
        has_costs_billable_service_provider: user.has_costs_billable_service_provider ? true: false,
        vat_rate: user.vat_rate,
        comment_service_provider: user.comment_service_provider,
      });
    }
  }


  isRequired(control) {
    return SharedClasses.isControlRequired(this.coutFormGroup.controls[control]) ? '(*)': '';
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
    markFormAsDirty(this.coutFormGroup);
    if(!this.coutFormGroup.valid ){
      this.error = 'Il y a des éléments qui nécessitent votre attention';
      getFormValidationErrors(this.coutFormGroup);
      return;
    }
    Object.keys(this.coutFormGroup.value).forEach(key => {
      if(this.coutFormGroup.value[key] === 'false'){
        this.coutFormGroup.value[key] = false;
      }
    });
    this.submitCout.emit(this.coutFormGroup.value);
  }
}

