import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {markFormAsDirty, SharedClasses} from "@shared/Utils/SharedClasses";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {Subscription} from "rxjs";
import {ActivitiesService} from "@services/activities.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment";
import {isMoment} from "moment";

@Component({
  selector: 'app-conge-demande',
  templateUrl: './conge-demande.component.html',
  styleUrls: ['./conge-demande.component.scss']
})
export class CongeDemandeComponent implements OnInit {

  absence_request = [];
  disease_detail = [];
  submittingDiffuse: boolean;
  myForm: FormGroup;
  formInputs = {
    absence_type_id: 'absence_type_id',
    start_date: 'start_date',
    start_time: 'start_time',
    end_date: 'end_date',
    end_time: 'end_time',
    duration: 'duration',
    justification: 'justification',
    disease_detail_id: 'disease_detail_id',
    id: 'id',
  }
  illness_details = [];
  id_entite = null;
  loadingSelect = {};
  submittingCreate: boolean;
  disableWeekendsFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  errors = [];
  errorLoadData: boolean;
  loadingData: boolean;
  absenceToUpdate: any;
  private getDataSubscription: Subscription;
  constructor(private fb: FormBuilder,
              public listService: ListsService,
              private mainStore: MainStore,
              private activitiesService: ActivitiesService,
              private messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute,
  ) {
    this.dateValidator = this.dateValidator.bind(this);
    this.myForm = this.fb.group({
      absence_type_id: [null, Validators.compose([Validators.required])],
      start_date: [null, Validators.compose([Validators.required])],
      start_time: ['am', Validators.compose([Validators.required])],
      end_date: [null, Validators.compose([Validators.required])],
      end_time: ['pm', Validators.compose([Validators.required])],
      duration: [null, Validators.compose([Validators.required, this.nonZero])],
      id: [null],
      disease_detail_id: [null],
      justification: [null],
    }, {validator: this.dateValidator});

    this.getDataSubscription = this.route.params.subscribe(params => {
      const id = Number(params.id);
      if(id){
        this.getAbsence(id);
        this.getFilterList('disease_detail',  this.listService?.list?.DISEASE_DETAIL);
        this.getFilterList('absence_request',  this.listService?.list?.ABSENCE_REQUEST);
      }
    })
  }

  ngOnInit(): void {
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
  }

  nonZero(control):{ [key: string]: any; } {
    if (Number(control.value) <= 0) {
      return {nonZero: true};
    } else {
      return null;
    }
  }

  dateValidator(control: AbstractControl){
    let startDate = control.get(this.formInputs.start_date).value;
    let endDate = control.get(this.formInputs.end_date).value;

    let startTime = control.get(this.formInputs.start_time).value;
    let endTime = control.get(this.formInputs.end_time).value;

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

    if( startDate.isSame(endDate, 'date') && startTime === 'pm' && endTime === 'am') {
      this.errors.push({
        code: 2,
        message: 'La date de début doit être avant la date de fin'
      });
      return {dateOrderError: true};
    }else{
      this.errors = this.errors.filter(error => error.code !== 2);
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
    try{
      this.loadingSelect[list_name] = true;
      this[items] = await this.listService.getAll(list_name, list_param).toPromise();

    } catch (e) {
      console.log('error filter', e);
    } finally {
      this.loadingSelect[list_name] = false;
    }
  }

  async getDuration(){
    try {
      const params = {
        start_date: this.myForm.value?.start_date && isMoment(moment(this.myForm.value?.start_date)) ? moment(this.myForm.value?.start_date)?.format('YYYY-MM-DD'): null,
        end_date: this.myForm.value?.end_date && isMoment(moment(this.myForm.value?.end_date)) ? moment(this.myForm.value?.end_date)?.format('YYYY-MM-DD'): null,
        start_time: this.myForm.value?.start_time,
        end_time: this.myForm.value?.end_time
      }
      console.log('getDuration params', params);
      if(!params.start_date || !params.end_date || !params.start_time || !params.end_time){
        return;
      }
      const res = await this.activitiesService.getDuration(params).toPromise();
      console.log('res getDuration', res);
      if(res?.result?.data){
        this.myForm.patchValue({duration: res?.result?.data?.duration});
      }
    }catch (e){
      console.log('e getDuration', e);
    }
  }

  diffuse() {
    console.log('muform', this.myForm.value);
  }

  clearDateInput(input) {

  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.myForm.controls[control]) ? '(*)': '';
  }

  goback() {
    this.router.navigate(['/activites/conge/history']);
  }

  async createDemand() {
    console.log('submtting', this.myForm.value);
    markFormAsDirty(this.myForm);
    if(!this.myForm.valid){
      return;
    }
    try{
      this.submittingCreate = true;
      const params = this.myForm.getRawValue();
      params.start_date = params.start_date && isMoment(moment(params.start_date)) ? moment(params.start_date)?.format('YYYY-MM-DD'): null;
      params.end_date = params.end_date && isMoment(moment(params.end_date)) ? moment(params.end_date)?.format('YYYY-MM-DD'): null;

      const res = await this.activitiesService.addOrUpdateAbsenceRequest(params).toPromise();
      if(!this.myForm.value.id){
        this.myForm.reset();
        this.goback();
      }else{
        this.getAbsence(this.myForm.value.id);
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Parfait!',
        detail: this.myForm.value.id ? 'Demande mise à jour avec succès': 'Demande créé avec succès',
        sticky: false,
      });
    }catch (e){
      console.log('err createDemand', e);
      this.messageService.add({
        severity: 'error',
        summary: 'Echec!',
        detail: this.myForm.value.id ? 'Impossible de modifier cette demande d\'absence pour le moment':
          'Impossible de créer cette demande d\'absence pour le moment',
        sticky: false});
    }finally {
      this.submittingCreate = false;
    }
  }

  async getAbsence(id){
    try{
      this.errorLoadData = false;
      this.loadingData = true;
      const res = await this.activitiesService.getAbsenceRequestById({id}).toPromise();
      this.myForm.patchValue({
        ...res.data
      });
      this.absenceToUpdate = res.data;
    }catch (e){
      console.log('error getAbsence', e);
      this.errorLoadData = true;
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Impossible de récupérer cette demande d\'absence, veuillez réessayer plus tard',  sticky: false});
    }finally {
      this.loadingData = false;
    }
  }

  returnfalse(){
    return false;
  }

  ngOnDestroy() {
    if(this.getDataSubscription){
      this.getDataSubscription.unsubscribe();
    }
  }
}
