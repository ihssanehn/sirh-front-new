import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ErrorService} from "@app/core/services";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {getFormValidationErrors, markFormAsDirty} from "@shared/Utils/SharedClasses";

@Component({
  selector: 'app-creation-frais',
  templateUrl: './creation-frais.component.html',
  styleUrls: ['./creation-frais.component.scss']
})
export class CreationFraisComponent implements OnInit {

  formGroup: FormGroup;
  errors = [];
  error = '';
  warning = '';
  errorLoadData = false;
  loadingData = false;
  formInputs = {
    cost_remarks: 'cost_remarks',
    distance_home_customer_site: 'distance_home_customer_site',
    has_cost_ok: 'has_cost_ok',
    has_exclusion_tr: 'has_exclusion_tr',
    mission_costs: 'mission_costs',
  }
  @Input() title = '';
  @Input() type = '';
  @Input()  idProject: any;
  @Input()  submitting: boolean;
  @Output() submitStep: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  filter = {
    frais_politique: null,
  };
  politique_frais: any;
  types = [
    {
      id: 1,
      label: 'Frais de déplacement',
    },
    {
      id: 2,
      label: 'Repas midi',
    }
  ];
  frequences = [];
  refacturables = [
    {
      value: true,
      label: 'Oui'
    },
    {
      value: false,
      label: 'Non'
    },
  ];
  frais = [
    {
      type_id: null,
      frequence_id: null,
      amount: null,
      max_amount: null,
      is_refacturable: null,
    },
    {
      type_id: null,
      frequence_id: null,
      amount: null,
      max_amount: null,
      is_refacturable: null,
    },
    {
      type_id: null,
      frequence_id: null,
      amount: null,
      max_amount: null,
      is_refacturable: null,
    }
  ];
  loadingSelect = {};
  id_entite;
  empty_mission_cost = {
    is_billable: false,
    amount_max: null,
    amount: null,
    frequency_id: null,
    cost_type_id: null,
  }
  @Input()
  public set data(obj){
    this.fillForm(obj);
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
              public listService: ListsService,
              private mainStore: MainStore) {
    this.formGroup = this.formBuilder.group({
      cost_remarks: [null],
      distance_home_customer_site: [null, Validators.compose([Validators.required])],
      has_exclusion_tr: [null],
      has_cost_ok: [null],
      mission_costs: this.formBuilder.array([...this.createItems( [this.empty_mission_cost])]),
    });
  }

  ngOnInit(): void {
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
  }

  fillForm(data) {
    this.getFilterList('types', this.listService?.list?.TYPE_OF_COST);
    this.getFilterList('frequences', this.listService?.list?.MISSION_COST_FREQUENCY)
    this.formGroup.patchValue({
      cost_remarks: data.cost_remarks,
      distance_home_customer_site: data.distance_home_customer_site,
      has_cost_ok: data.has_cost_ok,
      has_exclusion_tr: data.has_exclusion_tr,
    });


    const formArray: FormArray = this.formGroup.get(this.formInputs.mission_costs) as FormArray;

    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
    data?.mission_costs?.forEach(item => {
      this.addNewLine(item);
    });
  }

  save() {
    console.log('save client', this.formGroup.value);
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

  private createItems(items): FormGroup[] {
    const arr = [];
    items.forEach(item => {
      arr.push(this.createItem(item));
    })
    return arr;
  }

  addNewLine(item?) {
    const formArray: FormArray = this.formGroup.get(this.formInputs.mission_costs) as FormArray;
    formArray.push(this.createItem(item || this.empty_mission_cost));
  }

  removeItem(i){
    const formArray: FormArray = this.formGroup.get(this.formInputs.mission_costs) as FormArray;
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
}
