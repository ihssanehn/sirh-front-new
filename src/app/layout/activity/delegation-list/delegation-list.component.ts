import { Component, OnInit } from '@angular/core';
import frLocale from "date-fns/locale/fr";
import {Subscription} from "rxjs";
import {ListsService} from "@services/lists.service";
import {ActivitiesService} from "@services/activities.service";
import * as _moment from "moment";
import {Router} from "@angular/router";
import {isMoment} from "moment/moment";
import {MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";
import {MessageService} from "primeng/api";
import {Delegation} from "@entities/delegation";
import {MainStore} from "@store/mainStore.store";

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-delegation-list',
  templateUrl: './delegation-list.component.html',
  styleUrls: ['./delegation-list.component.scss']
})
export class DelegationListComponent implements OnInit {
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
    personal_id: null,
    start_date: null,
    end_date: null
  }

  personnalFilters;
  loadingData = false;
  searchSubscription: Subscription;

  submittingPrint = false;
  submittingExport = false;
  submittingDetailedExport = false;

  delegations: Array<Delegation> = [];
  loadingSelect = {};
  id_entite;
  loading: boolean;

  constructor(public listService: ListsService,
              private activitiesService: ActivitiesService,
              private messageService: MessageService,
              private router: Router,
              private mainStore: MainStore,
  ) {
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

  }

  ngOnInit(): void {
    this.getFilters();
    this.getAll();
  }

  resetFilters() {
    this.filter = {
      personal_id: [],
      start_date: null,
      end_date: null
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
      this.personals = this.personnalFilters.personal_id;

    } catch (e) {
      console.log('error filter PROFIT_CENTER', e);
    }
  }

  filterChanged() {
    this.getAll();
  }

  formatParams(){
    const params: any = {};
    Object.keys(this.filter).forEach(key => {
      if(Array.isArray(this.filter[key])){
        if(this.filter[key]?.length>0){
          params[key] = this.filter[key];
        }
      } else{
        if(this.filter[key] !== false && this.filter[key] !== null ){
          if(['start_date', 'end_date'].includes(key)){
            params[key] = this.filter[key] && isMoment(moment(this.filter[key], MY_CUSTOM_DATETIME_FORMATS.supportedFormats)) ? moment(this.filter[key], MY_CUSTOM_DATETIME_FORMATS.supportedFormats)?.format('YYYY-MM-DD'): null;
          }else{
            params[key] = this.filter[key];
          }
        }
      }
    });
    return params;
  }

  async getAll(){
    try{
      let params = this.formatParams();
      this.loading = true;
      const res = await this.activitiesService.getAllDelegation(params).toPromise();
      this.delegations = res.data;
    }catch (e) {
      console.log('err getAllAdvanceCosts', e);
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Une erreur est survenue lors de la récupération de la list des avances de frais',  sticky: false});
    }finally {
      this.loading = false;
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

  print(){

  }

  export(){

  }

  detailedExport(){

  }

  goToCreate() {
    this.router.navigate(['/activites/delegation/creation']);
  }
}
