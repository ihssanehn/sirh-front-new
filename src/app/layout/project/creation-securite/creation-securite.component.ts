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
  @Output() submitStep: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  loadingSelect = {};
  id_entite;
  items = [];
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
      id: [null],
      mission_securities: this.formBuilder.array([]),
    });

    this.getFilterList('items', listService.list.SECURITY);
    this.setItems([{id:3},
          {id:6},
          {id:10},
          {id:13},
          {id:16},
          {id:19},
          {id:22},
          {id:25},
          {id:28},
          {id:31},
          {id:34},
          {id:131},
          {id:50},
          {id:51},
          {id:52},
          {id:66},
          {id:67},
          {id:68},
          {id:88},
          {id:90},
          {id:92},
          {id:94},
          {id:96},
          {id:110},
          {id:112},
          {id:114},
          {id:116},
          {id:125},
          {id:126},
          {id:128},
          {id:129},
    ]);
  }


  // TODO
  // Niveau de risque and comment (for text and textarea)
  // pointage gathering data
  // piece jointes gathering data
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
    return this.formGroup?.value[this.formInputs.mission_securities]?.includes(id);
  }

  onCheckChange(event, access) {
    const formArray: FormArray = this.formGroup.get(this.formInputs.mission_securities) as FormArray;

    console.log('event', event.target.checked, event);
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(access.id));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == access.id) {
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
    this.formGroup.reset();
    items?.forEach(item => {
      formArray.push(new FormControl(item.id))
    });
  }
}
