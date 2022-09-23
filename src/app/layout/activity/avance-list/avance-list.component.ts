import { Component, OnInit } from '@angular/core';
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {ActivitiesService} from "@services/activities.service";
import {MessageService} from "primeng/api";
import {isMoment} from "moment";
import * as moment from "moment";
import {MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";
import * as FileSaver from 'file-saver';
import {UserStore} from "@store/user.store";
import Swal from "sweetalert2";
import {$userProfiles} from "@shared/Objects/sharedObjects";
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
  loadingSelect = {

  };
  id_entite;
  $userProfiles = $userProfiles;

  constructor(public listService: ListsService,
              public mainStore: MainStore,
              private activitiesService: ActivitiesService,
              private messageService: MessageService,
              public userStore: UserStore,
              ) { }

  async ngOnInit() {
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    // try{ this.avance_types = await this.listService.getAll(this.listService.list.ADVANCE_COST).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    // try{ this.avance_status = await this.listService.getAll(this.listService.list.STATUS, this.listService.list.ADVANCE_COST).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    // try{ this.state_advance_costs = await this.listService.getAll(this.listService.list.STATUS, this.listService.list.STATE_ADVANCE_COST).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    // try{ this.personals = await this.listService.getPersonalsByCpId({entity_id: id_entite}).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    // try{ this.profit_centers = await this.listService.getAll(this.listService.list.PROFIT_CENTER, {id:  id_entite}).toPromise();} catch (e) {console.log('error filter PROFIT_CENTER', e);}

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
      console.log('anass this.advanceCosts ', this.advanceCosts );
    }catch (e) {
      console.log('err getAllAdvanceCosts', e);
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Une erreur est survenue lors de la récupération de la list des avances de frais',  sticky: false});
    }finally {
      console.log('anass this.loadingAdvanceCosts ', this.loadingAdvanceCosts );
      this.loadingAdvanceCosts = false;
      console.log('anass after this.loadingAdvanceCosts ', this.loadingAdvanceCosts );
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

  async noPay(item, popOver) {
      const params = {
        never_paid:  1,
        advance_cost_id: item.id,
        personal_id: item.personal_id,
      }
      Swal.fire({
        title: 'Êtes vous sûr?',
        text: "Voulez-vous vraiment vraiment valider cette demande de paiement en tanq que 'Jamais payé'?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#59a6d4',
        cancelButtonColor: '#f3533b',
        confirmButtonText: 'Oui, ne pas payer',
        cancelButtonText: 'Annuler',
        heightAuto: false
      }).then(async (result) => {
        if (result.value) {
          try {
            const res = await this.activitiesService.addPayment(params).toPromise();
            console.log('res', res);
              this.messageService.add({
                severity: 'success',
                summary: 'Opération réussie',
                detail: "Demande de paiement enregistré en tanq que 'Jamais payé' avec succès",
                sticky: false,
              });
              popOver.close();
              this.getAllAdvanceCosts();
          } catch (error) {
            console.log('errorMessage', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Echec!',
              detail: "Impossible de valider cette demande de paiement en tanq que 'Jamais payé'",
              sticky: false});
          }
        }
      });
  }


  async createPayment(item, popOver) {
    if(item.never_paid){
      this.noPay(item, popOver);
    }else{
      if(!item.amount_paid){
        this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Le montant est obligatoire',  sticky: false});
        return;
      }
      const params = {
        advance_cost_id: item.id,
        personal_id: item.personal_id,
        bank_id: item.bank_id,
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

  deleteAvanceFrais(id) {
    Swal.fire({
      title: 'Êtes vous sûr?',
      text: 'Voulez-vous vraiment supprimer cette demande d\'avance de frais?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#59a6d4',
      cancelButtonColor: '#f3533b',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      heightAuto: false
    }).then(async (result) => {
      if (result.value) {
        try {
          const res = await this.activitiesService.deleteAvanceFrais({id}).toPromise();
          console.log('res', res);
          if ( res?.result?.data) {
            this.messageService.add({
              severity: 'success',
              summary: 'Opération réussie',
              detail: 'Demande d\'avance de frais supprimé avec succès',
              sticky: false,
            });
            this.getAllAdvanceCosts();
          } else {
            throw new Error();
          }
        } catch (error) {
          console.log('errorMessage', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Echec!',
            detail: 'Impossible de supprimer cette demande d\'avance de frais pour le moment',
            sticky: false});
        }
      }
    });
  }
}
/*
La liste des utilisateurs
   (avec les champs Nom, prénom, email, rôle, entité signataire, grade et administration module) ;


La liste des « associé » (pour MAJ des listes déroulantes lettres de mission et rapport) ;


La liste des « Responsable de mission » (pour MAJ des listes déroulantes lettres de mission et rapport) ;

La liste des fichiers (nom, descriptions, créateur, date, type d’audience) intégrés dans les modules Tools,  tutos & présentations
 */
