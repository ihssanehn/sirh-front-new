import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import * as _moment from "moment";
import {appAnimations} from "@shared/Objects/sharedObjects";
import {ActivitiesService} from "@services/activities.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

import {IDatePickerConfig} from "ng2-date-picker/lib/date-picker/date-picker-config.model";
import {DatePickerComponent} from "ng2-date-picker";
import {UserStore} from "@store/user.store";
import Swal from "sweetalert2";
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
  personal_id = null;
  @ViewChild('datepicker') datepicker: DatePickerComponent;
  config: IDatePickerConfig = {
    format: 'MM/YYYY',
  }

  data: any;
  activities;

  submittingCreate: boolean;
  submittingDiffuse: boolean;
  weeks = [];
  showInstructions = false;
  loadingCalendar = false;
  hasIntegrityError: boolean;
  errorMessage = '';
  other_activity = '';

  performance = {
    getWeeks: 0,
    getRightLabels: 0,
    getDataInCell: 0,
    fillLine: 0,
    setDataCell: 0,
    hasAtLeastAFilledCell: 0,
    getTotalInColumn: 0,
    getTotalInLine: 0,
    getTotalIssues: 0,
    findRatioLabel: 0
  }

  rightLabels = [];
  totalsColumnns = [];
  constructor(private activitiesService: ActivitiesService,
              private messageService: MessageService,
              private changeDetectorRef: ChangeDetectorRef,
              private router: Router,
              private userStore: UserStore,
              private route:ActivatedRoute) {

    this.route.queryParams.subscribe(qp => {
      const month = moment(qp.month, 'YYYY-MM-DD');
      if(month){
        this.selectedMonth = qp.month;
        this.dateValue = moment(qp.month).format('MM/YYYY');
      }
      if(qp.personal_id) {
        this.personal_id = Number(qp.personal_id);
      }
      this.getActivityByMonth();
    })

    // this.route.params.subscribe(param => {
    //   if(param.id){
    //     this.getActivityById(param.id);
    //   }
    // })
  }

  ngAfterViewInit() {
    // if(!this.selectedMonth){
    // }
  }

  ngOnInit(): void {

  }

  setActivitiesIntoCalendar(){
    this.data.calendar.forEach(day => {
      this.rightLabels?.forEach(type_activity => {
        day[type_activity.code] = this.getDataInCell(day, type_activity);
      });
    })
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
        this.getRightLabels();
        this.getWeeks();
        this.setActivitiesIntoCalendar();
        this.setColumnsTotals();
        this.getTotalIssues();
      }

    } catch (e){
      console.log('error getActivityByid', e)
    } finally {

    }
  }

  async addOrUpdateActivity(){
    try {
      const activities = [];
      console.log('addOrUpdateActivity', this.data.calendar, this.rightLabels);
      this.data.calendar.forEach(day => {
        this.rightLabels.forEach(type_activity => {

          //   "personal_id": 1,
          //   "project_id": 3,
          //   "is_extra": 1,
          //   "type_extra": "night",
          //   "type_id": 23,
          //   "ratio": 3.000,
          //   "date": "2022-10-07"

          // 'night',
          //   'sunday',
          //   'saturday',
          //   'holiday'

          if(type_activity.is_extra && Number(day[type_activity.code]) > 0){
            if(day[type_activity.code]){
              let type_extra = null;
              if(day.is_holidays){
                type_extra = 'holiday';
              }else if(day.is_weekend){
                type_extra = 'saturday';
              }else{
                type_extra = 'night';
              }
              activities.push({
                personal_id: this.personal_id ||  this.personal_id || this.userStore.getAuthenticatedUser?.id,
                type_id: type_activity.type_id,
                project_id: type_activity.project_id,
                is_extra: 1,
                type_extra: type_extra,
                ratio: day[type_activity.code],
                date: moment(day.date).format('YYYY-MM-DD')
              })
            }
          }else{
            if(day[type_activity.code] instanceof Object){
              activities.push({
                personal_id: this.personal_id ||  this.personal_id || this.userStore.getAuthenticatedUser?.id,
                type_id: day[type_activity.code]?.type_id,
                project_id: day[type_activity.code]?.project_id,
                category_id: day[type_activity?.code].category_id,
                ratio: day[type_activity.code]?.ratio,
                code: type_activity.code,
                date: moment(day[type_activity.code]?.date).format('YYYY-MM-DD')
              });
            }
          }
        })
      })
      console.log('addOrUpdateActivity after', activities);

      // return;
      this.submittingCreate = true;
      const params = {
        personal_id:  this.personal_id || this.userStore.getAuthenticatedUser?.id,
        id: this.activities.id,
        month: moment(this.selectedMonth).format('YYYY-MM-DD'),
        comment: this.activities.comment,
        activity_details: activities
        // activity_details: this.activities.activity_details?.map(activity => {
        //   return {
        //     personal_id: activity.personal_id,
        //     type_id: activity.type_id,
        //     category_id: activity.category_id,
        //     ratio: activity.ratio,
        //     date: moment(activity.date).format('YYYY-MM-DD')
        //   }
        // })
      }
      const res = await this.activitiesService.addOrUpdateActivity(params).toPromise();
      this.activities = res.data;
      this.setColumnsTotals();
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
    Swal.fire({
      title: 'Êtes vous sûr?',
      text: 'Voulez-vous vraiment diffuser l\'activité de ce mois?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#078aff',
      cancelButtonColor: '#F54F4F',
      confirmButtonText: 'Oui, diffuser',
      cancelButtonText: 'Annuler',
      heightAuto: false
    }).then(async (result) => {
      if (result.value) {
        try {
          this.submittingDiffuse= true;
          const params = {
            id: this.activities.id
          }
          await this.addOrUpdateActivity();
          const res = await this.activitiesService.diffuseActivity(params).toPromise();
          this.activities = res.data;
          this.setColumnsTotals();
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
    });
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
      const params: any = {
        month: moment(this.selectedMonth)?.set({date: 1}).format('YYYY-MM-DD')
      }

      params.personal_id =  this.personal_id || this.userStore.getAuthenticatedUser?.id;

      const res = await this.activitiesService.getActivityByMonth(params).toPromise();
      this.activities = res.data;
      await this.getInformationForActivity();
    } catch (e){
      console.log('error getActivityByMonth', e)
    } finally {
      this.loadingCalendar = false;
    }
  }

  getWeeks(){
    const start = new Date().getTime();  //Time in ms
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

    const end = new Date().getTime();
    this.performance.getWeeks += (end-start);
  }

  chosenMonthHandler() {
    if(this.dateValue){
      // this.selectedMonth = moment('01/'+this.dateValue, 'DD/MM/YYYY');
      // this.getActivityByMonth();
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: { month: moment('01/'+this.dateValue, 'DD/MM/YYYY').format('YYYY-MM-DD') },
          queryParamsHandling: 'merge'
        });
    }
  }

  //todo
  //fix filter month
  //fix validator future months

  clearDateInput(date: any) {
    date.patchValue(null);
  }

  getRightLabels(){
    const start = new Date().getTime();  //Time in ms
    if(!this.data){
      this.rightLabels = [];
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
          if(activity.code === 'absences'){
            subactivity.is_blocked = true
          }
          if(activity.code === 'travail_normal'){
            subactivity.code = 'travnormal_'+subactivity.id;
            subactivity.category_id =  null;
          }
          labels.push(subactivity);
          if(subactivity.name){
            labels.push({
              label: 'Astriente(Heures)',
              is_extra: true,
              code: 'extra_'+subactivity.code,
              project_id: subactivity.id,
              category_id: subactivity.category_id,

              end_date: subactivity.end_date,
              start_date: subactivity.start_date,
              type_id: subactivity.type_id
            });
            console.log('labels', labels);
          }
        })
      }
    });
    console.log('this.rightLabels', labels);
    this.rightLabels = labels;
    const end = new Date().getTime();
    this.performance.getRightLabels += (end-start);
  }

  getWeekendDay(day){
      return moment(day.date).local('fr').format('dd')[0];
  }

  showContent(day, type_activity){
    console.log('showContent', day, type_activity);
  }

  getDataInCell(day, type) {
    const start = new Date().getTime();  //Time in ms
    if(!this.activities.activity_details){
      return null;
    }

    // if(type.is_extra){
    //   return null
    // }

    if(day.is_weekend && !type.is_extra){
      const end = new Date().getTime();
      this.performance.getDataInCell += (end-start);
      return moment(day.date).local('fr').format('dd')[0];
    }

    console.log('this.activities.activity_details', type, this.activities.activity_details);
    // TODO keep first element only
    let element = this.activities.activity_details?.find(activity => {
        let testWichLine = false;
        if(activity.is_extra){
          testWichLine = activity.project_id === type.project_id;
        }else
          if(activity.project_id ){
          testWichLine = activity.project_id === type.id;
        }else if(activity.category_id ){
          testWichLine = activity.category_id === type.id;
        }else {
          testWichLine = activity.type_id === type.id;
        }

        return moment(day.date).isSame(moment(activity.date), 'date') && testWichLine;
    });
    if(element && type.is_extra){
      element = element.ratio;
    }
    const end = new Date().getTime();
    this.performance.getDataInCell += (end-start);
    return element;
  }

  findRatioValue(element){
    return element?.ratio;
  }

  findRatioLabel(element){
    const start = new Date().getTime();  //Time in ms
    const ratio = this.data.ratio.find(ratio => element?.ratio == Number(ratio.code))?.label || null;
    const end = new Date().getTime();
    this.performance.findRatioLabel += (end-start);
    return ratio;
  }

  getWeek(date){
    return moment(date).format('W');
  }

  getColspanWeek(week_number, day, index){
    if(index>=0){

    }
  }

  fillLine(type_activity, unfill=false) {
    const start = new Date().getTime();  //Time in ms
    this.data.calendar.forEach(day => {
      let can_change = true;
      this.rightLabels.forEach(type_activity => {
        if(day[type_activity.code] instanceof Object && day[type_activity.code]?.ratio){
          can_change = false;
        }
      });
      if(day[type_activity.code] instanceof Object){
        if(unfill){
          day[type_activity.code].ratio = null;
        }else{
          if(can_change){
            day[type_activity.code].ratio = 1;
          }
        }
      }else{
        if(!unfill && can_change){
          day[type_activity.code] = {
            absence_id: null,
            activity_id: this.activities.id,
            category_id: type_activity.category_id,
            date: moment(day.date).format('YYYY-MM-DD'),
            mission_id:  type_activity.code?.indexOf('travnormal') >=0 ? type_activity.id : null,
            personal_id: this.personal_id || this.userStore.getAuthenticatedUser?.id,
            project_id: type_activity.code?.indexOf('travnormal') >=0  ? type_activity.id : null,
            ratio: 1,
            type_id: type_activity.type_id
          }
        }
      }
    })
    // this.data.calendar.forEach(day => {
    //   const cells_in_columnn = this.activities.activity_details.filter(activity => moment(activity.date).isSame(day.date, 'date') && activity.activity_id);
    //   if(!(cells_in_columnn?.length>0)){ // Si aucune cellule dans cette colonne n'est trouvé
    //     this.activities.activity_details.push({
    //       absence_id: null,
    //       activity_id: this.activities.id,
    //       category_id: type_activity.category_id,
    //       date: moment(day.date).format('YYYY-MM-DD'),
    //       mission_id: null,
    //       personal_id: this.activities.personal_id,
    //       project_id: null,
    //       ratio: unfill ? null: 1,
    //       type_id: type_activity.type_id
    //     });
    //   }else{ // Si au moins une cellule dans cette colonne existe
    //     if(unfill) { // le cas de vidage
    //       this.activities.activity_details.forEach(activity => {
    //         if(moment(activity.date).isSame(day.date, 'date') &&
    //           (activity.category_id ? (activity.category_id === type_activity.id): (activity.type_id === type_activity.id))
    //         ){
    //           activity.ratio = null;
    //         }
    //       })
    //     }else{ // le cas de remplissage
    //       const ratioCells = cells_in_columnn.filter(cell => cell.ratio); // les cellules dans cette colonne qui on un ratio > 0
    //       if(!(ratioCells?.length>0)){// aucune cellule dans cette colonne n'est remplie
    //         const exact_cell = cells_in_columnn.find(cell =>  (cell.category_id ? (cell.category_id === type_activity.id): (cell.type_id === type_activity.id)));
    //         if(exact_cell){
    //           exact_cell.ratio = 1
    //         }else{
    //           this.activities.activity_details.push({
    //             absence_id: null,
    //             activity_id: this.activities.id,
    //             category_id: type_activity.category_id,
    //             date: moment(day.date).format('YYYY-MM-DD'),
    //             mission_id: null,
    //             personal_id: this.activities.personal_id,
    //             project_id: null,
    //             ratio: 1,
    //             type_id:  type_activity.type_id
    //           });
    //         }
    //       }
    //     }
    //   }
    // });
    this.setColumnsTotals();
    this.getTotalIssues();
    const end = new Date().getTime();
    this.performance.fillLine += (end-start);
  }

  setDataCell(day, type_activity, $event: any) {
    console.log('Setting data in cell', day, type_activity, $event);
    const start = new Date().getTime();  //Time in ms
    // const element = this.getDataInCell(day, type_activity);
    // if(element){
    //   element.ratio = $event;
    // }else{
    //   this.activities.activity_details.push({
    //     absence_id: null,
    //     activity_id: this.activities.id,
    //     category_id: type_activity.category_id,
    //     date: moment(day.date).format('YYYY-MM-DD'),
    //     mission_id: null,
    //     personal_id: this.activities.personal_id,
    //     project_id: null,
    //     ratio: $event,
    //     type_id: type_activity.type_id
    //   });
    // }


    if(day[type_activity.code]){
      day[type_activity.code].ratio = $event;
    }else{
      day[type_activity.code] = {
             absence_id: null,
             activity_id: this.activities.id,
             category_id: type_activity.category_id,
             date: moment(day.date).format('YYYY-MM-DD'),
             mission_id: type_activity.id,
             personal_id:  this.personal_id || this.userStore.getAuthenticatedUser?.id,
             project_id: type_activity.id,
             ratio: $event,
             type_id: type_activity.type_id
       }
    }
    this.setColumnsTotals();
    this.getTotalIssues();
    const end = new Date().getTime();
    this.performance.setDataCell += (end-start);
  }

  hasAtLeastAFilledCell(type_activity) {
    const start = new Date().getTime();  //Time in ms
      // if(!this.activities.activity_details){
      //   return false;
      // }
    const filledElementInLine = this.data.calendar.find(day => day[type_activity.code] instanceof Object && day[type_activity.code]?.ratio);
      // const cellContent = this.activities.activity_details.find(activity =>
      //   activity.ratio
      //   &&
      //   (activity.category_id ? (activity.category_id === type_activity.id): (activity.type_id === type_activity.id))
      // );
    const end = new Date().getTime();
    this.performance.hasAtLeastAFilledCell += (end-start);
    return filledElementInLine ? true: false;

  }

  showActivities() {
    console.log('performance', this.performance, this.data.calendar);
  }

  getTotalAstrienteInColumn(day){
    let sum = 0;
    this.rightLabels.forEach(type_activity => {
      if(type_activity.is_extra){
        sum += Number(day[type_activity.code]) ? day[type_activity.code]: 0;
      }
    });
    return sum;
  }

  getTotalInColumn(day){
    const start = new Date().getTime();  //Time in ms
    // if(!this.activities.activity_details){
    //   return 0;
    // }
    let sum = 0;
    this.rightLabels.forEach(type_activity => {
      if(day[type_activity.code]?.ratio){
        sum += Number(day[type_activity.code].ratio) ? day[type_activity.code].ratio: 0;
      }
    });
    // this.activities.activity_details.forEach(activity => {
    //   if(moment(day.date).isSame(moment(activity.date), 'date')){
    //     sum += activity.ratio;
    //   }
    // });
    const end = new Date().getTime();
    this.performance.getTotalInColumn += (end-start);
    return sum;
  }

  setColumnsTotals(){
    this.data.calendar.forEach(day => {
      day.totalInColumn = this.getTotalInColumn(day);
    })
  }

  getTotalAstrientInLine(type_activity){
    let sum = 0;
    this.data.calendar.forEach(day => {
      sum += Number(day[type_activity.code]) ? day[type_activity.code]: 0;
    });
    return sum;
  }

  getTotalInLine(type_activity){
    const start = new Date().getTime();  //Time in ms
    let sum = 0;
    // console.log('getTotalInLine', this.activities);
    // if(!this.activities.activity_details){
    //   return 0;
    // }
    this.data?.calendar.forEach(day => {
      if(day[type_activity.code]?.ratio){
        sum += Number(day[type_activity.code].ratio) ? day[type_activity.code].ratio: 0;
      }
    });
    // this.activities.activity_details.forEach(cell =>{
    //  if((cell.category_id ? (cell.category_id === type_activity.id): (cell.type_id === type_activity.id))){
    //    sum += cell.ratio;
    //  }
    // });
    const end = new Date().getTime();
    this.performance.getTotalInLine += (end-start);
    return sum;
  }

  getTotalIssues(){
    const start = new Date().getTime();  //Time in ms
    this.hasIntegrityError = false;
    let errorMessage = '';
    this.data.calendar.forEach(day => {
      const total = this.getTotalInColumn(day);
      if(!day.is_weekend){
        if((total !== 1 && moment(day.date).isSameOrBefore(moment(), 'date')) || ![0, 1].includes(total)){
          const date = moment(day.date).format('DD MMM YYYY');
          errorMessage += "<li>La date "+date+" présente une erreur</li>"
        }
      }
    })
    if(errorMessage?.length>0){
      this.hasIntegrityError = true;
    }
    // this.changeDetectorRef.detectChanges();
    this.errorMessage = errorMessage;
    const end = new Date().getTime();
    this.performance.getTotalIssues += (end-start);
  }

  saveExtra(day: string, type_activity: any) {

  }

  showDay(day) {
    console.log('showDay', day);
  }
}
