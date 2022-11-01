import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ErrorService} from "@app/core/services";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {getFormValidationErrors, markFormAsDirty, SharedClasses} from "@shared/Utils/SharedClasses";

@Component({
  selector: 'app-creation-pointage',
  templateUrl: './creation-pointage.component.html',
  styleUrls: ['./creation-pointage.component.scss']
})
export class CreationPointageComponent implements OnInit {


  formGroup: FormGroup;
  errors = [];
  error = '';
  warning = '';
  errorLoadData = false;
  loadingData = false;
  formInputs = {
    pointing_type_id: 'pointing_type_id',
    pointing_unity_id: 'pointing_unity_id',
    pointing_tariff: 'pointing_tariff',
    information_for_consultant: 'information_for_consultant',
    pointings: 'pointings',
    end_date: 'end_date',
    start_date: 'start_date'
  }
  @Input() title = '';
  @Input() type = '';
  @Input() idProject: any;
  @Input() submitting: any;
  @Input()
  public set data(obj){
    this.fillForm(obj);
  }
  @Output() refreshGlobalData: EventEmitter<any> = new EventEmitter();
  @Output() submitStep: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  loadingSelect = {};
  id_entite;
  sieges = [
    {
      label: 'Siège',
      id: true
    },
    {
      label: 'Hors siège',
      id: false
    }
  ];
  clients = [];
  pointages = [];
  units = [];
  newItem = {
    type: null,
    unit: null,
    tariff: '',
    start_date: '01/09/2022',
    end_date: '01/09/2022',
    info: '',
  };
  types = [];
  empty_item = {
    // pointing_type_id: null,
    pointing_unity_id: null,
    pointing_tariff: null,
    information_for_consultant: null,
  };
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
    this.formGroup = this.formBuilder.group({
      // pointing_type_id: [null],
      pointing_unity_id: [null],
      pointing_tariff: [null],
      information_for_consultant: [null],
      start_date: [null],
      end_date: [null],
      // pointings: this.formBuilder.array([...this.createItems( [this.empty_item])]),
    });

  }

  ngOnInit(): void {

  }

  fillForm(data) {
    this.getFilterList('types', this.listService.list.TYPE_OF_COST);
    this.getFilterList('units', this.listService.list.TEMPS_UNIT)
    this.formGroup.patchValue({
      end_date: data?.end_date,
      information_for_consultant: data?.information_for_consultant,
      pointing_tariff: data?.pointing_tariff,
      // pointing_type_id: data?.pointing_type_id,
      pointing_unity_id: data?.pointing_unity_id,
      start_date: data?.start_date,
    });
  }

  save() {
    console.log('save lieu intervention', this.formGroup.value);
    this.error = '';
    markFormAsDirty(this.formGroup);
    if(!this.formGroup.valid ){
      this.error = 'Il y a des éléments qui nécessitent votre attention';
      // console.log('getFormValidationErrors', );
      getFormValidationErrors(this.formGroup);
      return;
    }
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


  private createItems(items): FormGroup[] {
    const arr = [];
    items.forEach(item => {
      arr.push(this.createItem(item));
    })
    return arr;
  }

  addNewLine(item?) {
    const formArray: FormArray = this.formGroup.get(this.formInputs.pointings) as FormArray;
    formArray.push(this.createItem(item || this.empty_item));
  }

  removeItem(i){
    const formArray: FormArray = this.formGroup.get(this.formInputs.pointings) as FormArray;
    formArray.removeAt(i);
  }

  private createItem(item = null): FormGroup {
    return this.formBuilder.group({
      is_billable: item?.is_billable,
      amount_max: item?.amount_max,
      amount: item?.amount,
      frequency_id: item?.frequency_id,
      cost_type_id: item?.cost_type_id
    });
  }

  inputChanged() {
    this.refreshGlobalData.emit(this.formGroup.value);
  }
}
