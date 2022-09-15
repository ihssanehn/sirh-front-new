import { Component, OnInit } from '@angular/core';
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {ActivitiesService} from "@services/activities.service";
import {MessageService} from "primeng/api";
import {isMoment} from "moment";
import * as moment from "moment";
import {MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-avance-list',
  templateUrl: './avance-list.component.html',
  styleUrls: ['./avance-list.component.scss']
})
export class AvanceListComponent implements OnInit {
  submittingExport: boolean;
  repayment_status = [];
  avance_types = [];
  avance_status = [];
  status = [];
  personals = [];
  state_advance_costs = [];
  profit_centers = [];
  avance_frais = [1, 2, 3, 4];
  filter = {
    date_start: null,
    date_end: null,
    personals: [],
    statues: null,
    cps: [],
    types: [],
    states: [],
    waiting_my_validating: null
  }
  loadingSummaryAdvanceCosts: boolean;
  loadingAdvanceCosts: boolean;

  summaryAdvanceCosts = [];
  advanceCosts = [];
  submittingValidation: boolean;
  submittingRejection: boolean;
  payment_types = [
    {
      code: 'manual_transfer',
      label: 'Virement manuel'
    },
    {
      code: 'interbank_transfer',
      label: 'Virement interbancaire'
    },
  ];
  submittingPayment = false;

  constructor(private listService: ListsService,
              public mainStore: MainStore,
              private activitiesService: ActivitiesService,
              private messageService: MessageService,
              ) { }

  async ngOnInit() {
    const id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    try{ this.avance_types = await this.listService.getAll(this.listService.list.ADVANCE_COST).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.avance_status = await this.listService.getAll(this.listService.list.STATUS, this.listService.list.ADVANCE_COST).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.state_advance_costs = await this.listService.getAll(this.listService.list.STATUS, this.listService.list.STATE_ADVANCE_COST).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.personals = await this.listService.getPersonalsByCpId({entity_id: id_entite}).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.profit_centers = await this.listService.getAll(this.listService.list.PROFIT_CENTER, {id:  id_entite}).toPromise();} catch (e) {console.log('error filter PROFIT_CENTER', e);}

    this.getAllAdvanceCosts();
    this.getSummaryAdvanceCosts();
  }

  async  export() {
    try{
      // const id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

      let params = this.formatParams();
      this.loadingSummaryAdvanceCosts = true;
      const res = await this.activitiesService.exportAdvanceCost(params).toPromise();
      const blob = new Blob([res.body]);
      FileSaver.saveAs(blob, 'export_advance_cost.xlsx');
    }catch (e) {
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Une erreur est survenue lors de la récupération des données du tableau de synthèse',  sticky: false});

    }finally {
      this.loadingSummaryAdvanceCosts = false;
    }
  }

  getAll() {

  }

  async getSummaryAdvanceCosts(){
    try{
      let params = this.formatParams();
      this.loadingSummaryAdvanceCosts = true;
      const res = await this.activitiesService.getSummaryAdvanceCosts(params).toPromise();
      this.summaryAdvanceCosts = res.data;
    }catch (e) {
      console.log('err getSummaryAdvanceCosts', e);
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Une erreur est survenue lors de la récupération des données du tableau de synthèse',  sticky: false});

    }finally {
      this.loadingSummaryAdvanceCosts = false;
    }
  }

  //manager_name: "SIRH Manager-6"
  //personal_name: "SIRH Consultant-18"
  //type_name: "Avance De Frais"
  // amount: 24
  // date: "2022-09-01T23:00:00.000Z"
  // status_color: "#ff8001"
  // status_name: "En attente"


  // comment_admin: null
  // comment_manager: null
  // created_at: "2022-09-05T10:10:37.000Z"
  // history_advance_cost: [,…]
  // id: 9
  // manager_id: 6
  // manager_name: "SIRH Manager-6"
  // motif: "test 223"
  // personal_id: 28
  // type_id: 36
  // updated_at: "2022-09-05T10:26:54.000Z"

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
    if(this.filter.statues){
      params.statues = [this.filter.statues];
    }
    return params;
  }

  async getAllAdvanceCosts(){
    try{
      let params = this.formatParams();
      this.loadingAdvanceCosts = true;
      const res = await this.activitiesService.getAllAdvanceCosts(params).toPromise();
      this.advanceCosts = res.data;
    }catch (e) {
      console.log('err getAllAdvanceCosts', e);
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Une erreur est survenue lors de la récupération de la list des avances de frais',  sticky: false});
    }finally {
      this.loadingAdvanceCosts = false;
    }
  }

  filterChanged() {
    this.getSummaryAdvanceCosts();
    this.getAllAdvanceCosts();
  }

  async validateOrRefuseAdvanceCost(item, status) {
    let status_name = status ? 'valide': 'refusee';

    try{
      if(status){
        item.submittingValidation = true;
      }else{
        item.submittingRejection = true;
      }

      const params = {
        id: item.id,
        status_name,
        comment: item.validation_comment,
        send_mail: item.validation_send_email
      }

      const res = await this.activitiesService.validateOrRefuseAdvanceCost(params).toPromise();
      // item.history_advance_cost = res.data?.history_advance_cost;
      // item.comment_manager = res.data?.comment_manager;
      // item.comment_admin = res.data?.comment_admin;
      // item.status_color = res.data?.status_color;
      // item.status_name = res.data?.status_name;
      this.getAllAdvanceCosts();
      this.messageService.add({
        severity: 'success',
        summary: 'Parfait!',
        detail: 'Demande validée avec succès',
        sticky: false,
      });
    }catch (e){
      console.log('err createDemand', e);
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Une erreur est survenue lors de la validation de la demande',  sticky: false});
    }finally {
      item.submittingValidation = false;
      item.submittingRejection = false;
    }
  }

  async createPayment(item, popOver) {
    if(!item.amount_paid){
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Le montant est obligatoire',  sticky: false});
    return;
    }
    const params = {
      advance_cost_id: item.id,
      personal_id: item.personal_id,
      bank_id: item.bank_id,
      never_paid: item.never_paid ? 1: 0,
      type: item.type_payment,
      amount_paid: item.amount_paid,
      payment_date: item.payment_date && isMoment(moment(item.payment_date)) ? moment(item.payment_date)?.format('YYYY-MM-DD'): null,
      remark: item.remark,
    }
    console.log('createPayment', params);
    try{
      this.submittingPayment = true;
      const res = await this.activitiesService.addPayment(params).toPromise();
      this.getAllAdvanceCosts();
      this.messageService.add({
        severity: 'success',
        summary: 'Parfait!',
        detail: 'Payment créé avec succès',
        sticky: false,
      });
      popOver.close();
    }catch (e){
      console.log('err createDemand', e);
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Une erreur est survenue lors de la création du payment',  sticky: false});
    }finally {
      this.submittingPayment = false;
    }
  }

  getPaymentType(type) {
    const type_payment = this.payment_types.find(item => item.code === type);
    return type_payment ? type_payment.label : null;
  }

  resetFilters() {
    this.filter = {
      date_start: null,
      date_end: null,
      personals: [],
      statues: null,
      cps: [],
      types: [],
      states: [],
      waiting_my_validating: null
    }
    this.filterChanged();
  }
}
/*
La liste des utilisateurs
   (avec les champs Nom, prénom, email, rôle, entité signataire, grade et administration module) ;


La liste des « associé » (pour MAJ des listes déroulantes lettres de mission et rapport) ;


La liste des « Responsable de mission » (pour MAJ des listes déroulantes lettres de mission et rapport) ;

La liste des fichiers (nom, descriptions, créateur, date, type d’audience) intégrés dans les modules Tools,  tutos & présentations
 */
