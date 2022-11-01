import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
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
  selector: 'app-creation-securite',
  templateUrl: './creation-securite.component.html',
  styleUrls: ['./creation-securite.component.scss']
})
export class CreationSecuriteComponent implements OnInit {

  formGroup: FormGroup;
  errors = [];
  error = '';
  warning = '';
  errorLoadData = false;
  loadingData = false;
  formInputs = {
    risk_level: 'risk_level',
    mission_securities: 'mission_securities'
  }
  @Input() title = '';
  @Input() type = '';
  @Input()  idProject: any;
  @Input()  submitting: boolean;
  @Output() refreshGlobalData: EventEmitter<any> = new EventEmitter();
  @Output() submitStep: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  loadingSelect = {};
  id_entite;
  items = [];
  @Input()
  public set data(obj){
    if(obj){
      this.fillForm(obj);
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
              private mainStore: MainStore) {
    this.formGroup = this.formBuilder.group({
      risk_level: [null],
      mission_securities: this.formBuilder.array([]),
    });

    this.getFilterList('items', listService.list.SECURITY);
  }

  fillForm(data){
    console.log('fillForm securite', data);
    this.formGroup.patchValue({
      risk_level: data?.risk_level
    });
    this.setItems(data.mission_securities);
  }

  // TODO
  // Niveau de risque and comment (for text and textarea) => Done
  // pointage gathering data => done
  // piece jointes gathering data => done
  // Gather all data and submit add data
  // Get data and fill all forms for all steps
  // submit edit data => check id

  ngOnInit(): void {
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

  ischecked(id) {
    return this.formGroup?.value[this.formInputs.mission_securities]?.find(item => item.id === id);
  }

  getValue(id) {
    return this.formGroup?.value[this.formInputs.mission_securities]?.find(item => item.id === id)?.comment;
  }

  private createItem(item = null): FormGroup {
    return this.formBuilder.group({
      id: item?.id,
      comment: item?.comment
    });
  }

  inputValueChanged($event, input) {
    console.log('inputValueChanged', $event.target.value, input);
    const formArray: FormArray = this.formGroup.get(this.formInputs.mission_securities) as FormArray;
    let i = 0;
    const index = formArray.controls.findIndex((ctrl) => ctrl.value.id === input.id);
    console.log('find index', index);
    if(index > -1){
      formArray.controls[index].get('comment').setValue($event.target.value);
    }else{
      formArray.push(this.createItem({id: input.id, comment: $event.target.value}));
    }
  }

  onCheckChange(event, access) {
    const formArray: FormArray = this.formGroup.get(this.formInputs.mission_securities) as FormArray;

    console.log('event', event.target.checked, event);
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(this.createItem(access));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value.id == access.id) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  setItems(items){
    const formArray: FormArray = this.formGroup.get(this.formInputs.mission_securities) as FormArray;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    items?.forEach(item => {
      formArray.push(this.createItem(item));
    });
  }

  inputChanged() {
    this.refreshGlobalData.emit(this.formGroup.value);
  }
}
