import { Component, OnInit } from '@angular/core';
import {isMoment} from "moment/moment";
import {CustomDateTimeIntl, MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";
import {ActivitiesService} from "@services/activities.service";
import {MessageService} from "primeng/api";
import * as moment from "moment";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {OwlDateTimeIntl} from "ng-pick-datetime";

@Component({
  selector: 'app-conge-history',
  templateUrl: './conge-history.component.html',
  styleUrls: ['./conge-history.component.scss'],
  providers: [ {provide: OwlDateTimeIntl, useClass: CustomDateTimeIntl}]
})
export class CongeHistoryComponent implements OnInit {
  status = [];
  avance_types = [];
  submittingExport = false;
  filter = {
    personals: [],
    range: null,
    start_date: null,
    end_date: null,
    statues: [],
    types: [],
    cps: [],
  }
  formInputs = {
    range: 'range',
    status: 'status',
    avance: 'avance'
  };
  errorLoadData: boolean;
  loadingData: boolean;
  summaryAbsenceRequests;
  statues = [];
  types = [];
  loadingSelect = {};
  id_entite;
  constructor(
    private activitiesService: ActivitiesService,
    private messageService: MessageService,
    private mainStore: MainStore,
    public listService: ListsService,
  ) { }

  ngOnInit(): void {
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
    this.getAll();
  }

  export() {

  }

  clearDateInput(date: any) {

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

  filterChanged() {
    this.getAll();
  }
}
