import { Component, OnInit } from '@angular/core';
import {ListsService} from "@services/lists.service";
import * as _moment from 'moment';
import { Moment } from 'moment';

import {
  OwlDateTimeComponent,
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeFormats
} from 'ng-pick-datetime';

import {FormControl} from "@angular/forms";
import {MomentDateTimeAdapter} from "ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class";
import {Subscription} from "rxjs";
import {ActivitiesService} from "@services/activities.service";
import {Activity} from "@app/core/entities";

const moment = (_moment as any).default ? (_moment as any).default : _moment;

export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
  parseInput: 'MM/YYYY',
  fullPickerInput: 'l LT',
  datePickerInput: 'MM/YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
  providers: [
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS},
  ],
})
export class ActivityListComponent implements OnInit {
  showFilters = false;

  personals = [];
  member_ships = [];
  center_profits = [];
  sort_choices = [];
  business_units = [];
  adv_managers = [];
  direction_ops = [];
  clients = [];
  departments = [];
  // pagination: any = {
  //   page: 1,
  //   total: 10,
  //   limit: 10
  // };

  exportPrint = {
    activity_record: null,
    expense_sheet: null,
  }

  filter = {
    keyword: '',
    is_virtual: null,
    page: 1,
    limit: 10,

    personals: [],
    member_ships: [],
    center_profits: [],
    sort_choices: [],
    business_units: [],
    adv_managers: [],
    direction_ops: [],
    clients: [],
    month: null,
    has_internal_billing_admin: null,
    in_out_office: null,
    with_inactive_cp: null,
  }
  sieges = [
    {
      label: 'Siège',
      id: true
    },
    {
      label: 'Hors siège',
      id: false
    }
  ];

  personnalFilters;
  public date = new FormControl(moment());
  loadingData = false;
  activities: Array<Activity> = [];
  searchSubscription: Subscription;

  submittingPrint = false;
  submittingExport = false;
  submittingDetailedExport = false;
  stats: any;

  constructor(private listService: ListsService,
              private activitiesService: ActivitiesService,
              ) { }

  ngOnInit(): void {
    this.getFilters();
    this.getActivities();
    this.getStatsActivity();
  }

  resetFilters() {

  }

  async getFilters(){
    try{
      this.personnalFilters = await this.listService.getPersonalFilters().toPromise();
      console.log('this.filters', this.personnalFilters);
      this.personals = this.personnalFilters.personals;
      this.member_ships = this.personnalFilters.memberships;
      this.center_profits = this.personnalFilters.profit_centers;
      this.sort_choices = this.personnalFilters.sort_choices;
      this.business_units = this.personnalFilters.business_units;
      this.adv_managers = this.personnalFilters.adv_managers;
      this.direction_ops = this.personnalFilters.op_directions;
      this.clients = this.personnalFilters.clients;
      this.departments = this.personnalFilters.departments;


     } catch (e) {
      console.log('error filter PROFIT_CENTER', e);
    }
  }

  filterChanged() {
    this.getActivities();
  }

  // changePagination() {
  //   this.pagination = { ...this.pagination, limit: this.pagination.limit, total: this.pagination.total };
  //   this.filter.page = this.pagination.page;
  //   this.filter.limit = this.pagination.limit;
  //   this.getActivities();
  // }

  getActivities(){
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    const params = {
      // type: this.type
    }
    Object.keys(this.filter).forEach(key => {
      if(this.filter[key] !== null && this.filter[key] !== []){
        params[key] = this.filter[key];
      }
    })
    this.loadingData = true;
    this.searchSubscription = this.activitiesService.getAll(params).subscribe((res) => {
      this.activities = res.data;
      console.log('this.activities', this.activities);
      // this.pagination = { ...this.pagination, total: result?.data?.total };
    }, err =>{
      console.log('err getActivities', err);
    }, ()=>{
      this.loadingData = false;
    })
  }

  async getStatsActivity(){
    try {
      const personals = [1, 2, 3, 4]
      const res = await this.activitiesService.getStatsActivity(personals).toPromise();
      this.stats = res.data;
    } catch (e){
      console.log('error getStatsActivity', e)
    } finally {

    }
  }

  ischecked(id) {

  }

  returnfalse(){
    return false;
  }

  clearDateInput(date: any) {
    date.patchValue(null);
  }

  selectMonthFilter($event) {
    // if(isMoment(moment($event))){
    //   this.filter.month = moment($event);
    //   console.log('selectMonthFilter', this.filter.month )
    // }
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

  print(){

  }

  export(){

  }

  detailedExport(){

  }
}
