import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
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
  selector: 'app-creation-stats',
  templateUrl: './creation-stats.component.html',
  styleUrls: ['./creation-stats.component.scss']
})
export class CreationStatsComponent implements OnInit {

  formGroup: FormGroup;
  errors = [];
  error = '';
  warning = '';
  errorLoadData = false;
  loadingData = false;
  formInputs = {
    is_getting_started: 'is_getting_started',
    has_formation: 'has_formation',
    is_mission_not_valued : 'is_mission_not_valued',
    is_mission_not_billable: 'is_mission_not_billable',
    is_mission_inter_contract: 'is_mission_inter_contract',
    is_remote_mission: 'is_remote_mission',
    mission_specific_code: 'mission_specific_code'
  }
  @Input() title = '';
  @Input() type = '';
  @Input()  idProject: any;
  @Input()  submitting: boolean;
  @Output() submitStep: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
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
      is_getting_started: [null],
      has_formation: [null],
      is_mission_not_valued : [null],
      is_mission_not_billable: [null],
      is_mission_inter_contract: [null],
      is_remote_mission: [null],
      mission_specific_code: [null]
    });
  }

  ngOnInit(): void {
    this.fillForm();
  }

  fillForm() {
    this.formGroup.patchValue({
      has_formation:true,
      is_getting_started: true,
      is_mission_inter_contract: true,
      is_mission_not_billable: true,
      is_mission_not_valued: true,
      is_remote_mission: true,
      mission_specific_code: "BSDVSDEGTG"
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

}
