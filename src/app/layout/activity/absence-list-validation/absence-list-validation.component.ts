import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedClasses} from "@shared/Utils/SharedClasses";
import frLocale from "date-fns/locale/fr";
import {Activity} from "@app/core/entities";
import {Subscription} from "rxjs";
import {ListsService} from "@services/lists.service";
import {ActivitiesService} from "@services/activities.service";
import * as _moment from "moment";
import {isMoment} from "moment";
import {MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";
import {MessageService} from "primeng/api";
import {MainStore} from "@store/mainStore.store";

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-absence-list-validation',
  templateUrl: './absence-list-validation.component.html',
  styleUrls: ['./absence-list-validation.component.scss']
})
export class AbsenceListValidationComponent implements OnInit {
  showFilters = false;
  dateValue;
  config = {
    format: 'MM/YYYY',
    locale: frLocale,
  }

  types = [];
  statues = [];
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
  absence_types = [];
  demand_status = [];
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
    personals: [],
    member_ships: [],
    sort_choices: [],
    business_units: [],
    business_lines: [],
    adv_managers: [],
    direction_ops: [],
    clients: [],
    demand_status: [],
    absence_types: null,
    in_out_office: null,
    with_inactive_cp: null,
    departments: [],
    comment: null,

    start_date: null,
    end_date: null,
    statues: [],
    types: [],
    cps: [],
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
  summaryAbsenceRequests;
  loadingSelect = {};
  id_entite;


  constructor(public listService: ListsService,
              private activitiesService: ActivitiesService,
              private mainStore: MainStore,
              private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    this.getFilters();
    this.getAll();
  }

  resetFilters() {
    this.filter = {
      personals: [],
      member_ships: [],
      cps: [],
      sort_choices: [],
      business_units: [],
      departments: [],
      types: [],
      business_lines: [],
      adv_managers: [],
      direction_ops: [],
      clients: [],
      demand_status: [],
      in_out_office: null,
      with_inactive_cp: null,
      comment: null,
      start_date: null,
      end_date: null,
      absence_types: null,
      statues: []
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



    } catch (e) {
      console.log('error filter PROFIT_CENTER', e);
    }
  }

  filterChanged() {
    this.getAll();
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

  async getAll(){
    try{
      let params = this.formatParams();
      this.loadingData = true;
      const res = await this.activitiesService.getSummaryAbsenceRequest(params).toPromise();
      this.summaryAbsenceRequests = res.data;
      console.log('this.absenceRequests ', this.summaryAbsenceRequests );
    }catch (e) {
      console.log('err getAllAbsenceRequest', e);
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Une erreur est survenue lors de la récupération de données',  sticky: false});
    }finally {
      console.log('this.getSummaryAbsenceRequest ', this.loadingData );
      this.loadingData = false;
      console.log('after this.getSummaryAbsenceRequest ', this.loadingData );
    }
  }

  formatParams(){
    const params: any = {
      list_type: 'validation' //['general','validation','my_history']
    };
    Object.keys(this.filter).forEach(key => {
      if(Array.isArray(this.filter[key])){
        if(this.filter[key]?.length>0){
          params[key] = this.filter[key];
        }
      } else{
        if(this.filter[key] !== false && this.filter[key] !== null ){
          if(['date_start', 'date_end'].includes(key)){
            params[key] = this.filter[key] && isMoment(moment(this.filter[key], MY_CUSTOM_DATETIME_FORMATS.supportedFormats)) ? moment(this.filter[key], MY_CUSTOM_DATETIME_FORMATS.supportedFormats)?.format('YYYY-MM-DD'): null;
          }else{
            params[key] = this.filter[key];
          }
        }
      }
    });
    return params;
  }
}
