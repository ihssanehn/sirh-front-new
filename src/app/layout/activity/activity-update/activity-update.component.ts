import { Component, OnInit } from '@angular/core';
import {
  OwlDateTimeComponent,
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeFormats
} from 'ng-pick-datetime';
import {MomentDateTimeAdapter} from "ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class";
import {MY_MOMENT_DATE_TIME_FORMATS} from "@layout/activity/activity-list/activity-list.component";
import {FormControl} from "@angular/forms";

import * as _moment from "moment";
import {appAnimations} from "@shared/Objects/sharedObjects";
import {ActivitiesService} from "@services/activities.service";
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "primeng/api";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-activity-update',
  templateUrl: './activity-update.component.html',
  styleUrls: ['./activity-update.component.scss'],
  providers: [
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS},
  ],
  animations: appAnimations
})
export class ActivityUpdateComponent implements OnInit {

  public date = new FormControl(moment().set({date: 1}));

  data;
  activities;
  // data = {
  //     type_activity: [
  //       {
  //         id: 33,
  //         label: "Travail Normal",
  //         code: "travail_normal",
  //         order: 1,
  //         is_active: 1,
  //         only_admin: 1,
  //         model: "type_activity",
  //         color: "NULL",
  //         data: [],
  //         creator_id: 1,
  //         created_at: "2022-08-08T13:48:14.000Z",
  //         updated_at: "2022-08-08T13:48:14.000Z"
  //       },
  //       {
  //         id: 34,
  //         label: "Autres activités",
  //         code: "autres_activites",
  //         order: 2,
  //         is_active: 1,
  //         only_admin: 1,
  //         model: "type_activity",
  //         color: "NULL",
  //         data: [
  //           {
  //             id: 77,
  //             label: "Prosq/Qualif/Visite Médicale",
  //             code: "Prosq/Qualif/Visite Médicale"
  //           },
  //           {
  //             id: 78,
  //             label: "CE / DP / CHSCT",
  //             code: "CE / DP / CHSCT"
  //           },
  //           {
  //             id: 79,
  //             label: "Disponibilité",
  //             code: "Disponibilité"
  //           },
  //           {
  //             id: 80,
  //             label: "Présence agence",
  //             code: "Présence agence"
  //           }
  //         ],
  //         creator_id: 1,
  //         created_at: "2022-08-08T13:48:14.000Z",
  //         updated_at: "2022-08-08T13:48:14.000Z"
  //       },
  //       {
  //         id: 35,
  //         label: "Absences",
  //         code: "absences",
  //         order: 3,
  //         is_active: 1,
  //         only_admin: 1,
  //         model: "type_activity",
  //         color: "NULL",
  //         data: [
  //           {
  //             id: 81,
  //             label: "Congés payés",
  //             code: "congés_payés"
  //           }
  //         ],
  //         creator_id: 1,
  //         created_at: "2022-08-08T13:48:14.000Z",
  //         updated_at: "2022-08-08T13:48:14.000Z"
  //       }
  //     ],
  //     ratio: [
  //       {
  //         id: 82,
  //         label: "1/8",
  //         code: "1"
  //       },
  //       {
  //         id: 83,
  //         label: "2/8",
  //         code: "0.25"
  //       },
  //       {
  //         id: 84,
  //         label: "3/8",
  //         code: "0.375"
  //       },
  //       {
  //         id: 85,
  //         label: "4/8",
  //         code: "0.5"
  //       },
  //       {
  //         id: 86,
  //         label: "5/8",
  //         code: "0.625"
  //       },
  //       {
  //         id: 87,
  //         label: "6/8",
  //         code: "0.75"
  //       },
  //       {
  //         id: 88,
  //         label: "7/8",
  //         code: "0.875"
  //       },
  //       {
  //         id: 89,
  //         label: "8/8",
  //         code: "1"
  //       }
  //     ],
  //     calendar: [
  //       {
  //         date: "2022-09-01",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-02",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-03",
  //         is_weekend: 1,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-04",
  //         is_weekend: 1,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-05",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-06",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-07",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-08",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-09",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-10",
  //         is_weekend: 1,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-11",
  //         is_weekend: 1,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-12",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-13",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-14",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-15",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-16",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-17",
  //         is_weekend: 1,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-18",
  //         is_weekend: 1,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-19",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-20",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-21",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-22",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-23",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-24",
  //         is_weekend: 1,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-25",
  //         is_weekend: 1,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-26",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-27",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-28",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-29",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       },
  //       {
  //         date: "2022-09-30",
  //         is_weekend: 0,
  //         is_holidays: 0
  //       }
  //     ]
  //   };
  //
  // activities = {
  //       id: 17,
  //       personal_id: 1,
  //       month: "2022-07-31T23:00:00.000Z",
  //       status_id: 8,
  //       has_been_diffused: 1,
  //       comment: null,
  //       activity_details: [
  //         {
  //           id: 1,
  //           activity_id: 17,
  //           personal_id: 1,
  //           project_id: null,
  //           absence_id: null,
  //           mission_id: null,
  //           category_id: null,
  //           type_id: 33,
  //           date: "2022-09-31T23:00:00.000Z",
  //           ratio: 1,
  //           created_at: "2022-08-09T11:55:36.000Z",
  //           updated_at: "2022-08-09T11:55:36.000Z",
  //           deleted_at: null
  //         },
  //         {
  //           id: 2,
  //           activity_id: 17,
  //           personal_id: 1,
  //           project_id: null,
  //           absence_id: null,
  //           mission_id: null,
  //           category_id: null,
  //           type_id: 34,
  //           date: "2022-09-01T23:00:00.000Z",
  //           ratio: 0.375,
  //           created_at: "2022-08-09T11:55:36.000Z",
  //           updated_at: "2022-08-09T11:55:36.000Z",
  //           deleted_at: null
  //         },
  //         {
  //           id: 3,
  //           activity_id: 17,
  //           personal_id: 1,
  //           project_id: null,
  //           absence_id: null,
  //           mission_id: null,
  //           category_id: 79,
  //           type_id: null,
  //           date: "2022-09-01T23:00:00.000Z",
  //           ratio: 0.625,
  //           created_at: "2022-08-09T11:55:36.000Z",
  //           updated_at: "2022-08-09T11:55:36.000Z",
  //           deleted_at: null
  //         }
  //       ]
  //     }

  submittingCreate: boolean;
  submittingDiffuse: boolean;
  weeks = [];
  showInstructions = false;
  loadingCalendar = false;
  hasIntegrityError: boolean;

  constructor(private activitiesService: ActivitiesService,
              private messageService: MessageService,
              private route:ActivatedRoute) {
    this.getActivityByMonth();
    this.route.params.subscribe(param => {
      if(param.id){
        this.getActivityById(param.id);
      }
    })
  }

  ngOnInit(): void {

  }

  async getInformationForActivity(){
    try {
      const res = await this.activitiesService.getInformationForActivity({date: moment(this.date.value).format('YYYY-MM-DD')}).toPromise();
      this.data = res.data;
      this.data.ratio.unshift({
        id: null,
        label: '',
      });
      this.data.ratio = this.data.ratio.map(ratio => {
        ratio.code = Number(ratio.code) || null;
        return ratio;
      });
      this.getWeeks();
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
        month: moment(this.activities.month).format('YYYY-MM-DD'),
        activity_details: this.activities.activity_details.map(activity => {
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
      const res = await this.activitiesService.diffuseActivity(params).toPromise();
      this.activities = res.data;
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
      this.date.patchValue(this.activities.month);
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
      const res = await this.activitiesService.getActivityByMonth({month: moment(this.date.value)?.format('YYYY-MM-DD')}).toPromise();
      this.activities = res.data;
      this.date.patchValue(this.activities.month);
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

  chosenYearHandler( normalizedYear ) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth, datepicker) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

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
    const categories = [
      'Prosq/Qualif/Visite Médicale',
      'CE / DP / CHSCT',
      'Disponibilité',
      'Présence agence'
    ];
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

  }

  setDataCell(day, type_activity, $event: any) {
    const categories = [
      'Prosq/Qualif/Visite Médicale',
      'CE / DP / CHSCT',
      'Disponibilité',
      'Présence agence'
    ];
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

  }

  hasAtLeastAFilledCell(type_activity) {
      // console.log('hasAtLeast', this.activities.activity_details);
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
    let sum = 0;
    this.activities.activity_details.forEach(activity => {
      if(moment(day.date).isSame(moment(activity.date), 'date')){
        sum += activity.ratio;
      }
    });
    return sum;
  }

  getTotalIssues(){
    this.hasIntegrityError = false;
    let errorMessage = '';
    this.data.calendar.forEach(day => {
      const total = this.getTotalInColumn(day);
      if(total > 1){
        const date = moment(day.date).format('DD MMM YYYY');
        errorMessage += "<li>La date "+date+" présente une erreur</li>"
      }
    })
    if(errorMessage?.length>0){
      this.hasIntegrityError = true;
    }
    return errorMessage;
  }
}
