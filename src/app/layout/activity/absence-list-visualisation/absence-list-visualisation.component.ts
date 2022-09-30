import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedClasses} from "@shared/Utils/SharedClasses";
import frLocale from "date-fns/locale/fr";
import {Activity} from "@app/core/entities";
import {Subscription} from "rxjs";
import {ListsService} from "@services/lists.service";
import {ActivitiesService} from "@services/activities.service";
import * as _moment from "moment";
import {isMoment} from "moment/moment";
import {MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";
import {MessageService} from "primeng/api";
import {AnsenceRequest} from "@entities/ansenceRequest";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalSoldeAbsenceComponent} from "@layout/activity/modal-solde-absence/modal-solde-absence.component";
import {MainStore} from "@store/mainStore.store";

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
  statues = [];
  types = [];

  exportPrint = {
    activity_record: null,
    expense_sheet: null,
  }

  filter = {
    personals: [],
    member_ships: [],
    cps: [],
    sort_choices: [],
    business_units: [],
    types: [],
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
    comment: null,
    start_date: null,
    end_date: null,
    statues: null,
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
  searchSubscription: Subscription;

  submittingPrint = false;
  submittingExport = false;
  submittingDetailedExport = false;
  stats: any;
  absenceRequests: Array<AnsenceRequest> = [];
  loadingSelect = {};
  id_entite;

  constructor(public listService: ListsService,
              private activitiesService: ActivitiesService,
              private messageService: MessageService,
              private mainStore: MainStore,
              private modalService: NgbModal
  ) {

  }

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
      validation_stats: [],
      societe_origins: [],
      types: [],
      business_lines: [],
      adv_managers: [],
      direction_ops: [],
      clients: [],
      month: null,
      information_pending: null,
      has_internal_billing_admin: null,
      in_out_office: null,
      with_inactive_cp: null,
      comment: null,
      start_date: null,
      end_date: null,
      statues: [],
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

  async getAll(){
    try{
      let params = this.formatParams();
      this.loadingData = true;
      const res = await this.activitiesService.getAllAbsenceRequest(params).toPromise();
      this.absenceRequests = res.data;
      console.log('this.absenceRequests ', this.absenceRequests );
      // this.openModal(this.absenceRequests[0]);
    }catch (e) {
      console.log('err getAllAbsenceRequest', e);
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Une erreur est survenue lors de la récupération de la list des demandes d\absence',  sticky: false});
    }finally {
      console.log('this.getAllAbsenceRequest ', this.loadingData );
      this.loadingData = false;
      console.log('after this.getAllAbsenceRequest ', this.loadingData );
    }
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

  delete(id) {

  }

  openModal(absence_request) {
    if(this.modalService.hasOpenModals()){
      this.modalService.dismissAll();
    }
    let size = 'lg';


    const modalRef = this.modalService.open(ModalSoldeAbsenceComponent, { size: size , centered: true, windowClass: 'myModal'});
    modalRef.result.then(result=>{
      console.log('closed', result);
    }, reason => {
      console.log('closed');
    });
    modalRef.componentInstance.absenceRequest = absence_request;
  }
}
