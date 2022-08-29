import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedClasses} from "@shared/Utils/SharedClasses";
import frLocale from "date-fns/locale/fr";
import {Activity} from "@app/core/entities";
import {Subscription} from "rxjs";
import {ListsService} from "@services/lists.service";
import {ActivitiesService} from "@services/activities.service";
import * as _moment from "moment";

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-absence-list-visualisation',
  templateUrl: './absence-list-visualisation.component.html',
  styleUrls: ['./absence-list-visualisation.component.scss']
})
export class AbsenceListVisualisationComponent implements OnInit {
  showFilters = false;
  dateValue;
  config = {
    format: 'MM/YYYY',
    locale: frLocale,
  }

  personals = [];
  member_ships = [];
  center_profits = [];
  sort_choices = [];
  business_units = [];
  type_frais = [];
  business_lines = [];
  adv_managers = [];
  direction_ops = [];
  clients = [];
  departments = [];
  validation_stats = [];
  societe_origins = [];
  // pagination: any = {
  //   page: 1,
  //   total: 10,
  //   limit: 10
  // };

  exportPrint = {
    activity_record: null,
    expense_sheet: null,
  }
// is_virtual: null,
  // page: 1,
  // limit: 10,
  filter = {
    keyword: '',
    personals: [],
    member_ships: [],
    center_profits: [],
    sort_choices: [],
    business_units: [],
    type_frais: [],
    business_lines: [],
    adv_managers: [],
    direction_ops: [],
    clients: [],
    month: null,
    has_internal_billing_admin: null,
    in_out_office: null,
    with_inactive_cp: null,
    departments: [],
    validation_stats: null,
    societe_origins: null,
    information_pending: null,
    comment: null
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
    this.filter = {
      keyword:  this.filter.keyword,
      personals: [],
      member_ships: [],
      center_profits: [],
      sort_choices: [],
      business_units: [],
      departments: [],
      validation_stats: [],
      societe_origins: [],
      type_frais: [],
      business_lines: [],
      adv_managers: [],
      direction_ops: [],
      clients: [],
      month: null,
      information_pending: null,
      has_internal_billing_admin: null,
      in_out_office: null,
      with_inactive_cp: null,
      comment: null
    }
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
      this.type_frais = this.personnalFilters.type_frais;
      this.business_lines = this.personnalFilters.business_lines;
      this.adv_managers = this.personnalFilters.adv_managers;
      this.direction_ops = this.personnalFilters.op_directions;
      this.clients = this.personnalFilters.clients;
      this.departments = this.personnalFilters.departments;
      this.validation_stats = this.personnalFilters.validation_stats;
      this.societe_origins = this.personnalFilters.societe_origins;


    } catch (e) {
      console.log('error filter PROFIT_CENTER', e);
    }
  }

  filterChanged() {
    this.getActivities();
    this.getStatsActivity();
  }



  getActivities(){
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    const params = {
      // type: this.type
      month: this.filter.month,
      personals: this.filter.personals
    }
    if(this.showFilters){
      Object.keys(this.filter).forEach(key => {
        if(['has_internal_billing_admin', 'with_inactive_cp'].includes(key) ){ // checkboxes
          if(this.filter[key]){
            params[key] = this.filter[key];
          }
        }else{
          if(this.filter[key] !== null  && this.filter[key] !== []){
            params[key] = this.filter[key];
          }
        }
      })
    }
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
      const personals = [1, 2, 3, 4] //TODO
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

  chosenMonthHandler() {
    if(this.dateValue?.$d){
      this.filter.month = moment(this.dateValue.$d)?.format('YYYY-MM-DD');

      this.filterChanged();
    }
  }

  getMonth(activity){
    return moment(activity.month).format('YYYY-MM-DD');
  }

  print(){

  }

  export(){

  }

  detailedExport(){

  }
}
