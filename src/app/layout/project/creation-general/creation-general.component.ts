import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ErrorService, UserService} from "@app/core/services";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {SharedClasses} from "@shared/Utils/SharedClasses";

@Component({
  selector: 'app-creation-general',
  templateUrl: './creation-general.component.html',
  styleUrls: ['./creation-general.component.scss']
})
export class CreationGeneralComponent implements OnInit {

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
    consultant_id: 'consultant_id',
    short_mission_title: 'short_mission_title',
    devise_id: 'devise_id',
    is_active: 'is_active',
    has_mail_to_manager: 'has_mail_to_manager',
    end_estimated_date: 'end_estimated_date',
    mission_title: 'mission_title',
    tariff: 'tariff',
    cp_id: 'cp_id'
  }
  @Input() title = '';
  @Input() type = '';
  @Input()  idProject: any;
  @Input()  submitting: boolean;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  consultants = [];
  cps = [];
  loadingSelect = {};
  id_entite;

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
      start_date: [null],
      end_date: [null],
      initial_number_of_days: [null],
      left_number_of_days: [null],
      consultant_id: [null],
      short_mission_title: [null],
      devise_id: [null],
      is_active: [null],
      has_mail_to_manager: [null],
      end_estimated_date: [null],
      mission_title: [null],
      tariff: [null],
      cp_id: [null]
    });
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
  }

  ngOnInit(): void {
  }

  save() {
    this.move(1);
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
}
