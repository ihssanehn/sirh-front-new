import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddUserComponent} from "@layout/users/add-user/add-user.component";
import {UserInfoFormComponent} from "@layout/users/user-info-form/user-info-form.component";
import {ListsService} from "@services/lists.service";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {markFormAsDirty} from "@shared/Utils/SharedClasses";
import * as moment from "moment";

@Component({
  selector: 'app-modal-periode-essai',
  templateUrl: './modal-periode-essai.component.html',
  styleUrls: ['./modal-periode-essai.component.scss']
})
export class ModalPeriodeEssaiComponent implements OnInit, AfterViewInit {
  @Output() period: EventEmitter<any> = new EventEmitter();
  selectedProfile_id = null;
  @Input() users = [];
  @Input() entry_date = null;
  min = new Date();
  trial_periods = [];
  myForm: FormGroup;
  selectedStatus  = [];
  loadingData = false;
  constructor(
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private listService: ListsService,
  ) {
    this.myForm = this.fb.group({
      status: new FormArray([]),
      end_date: [null]
    });
    this.myForm.controls['end_date'].valueChanges.subscribe(value => {
      console.log("changed", value);
      if(value && moment(value).isValid()){
        this.clearCheckboxes();
      }
    });
  }

  ngOnInit() {
    this.getTrialPeriods();
  }

  ngAfterViewInit() {
    this.min = new Date(this.entry_date);
  }

  async getTrialPeriods(){
    try{
      this.loadingData = true;
      this.trial_periods = await this.listService.getAll(this.listService.list.TRAL_PERIOD).toPromise();
    } catch (e) {
      console.log('error filter FAMILY_SITUATION', e);
    }finally {
      this.loadingData = false;
    }
  }

  save() {
    markFormAsDirty(this.myForm);
    if(!this.myForm.valid ){
      return;
    }
    const {status, end_date} = this.myForm.value;
    if(end_date && moment(end_date).isValid()){
      this.period.emit(end_date);
    }else{
      if(status?.length>0){
        const trialperiod = this.trial_periods.find(item => status.includes(item.id) );
        if(trialperiod && trialperiod.value && trialperiod.type){
          this.entry_date.add(trialperiod.value, trialperiod.type);
          this.period.emit(this.entry_date);
        } else {
          this.period.emit(null);
        }
      } else {
        this.period.emit(null);
      }
    }
    this.modal.close();
  }

  ischecked(id) {
    return this.myForm?.value?.status?.includes(id);
  }

  clearCheckboxes(){
    const fa = this.myForm.get('status') as FormArray;
    fa.reset();
  }

  onCheckChange(event, item) {
    const formArray: FormArray = this.myForm.get('status') as FormArray;

    console.log('event', event.target.checked, event);
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      // this.clearCheckboxes();
      formArray.reset();
      formArray.push(new FormControl(item.id));
    }else{ /* unselected */
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == item.id) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    if(this.myForm.value.status?.length>0){
      this.myForm.patchValue({
        end_date: null
      });
    }
  }

  clearDateInput() {
    this.myForm.patchValue({
      end_date: null
    });
  }

  getMinDate() {
    return Date();
  }
}
