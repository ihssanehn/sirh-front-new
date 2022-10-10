import { Component, OnInit } from '@angular/core';
import {ListsService} from "@services/lists.service";
import * as _moment from 'moment';
import frLocale from 'date-fns/locale/fr';

import {Subscription} from "rxjs";
import {ActivitiesService} from "@services/activities.service";
import {Activity} from "@app/core/entities";
import {MainStore} from "@store/mainStore.store";

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-frais-list',
  templateUrl: './frais-list.component.html',
  styleUrls: ['./frais-list.component.scss'],
})
export class FraisListComponent implements OnInit {
  showFilters = false;
  dateValue;
  config = {
    format: 'MM/YYYY',
    locale: frLocale,
  }

  personals = [];
  appartenances = [];
  profit_centers = [];
  sort_choices = [];
  business_units = [];
  avance_status = [];
  business_lines = [];
  adv_managers = [];
  direction_ops = [];
  clients = [];
  departments = [];
  validation_stats = [];
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
    appartenances: [],
    profit_centers: [],
    sort_choices: [],
    business_units: [],
    avance_status: [],
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
  loadingSelect = {};
  id_entite;
  constructor(public listService: ListsService,
              private activitiesService: ActivitiesService,
              private mainStore: MainStore,
              ) { }

  ngOnInit(): void {
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    this.getFilters();
    this.getActivities();
    this.getStatsActivity();
  }

  resetFilters() {
    this.filter = {
      keyword:  this.filter.keyword,
      personals: [],
      appartenances: [],
      profit_centers: [],
      sort_choices: [],
      business_units: [],
      departments: [],
      validation_stats: [],
      avance_status: [],
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

  async getFilters(){
    try{
      this.personnalFilters = await this.listService.getPersonalFilters().toPromise();
      console.log('this.filters', this.personnalFilters);
      this.personals = this.personnalFilters.personals;
      this.appartenances = this.personnalFilters.memberships;
      this.profit_centers = this.personnalFilters.profit_centers;
      this.sort_choices = this.personnalFilters.sort_choices;
      this.business_units = this.personnalFilters.business_units;
      this.avance_status = this.personnalFilters.avance_status;
      this.business_lines = this.personnalFilters.business_lines;
      this.adv_managers = this.personnalFilters.adv_managers;
      this.direction_ops = this.personnalFilters.op_directions;
      this.clients = this.personnalFilters.clients;
      this.departments = this.personnalFilters.departments;
      this.validation_stats = this.personnalFilters.validation_stats;


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
