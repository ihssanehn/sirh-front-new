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
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  showFilters = false;
  dateValue;
  config = {
    format: 'MM/YYYY',
    locale: frLocale,
  }
  appartenances = [];
  profit_centers = [];
  tri_cost = [];
  business_units = [];
  avance_status = [];
  adv_managers = [];
  direction_ops = [];
  clients = [];
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
    appartenances: [],
    profit_centers: [],
    tri_cost: [],
    business_units: [],
    avance_status: [],
    adv_managers: [],
    direction_ops: [],
    clients: [],
    month: null,
    has_internal_billing_admin: null,
    with_inactive_cp: null,
    information_pending: null,
    comment: null,
    start_date: null,
    end_date: null,
    consultant_id: null
  }

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
  triCosts = [];
  personals = [];
  projects = [
    {
      name: 'Project 1',
      start_date: '01/01/2021',
      end_date: '01/01/2021',
      reference: 'ref1',
      client_name: 'client1',
      missions: [{
        name: 'Mission 1',
        reference: 'ref1',
        start_date: '01/01/2021',
        end_date: '01/01/2021',
        consultant_name: 'consultant1'
      }]
    },
    {
      name: 'Project 1',
      start_date: '01/01/2021',
      end_date: '01/01/2021',
      reference: 'ref1',
      client_name: 'client1',
      missions: [{
        name: 'Mission 1',
        reference: 'ref1',
        start_date: '01/01/2021',
        end_date: '01/01/2021',
        consultant_name: 'consultant1'
      }]
    },
    {
      name: 'Project 1',
      start_date: '01/01/2021',
      end_date: '01/01/2021',
      reference: 'ref1',
      client_name: 'client1',
      missions: [{
        name: 'Mission 1',
        reference: 'ref1',
        start_date: '01/01/2021',
        end_date: '01/01/2021',
        consultant_name: 'consultant1'
      }]
    },
    {
      name: 'Project 1',
      start_date: '01/01/2021',
      end_date: '01/01/2021',
      reference: 'ref1',
      client_name: 'client1',
      missions: [{
        name: 'Mission 1',
        reference: 'ref1',
        start_date: '01/01/2021',
        end_date: '01/01/2021',
        consultant_name: 'consultant1'
      }]
    }
  ];
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
      appartenances: [],
      profit_centers: [],
      tri_cost: [],
      business_units: [],
      avance_status: [],
      adv_managers: [],
      direction_ops: [],
      clients: [],
      month: null,
      information_pending: null,
      has_internal_billing_admin: null,
      with_inactive_cp: null,
      comment: null,
      start_date: null,
      end_date: null,
      consultant_id: null
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
      this.appartenances = this.personnalFilters.memberships;
      this.profit_centers = this.personnalFilters.profit_centers;
      this.tri_cost = this.personnalFilters.tri_cost;
      this.business_units = this.personnalFilters.business_units;
      this.avance_status = this.personnalFilters.avance_status;
      this.adv_managers = this.personnalFilters.adv_managers;
      this.direction_ops = this.personnalFilters.op_directions;
      this.clients = this.personnalFilters.clients;


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
