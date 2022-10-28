import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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
  selector: 'app-creation-lieu-intervention',
  templateUrl: './creation-lieu-intervention.component.html',
  styleUrls: ['./creation-lieu-intervention.component.scss']
})
export class CreationLieuInterventionComponent implements OnInit {

  formGroup: FormGroup;
  errors = [];
  error = '';
  warning = '';
  errorLoadData = false;
  loadingData = false;
  formInputs = {
    country_id: 'country_id',
    calendar_id: 'calendar_id',
    city_id: 'city_id',
    postal_code: 'postal_code',
    address: 'address',
    mission_description: 'mission_description',
  }
  @Input() title = '';
  @Input() type = '';
  @Input()  idProject: any;
  @Input()  submitting: any;
  @Output() submitStep: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  loadingSelect = {};
  id_entite;
  countries = [];
  calendars = [];
  cities = [];
  postalCodes = [];
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
      id: [null],
      country_id: [null, Validators.compose([Validators.required])],
      calendar_id: [null, Validators.compose([Validators.required])],
      city_id: [null, Validators.compose([Validators.required])],
      postal_code: [null],
      address: [null],
      mission_description: [null]
    });
  }

  ngOnInit(): void {
    this.fillForm();
  }

  fillForm(){
    this.getFilterList('countries', this.listService.list.COUNTRY);
    this.getFilterList('cities', this.listService.list.CITY, {id: 149});
    this.getFilterList('calendars', this.listService.list.CALENDAR);
    this.formGroup.patchValue({
      address:"test adresse",
      calendar_id:4,
      city_id:71307,
      country_id:149,
      mission_description:"descript mission",
      postal_code:"212000"
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


}
