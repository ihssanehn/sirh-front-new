import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ListsService} from "@services/lists.service";
import {markFormAsDirty, SharedClasses} from "@shared/Utils/SharedClasses";
import {UserService} from "@app/core/services";
import {User} from "@app/core/entities";
import {MainStore} from "@store/mainStore.store";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivitiesService} from "@services/activities.service";
import {isMoment} from "moment";
import * as moment from "moment";
import {MessageService} from "primeng/api";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-delegation-creation',
  templateUrl: './delegation-creation.component.html',
  styleUrls: ['./delegation-creation.component.scss']
})
export class DelegationCreationComponent implements OnInit {
  myForm: FormGroup;
  formInputs = {
    holder_validator_id: 'holder_validator_id',
    delegate_validator_id: 'delegate_validator_id',
    start_date: 'start_date',
    end_date: 'end_date',
    delegation_types: 'delegation_types',
    has_mail_notification: 'has_mail_notification',
    has_permanent_delegation: 'has_permanent_delegation',
    id: 'id'
  };
  submitting = false;
  personals = [];
  submittingCreate: boolean;
  id_entite;
  loadingSelect = {};
  delegations = [];
  errorLoadData: boolean;
  loadingData: boolean;
  delegationToUpdate: any;
  private getDataSubscription: Subscription;
  errors = [];
  constructor(private fb: FormBuilder,
              private usersService: UserService,
              private mainStore: MainStore,
              public listService: ListsService,
              public router: Router,
              public route: ActivatedRoute,
              public messageService: MessageService,
              private activitiesService: ActivitiesService,
              private changeDetectorRef: ChangeDetectorRef
              ) {
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
    this.dateValidator = this.dateValidator.bind(this);
    this.myForm = this.fb.group({
      holder_validator_id: [null, Validators.compose([Validators.required])],
      delegate_validator_id:  [null, Validators.compose([Validators.required])],
      start_date:  [null],
      end_date:  [null],
      delegation_types: new FormArray([]),
      has_mail_notification: [null],
      has_permanent_delegation: [null],
      id: [null]
    }, {validator: this.dateValidator});
    this.getFilterList('delegations', this.listService.list.DELEGATIONS);
    this.getDataSubscription = this.route.params.subscribe(params => {
      const id = Number(params.id);
      if(id){
        this.getData(id);
      }
    })
  }

  ngOnInit(): void {
  }

  dateValidator(control: AbstractControl){
    let startDate = control.get(this.formInputs.start_date).value;
    let endDate = control.get(this.formInputs.end_date).value;
    let has_permanent_delegation = control.get(this.formInputs.has_permanent_delegation).value;

    if(has_permanent_delegation){
      return null;
    }

    this.errors = [];
    if(!startDate || !endDate){
      return ;
    }
    if(!(startDate instanceof moment)){
      startDate = moment(startDate);
    }
    if(!(endDate instanceof moment)){
      endDate = moment(endDate);
    }

    if( startDate.isAfter(endDate) ) {
      this.errors.push({
        code: 1,
        message: 'La date de début doit être avant la date de fin'
      });
      return {dateOrderError: true};
    }else{
      this.errors = this.errors.filter(error => error.code !== 1);
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


  getPage(data) {
    if(!data) return;
    return data;
  }

  goback() {
    this.router.navigate(['/activites/delegation/list']);
  }

  async submit() {
    console.log('submtting', this.myForm.value);
    markFormAsDirty(this.myForm);
    if(!this.myForm.valid){
      return;
    }
    try{
      this.submittingCreate = true;
      const params = this.myForm.getRawValue();
      params.start_date = params.start_date && isMoment(moment(params.start_date)) && !params.has_permanent_delegation ? moment(params.start_date)?.format('YYYY-MM-DD'): null;
      params.end_date = params.end_date && isMoment(moment(params.end_date)) && !params.has_permanent_delegation ? moment(params.end_date)?.format('YYYY-MM-DD'): null;
      params.delegation_types = params.delegation_types.filter(item=>item);
      const res = await this.activitiesService.addOrUpdateDelegation(params).toPromise();
      if(!this.myForm.value.id){
        this.myForm.reset();
        this.goback();
      }else{
        this.getData(this.myForm.value.id);
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Parfait!',
        detail: this.myForm.value.id ? 'Délégation mise à jour avec succès': 'Délégation créée avec succès',
        sticky: false,
      });
    }catch (e){
      console.log('err createDemand', e);
      this.messageService.add({
        severity: 'error',
        summary: 'Echec!',
        detail: this.myForm.value.id ? 'Impossible de modifier cette délégation pour le moment':
          'Impossible de créer cette délégation pour le moment',
        sticky: false});
    }finally {
      this.submittingCreate = false;
    }
  }

  async getData(id){
    try{
      this.errorLoadData = false;
      this.loadingData = true;
      const res = await this.activitiesService.getDelegationById({id}).toPromise();
      if(res.data){
        this.myForm.patchValue({
          ...res.data
        });
        const formArray: FormArray = this.myForm.get('delegation_types') as FormArray;
        formArray.reset();
        res.data.delegation_types?.forEach(item => {
          formArray.push(new FormControl(item.type_id))
        });
        this.getFilterList('personals',  this.listService.list.PERSONAL);
        this.delegationToUpdate = res.data;
        this.changeDetectorRef.detectChanges();
      }
      console.log('my form valu', this.myForm.value);
    }catch (e){
      console.log('error getAbsence', e);
      this.errorLoadData = true;
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Impossible de récupérer cette délégation, veuillez réessayer plus tard',  sticky: false});
    }finally {
      this.loadingData = false;
    }
  }

  save() {
    console.log('submit', this.myForm.value);
  }

  ischecked(id) {
    console.log('ischecked', id, this.myForm?.value?.delegation_types);
    return this.myForm?.value?.delegation_types?.includes(id);
  }

  onCheckChange(input, $event) {
    console.log('event', input, $event?.target?.checked);
    this.myForm.patchValue({
      [input]: $event?.target?.checked
    });
  }

  onCheckChangeArray(event, option) {
    const formArray: FormArray = this.myForm.get('delegation_types') as FormArray;

    console.log('event', event.target.checked, event);
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(option.id));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == option.id) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.myForm.controls[control]) ? '(*)': '';
  }

  ngOnDestroy() {
    if(this.getDataSubscription){
      this.getDataSubscription.unsubscribe();
    }
  }
}

