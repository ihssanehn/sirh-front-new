import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import * as _moment from "moment";
import {appAnimations} from "@shared/Objects/sharedObjects";
import {ActivitiesService} from "@services/activities.service";
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "primeng/api";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

import {IDatePickerConfig} from "ng2-date-picker/lib/date-picker/date-picker-config.model";
import {DatePickerComponent} from "ng2-date-picker";
// import {DatePickerComponent} from "ng2-date-picker/lib/date-picker/date-picker.component";

@Component({
  selector: 'app-activity-update',
  templateUrl: './activity-update.component.html',
  styleUrls: ['./activity-update.component.scss'],
  animations: appAnimations
})
export class ActivityUpdateComponent implements OnInit , AfterViewInit{
  dateValue;
  selectedMonth = null;
  @ViewChild('datepicker') datepicker: DatePickerComponent;
  config: IDatePickerConfig = {
    format: 'MM/YYYY',
  }

  data;
  activities;

  submittingCreate: boolean;
  submittingDiffuse: boolean;
  weeks = [];
  showInstructions = false;
  loadingCalendar = false;
  hasIntegrityError: boolean;
  errorMessage = '';
  other_activity = '';
  constructor(private activitiesService: ActivitiesService,
              private messageService: MessageService,
              private changeDetectorRef: ChangeDetectorRef,
              private route:ActivatedRoute) {

    this.getActivityByMonth();
    this.route.params.subscribe(param => {
      if(param.id){
        this.getActivityById(param.id);
      }
    })
  }

  ngAfterViewInit() {
    // if(!this.selectedMonth){
      console.log('this.datepicker.api.', this.datepicker.api);
    // }
  }

  ngOnInit(): void {

  }

  async getInformationForActivity(){
    try {
      if(!this.selectedMonth){
        this.selectedMonth = moment();
        this.dateValue = moment().format('MM/YYYY')
      }
      const res = await this.activitiesService.getInformationForActivity({date: moment(this.selectedMonth).set({date: 1}).format('YYYY-MM-DD')}).toPromise();
      this.data = res.data;
      if(this.data && Object.keys(this.data)?.length > 0){
        this.data.ratio.unshift({
          id: null,
          label: '',
        });
        this.data.ratio = this.data.ratio.map(ratio => {
          ratio.code = Number(ratio.code) || null;
          return ratio;
        });
        this.getWeeks();
        this.getTotalIssues();
      }

    } catch (e){
      console.log('error getActivityByid', e)
    } finally {

    }
  }

  async addOrUpdateActivity(){
    try {
      this.submittingCreate = true;
      const params = {
        personal_id: this.activities.personal_id,
        id: this.activities.id,
        month: moment(this.selectedMonth).format('YYYY-MM-DD'),
        comment: this.activities.comment,
        activity_details: this.activities.activity_details?.map(activity => {
          return {
            personal_id: activity.personal_id,
            type_id: activity.type_id,
            category_id: activity.category_id,
            ratio: activity.ratio,
            date: moment(activity.date).format('YYYY-MM-DD')
          }
        })
      }
      const res = await this.activitiesService.addOrUpdateActivity(params).toPromise();
      this.activities = res.data;
      this.getTotalIssues();
      this.messageService.add({
        severity: 'success',
        summary: 'Parfait!',
        detail: 'Mise à jour d\'activité réussie',
        sticky: false,
      });
    } catch (e){
      console.log('error getActivityByid', e);
      this.messageService.add({
        severity: 'error',
        summary: 'Echec!',
        detail: 'Une erreur est survenue',
        sticky: false,
      });
    } finally {
      this.submittingCreate = false;
    }
  }

  async diffuseActivity(){
    try {
      this.submittingDiffuse= true;
      const params = {
        id: this.activities.id
      }
      await this.addOrUpdateActivity();
      const res = await this.activitiesService.diffuseActivity(params).toPromise();
      this.activities = res.data;
      this.getTotalIssues();
      this.messageService.add({
        severity: 'success',
        summary: 'Parfait!',
        detail: 'Activités du mois diffusées avec succès',
        sticky: false,
      });
    } catch (e){
      console.log('error getActivityByid', e);
      this.messageService.add({
        severity: 'error',
        summary: 'Echec!',
        detail: 'Une erreur est survenue',
        sticky: false,
      });
    } finally {
      this.submittingDiffuse = false;
    }
  }

  async getActivityById(id){
    try {
      this.loadingCalendar = true;
      const res = await this.activitiesService.getActivityById({id}).toPromise();
      this.activities = res.data;
      await this.getInformationForActivity();
    } catch (e){
      console.log('error getActivityByid', e)
    } finally {
      this.loadingCalendar = false;
    }
  }

  async getActivityByMonth(){
    try {
      this.loadingCalendar = true;
      if(!this.selectedMonth){
        this.selectedMonth = moment();
        this.dateValue = moment().format('MM/YYYY')
      }
      console.log('getActivityByMonth');
      const res = await this.activitiesService.getActivityByMonth({month: moment(this.selectedMonth)?.set({date: 1}).format('YYYY-MM-DD')}).toPromise();
      this.activities = res.data;
      await this.getInformationForActivity();
    } catch (e){
      console.log('error getActivityByMonth', e)
    } finally {
      this.loadingCalendar = false;
    }
  }

  getWeeks(){
    if(!this.data){
      return [];
    }
    //Script for guetting weeks in top of the calendar table
    this.weeks = [];
    let colspan = 1;
    (this.data.calendar[0] as any).colspan = colspan;
    (this.data.calendar[0] as any).week = this.getWeek(this.data.calendar[0].date);

    let k = 0;
    for(let i=0; i<this.data.calendar.length; i++){
      if( i > 0 && moment(this.data.calendar[i].date).format('W') === moment(this.data.calendar[i-1].date).format('W')){
        colspan++;
        this.weeks[k-1].colspan = colspan;
      }else{
        colspan = 1;
        (this.data.calendar[i] as any).week = this.getWeek(this.data.calendar[i].date);
        (this.data.calendar[i] as any).fromdate = this.data.calendar[i].date;
        this.weeks.push(this.data.calendar[i]);
        this.weeks[k].colspan = colspan;
        k++;
      }
    }
  }



  chosenMonthHandler() {
    if(this.dateValue){
      this.selectedMonth = moment('01/'+this.dateValue, 'DD/MM/YYYY');
      this.getActivityByMonth();
    }
  }

  //todo
  //fix filter month
  //fix validator future months

  clearDateInput(date: any) {
    date.patchValue(null);
  }

  getRightLabels(){
    if(!this.data){
      return [];
    }
    const labels = [];
    this.data.type_activity.forEach((activity: any) => {
      activity.bg_color = activity.data?.length>0 ? '#F7F7F7': '#EDEDED';
      if(activity.code === 'absences'){
        activity.grayCell = true;
      }
      labels.push(activity);
      if(activity.data?.length>0){
        activity.data.forEach(subactivity => {
          if(subactivity.code === 'congés_payés'){
            subactivity.grayCell = true;
          }else{
            subactivity.type_id = activity.id
            subactivity.category_id = subactivity.id
          }
          labels.push(subactivity);
        })
      }
    });
    return labels;
  }

  getWeekendDay(day){
      return moment(day.date).local('fr').format('dd')[0];
  }

  getDataInCell(day, type) {
    if(!this.activities.activity_details){
      return null;
    }
    if(day.is_weekend){
      return moment(day.date).local('fr').format('dd')[0];
    }

    const element = this.activities.activity_details?.find(activity => {
      return moment(day.date).isSame(moment(activity.date), 'date')
        &&
        (activity.category_id ? (activity.category_id === type.id):  (activity.type_id === type.id) );
    });
    return element;
  }

  findRatioValue(element){
    return element?.ratio;
  }

  findRatioLabel(element){
    return this.data.ratio.find(ratio => element?.ratio == Number(ratio.code))?.label || null;
  }

  getWeek(date){
    return moment(date).format('W');
  }

  getColspanWeek(week_number, day, index){
    if(index>=0){

    }
  }

  fillLine(type_activity, unfill=false) {
    console.log('fillLine', type_activity);
    if(!this.activities.activity_details){
      return;
    }
    this.data.calendar.forEach(day => {
      const cells_in_columnn = this.activities.activity_details.filter(activity => moment(activity.date).isSame(day.date, 'date') && activity.activity_id);
      if(!(cells_in_columnn?.length>0)){ // Si aucune cellule dans cette colonne n'est trouvé
        this.activities.activity_details.push({
          absence_id: null,
          activity_id: 17,
          category_id: type_activity.category_id,
          date: moment(day.date).format('YYYY-MM-DD'),
          mission_id: null,
          personal_id: 1,
          project_id: null,
          ratio: unfill ? null: 1,
          type_id: type_activity.type_id
        });
      }else{ // Si au moins une cellule dans cette colonne existe
        if(unfill) { // le cas de vidage
          this.activities.activity_details.forEach(activity => {
            if(moment(activity.date).isSame(day.date, 'date') &&
              (activity.category_id ? (activity.category_id === type_activity.id): (activity.type_id === type_activity.id))
            ){
              activity.ratio = null;
            }
          })
        }else{ // le cas de remplissage
          const ratioCells = cells_in_columnn.filter(cell => cell.ratio); // les cellules dans cette colonne qui on un ratio > 0
          if(!(ratioCells?.length>0)){// aucune cellule dans cette colonne n'est remplie
            const exact_cell = cells_in_columnn.find(cell =>  (cell.category_id ? (cell.category_id === type_activity.id): (cell.type_id === type_activity.id)));
            if(exact_cell){
              exact_cell.ratio = 1
            }else{
              this.activities.activity_details.push({
                absence_id: null,
                activity_id: 17,
                category_id: type_activity.category_id,
                date: moment(day.date).format('YYYY-MM-DD'),
                mission_id: null,
                personal_id: 1,
                project_id: null,
                ratio: 1,
                type_id:  type_activity.type_id
              });
            }
          }
        }
      }
    });
    this.getTotalIssues();
  }

  setDataCell(day, type_activity, $event: any) {

    const element = this.getDataInCell(day, type_activity);
    if(element){
      element.ratio = $event;
    }else{
      this.activities.activity_details.push({
        absence_id: null,
        activity_id: 17,
        category_id: type_activity.category_id,
        date: moment(day.date).format('YYYY-MM-DD'),
        mission_id: null,
        personal_id: 1,
        project_id: null,
        ratio: $event,
        type_id: type_activity.type_id
      });
    }
    this.getTotalIssues();
  }

  hasAtLeastAFilledCell(type_activity) {
      // console.log('hasAtLeast', this.activities.activity_details);
      if(!this.activities.activity_details){
        return false;
      }
      const cellContent = this.activities.activity_details.find(activity =>
        activity.ratio
        &&
        (activity.category_id ? (activity.category_id === type_activity.id): (activity.type_id === type_activity.id))
      );
    return cellContent ? true: false;

  }

  showActivities() {
    console.log('activities', this.activities.activity_details);
  }

  getTotalInColumn(day){
    if(!this.activities.activity_details){
      return 0;
    }
    let sum = 0;
    this.activities.activity_details.forEach(activity => {
      if(moment(day.date).isSame(moment(activity.date), 'date')){
        sum += activity.ratio;
      }
    });
    return sum;
  }

  getTotalInLine(type_activity){
    let sum = 0;
    if(!this.activities.activity_details){
      return 0;
    }
    this.activities.activity_details.forEach(cell =>{
     if((cell.category_id ? (cell.category_id === type_activity.id): (cell.type_id === type_activity.id))){
       sum += cell.ratio;
     }
    });
    return sum;
  }

  getTotalIssues(){
    this.hasIntegrityError = false;
    let errorMessage = '';
    this.data.calendar.forEach(day => {
      const total = this.getTotalInColumn(day);
      if((total !== 1 && moment(day.date).isSameOrBefore(moment(), 'date')) || ![0, 1].includes(total)){
        const date = moment(day.date).format('DD MMM YYYY');
        errorMessage += "<li>La date "+date+" présente une erreur</li>"
      }
    })
    if(errorMessage?.length>0){
      this.hasIntegrityError = true;
    }
    // this.changeDetectorRef.detectChanges();
    this.errorMessage = errorMessage;
  }
}
