import {Component, OnDestroy, OnInit} from '@angular/core';
import { UserService } from '@services/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {TranslateService} from '@ngx-translate/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserInfoFormComponent} from "@layout/users/user-info-form/user-info-form.component";
import {ListsService} from "@services/lists.service";
import {Validators} from "@angular/forms";
import {MainStore} from "@store/mainStore.store";
import {MessageService} from "primeng/api";
import {ModalAddSortieComponent} from "@layout/users/modal-add-sortie/modal-add-sortie.component";
import {ModalAddEntreeComponent} from "@layout/users/modal-add-entree/modal-add-entree.component";
import {ModalAddEntretienComponent} from "@layout/users/modal-add-entretien/modal-add-entretien.component";
import {
  ModalAddVisiteMedicalComponent
} from "@layout/users/modal-add-visite-medical/modal-add-visite-medical.component";
import {PersonalService} from "@services/personal.service";
import {formatDateForBackend, getFormValidationErrors, markFormAsDirty} from "@shared/Utils/SharedClasses";
import {debounceTime, distinctUntilChanged, switchMap, tap} from "rxjs/operators";
import { saveAs } from 'file-saver';
import {ModalDocumentrhFilesComponent} from "@layout/users/modal-documentrh-files/modal-documentrh-files.component";
import {ModalAddPeriodEssaiComponent} from "@layout/users/modal-add-period-essai/modal-add-period-essai.component";
import {isMoment} from "moment";
import * as moment from "moment/moment";


@Component({
  selector: 'app-suivi-salaries',
  templateUrl: './suivi-salaries.component.html',
  styleUrls: ['./suivi-salaries.component.scss']
})
export class SuiviSalariesComponent implements OnInit, OnDestroy {

  listItems = [];
  keyword = '';
  searchSubscription: Subscription;
  $roles = $userRoles;
  showFilters = false;
  pagination: any = {
    page: 1,
    total: 10,
    pageSize: 10
  };

  profiles
  business_lines
  op_directions
  business_units
  departments
  profit_centers
  memberships
  roles
  facturation_stats
  states_to_complete
  matricule_stats
  user_stats
  personals

  /** nja filters */
  entities=[];
  sieges=[];
  contrats=[];
  status=[];
  actions_valid=[];
  actions_to_valid=[];
  loadingSelect = {};
  decisions=[];


  STEPS = {
    entree: 0,
    periode_essai: 1,
    entretien: 2,
    visite_medicale: 3,
    sortie: 4,
  }

  filter = {
    keyword: '',
    is_virtual: null,
    page: 1,
    limit: 10,
    is_blocked: null,
    to_be_completed: null,

    user_stats: null,
    personals: [],

    entities:[],
    sieges:[],
    contrats:[],
    status:[],
    actions_valid:[],
    actions_to_valid:[]
  }
  loadingData: boolean;
  type;
  sectionName;
  personnalFilters;
  actions;
  model_type;

  columns_sortie = [

  ];
  columns_entree;
  _allActions;

  medical_center_search =  (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap( (term) => {
          return this.listService.getAll(this.listService.list.MEDICAL_CENTER, {keyword: term});
        }
      )
    );
  constructor(private userService : UserService,
              private personalService : PersonalService,
              private translate: TranslateService,
              private modalService: NgbModal,
              private messageService: MessageService,
              public mainStore: MainStore,
              public listService: ListsService,
              private route: ActivatedRoute,
              private router: Router) {

    this.route.params.subscribe(params => {
      console.log('params', params);
      const {type} = params;
      switch (type){
        case 'general': {
          this.type = 'general';
          this.sectionName = 'Salariés'
          break;
        }
        case 'period_essai': {
          this.type = 'period_essai';
          this.model_type ='trial_period';
          this.sectionName = 'Suivi salariés - Périodes d\'essais'
          break;
        }
        case 'entree': {
          this.type = 'entree';
          this.sectionName = 'Suivi salariés - Entrées'
          this.model_type ='entrance';
          break;
        }
        case 'sortie': {
          this.type = 'sortie';
          this.sectionName = 'Suivi salariés - Sorties'
          this.model_type ='sortie';
          break;
        }
        case 'entretien': {
          this.type = 'entretien';
          this.model_type =null;
          this.sectionName = 'Suivi salariés - Entretiens'
          break;
        }
        case 'formation': {
          this.type = 'formation';
          this.sectionName = 'Suivi salariés - Formations'
          break;
        }
        case 'visite_medicale': {
          this.type = 'visite_medicale';
          this.model_type ='medical_visit';
          this.sectionName = 'Suivi salariés - Visites médicales'
          break;
        }
        default: {
          this.type = 'general';
        }
      }
      this.resetFilters()
      this.getListElements();
      this.getAction();
    });

    this.route.queryParams.subscribe((params: any) => {
      console.log('params', params);
      const filters = ['entities', 'sieges', 'contrats', 'status', 'actions_valid', 'actions_to_valid'];
      filters.forEach(filter => {
        if(params[filter]){
          if(Array.isArray(params[filter])){
            this.filter[filter] = params[filter].map(item => +item);
        }else{
            this.filter[filter] = [+params[filter]];}
        }
        if(this.filter[filter]?.length>0){
          this.showFilters = true;
        }
      });
      if(params?.profiles){
        // if(Array.isArray(params.profiles)){
        //   profiles = params.profiles.map(item => +item);
        // }else{
        //   profiles = [+params.profiles];
        // }
        // if(profiles?.length>0){
        //   this.filter.profiles = profiles;
        //   this.showFilters = true;
        // }
      }
      const page = params?.page ? +params.page : 1;
      const limit = params?.limit ? +params.limit : 10;
      this.filter = {...this.filter, page, limit };

      this.getListElements();
      console.log('params', this.filter);
    });

  }

  ngOnInit() {
    this.getListElements();
    this.getFilters();
  }


  async getFilters(){
    const id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    try{
      this.personnalFilters = await this.listService.getPersonalFilters().toPromise();
      console.log('this.filters', this.personnalFilters);
      this.business_lines = this.personnalFilters.business_lines;
      this.business_units = this.personnalFilters.business_units;
      this.departments = this.personnalFilters.departments;
      this.facturation_stats = this.personnalFilters.facturation_stats;
      this.matricule_stats = this.personnalFilters.matricule_stats;
      this.memberships = this.personnalFilters.memberships;
      this.op_directions = this.personnalFilters.op_directions;
      this.personals = this.personnalFilters.personals;
      this.profiles = this.personnalFilters.profiles;
      this.profit_centers = this.personnalFilters.profit_centers;
      this.roles = this.personnalFilters.roles;
      this.states_to_complete = this.personnalFilters.states_to_complete;

      this.entities = await this.listService.getAll('entity').toPromise();
      this.sieges = await this.listService.getAll('siege_type').toPromise();
      this.contrats = await this.listService.getAll('contrat_type').toPromise();
      this.status = await this.listService.getAll('status','PERSONAL').toPromise();
      this.decisions = await this.listService.getAll('status','decision_trail_period').toPromise();


    } catch (e) {
      console.log('error filter PROFIT_CENTER', e);
    }
  }

  async getFilterList(items, list_name, list_param?){

    try{
      this.loadingSelect[list_name] = true;
      let result =  await this.listService.getAll(list_name, list_param).toPromise();
      if(list_param == 'decision_trail_period')
        result.unshift({id:null,label:'En attente'})
      this[items] = result;

    } catch (e) {
      console.log('error filter', e);
    } finally {
      this.loadingSelect[list_name] = false;
    }

  }



  async getAction(){
    this._allActions = null;
    if(this.model_type)
      this._allActions = await this.userService.listActions({model_type:this.model_type}).toPromise();

    if(this.model_type != 'entrance' && this.model_type != 'sortie')
      return;
    const localstorage_entree = JSON.parse(localStorage.getItem("columns_"+this.model_type) || "[]");

    if(localstorage_entree?.length > 0){
      console.log('localstorage_entree :::',localstorage_entree)

      // check if localstorage's list is up to date to DB
      const _founded_new_column = this._allActions.filter(object1 => {
        return !localstorage_entree.some(object2 => {
          return object1.slug === object2.slug;
        });
      });
      _founded_new_column.forEach( (diff) => {
          diff.checked = true; //force display new colomn
      });
      const up_to_date_localstorage = [...localstorage_entree, ..._founded_new_column];
      console.log('diff::::',_founded_new_column)


      //check if there are an extra action which is deleted from DB and persists on localstorage
      const _overflowed_column = up_to_date_localstorage.filter(object1 => {
        return !this._allActions.some(object2 => {
          return object1.slug === object2.slug;
        });
      });
      //remove overflowed column from column's array
      for (let i = 0; i < up_to_date_localstorage.length; i++) {
        _overflowed_column.forEach( (column_to_supp) => {
          if(up_to_date_localstorage[i].id === column_to_supp.id){
            up_to_date_localstorage.splice(i,1);
          }
        });
      }
      this.columns_entree = up_to_date_localstorage;
    }else{

      // initialize columns from DB when no localstorage preferences
      this._allActions.forEach( (action) => {
          action.checked = true;
      });
      this.columns_entree = this._allActions;

    }

  }

  async markActionAsDone(id, is_done){
    let marked = await this.userService.markActionAsDone({id:id}).toPromise();
    if(marked)
      this.messageService.add({
        severity: 'success',
        summary: 'Parfait!',
        detail: 'L\'action a bien été marquée comme réalisée',
        sticky: false,
      });
  }

  getListElements(){
    this.listItems = [];
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    const params = {
      type: this.type,
      limit: this.pagination.pageSize,
    }
    Object.keys(this.filter).forEach(key => {
      if(this.filter[key] !== null && this.filter[key] !== [] && (Array.isArray(this.filter[key]) ? this.filter[key].length > 0 : true)){
        params[key] = this.filter[key];
      }
    })
    if(!(this.listItems?.length > 0)){
      this.loadingData = true;
    }
    this.searchSubscription = this.userService.getUsers(params).subscribe((result) => {
      this.listItems = result.data.data;
      this.pagination = { ...this.pagination, total: result?.data?.total };
    }, err =>{
      console.log('err getListElements', err);
      this.listItems = [];
      this.loadingData = false;
    }, ()=>{
      this.loadingData = false;
    })

  }

  openEditModal(type, item = null){
    if(this.modalService.hasOpenModals()){
      return;
    }
    let dynamicModal = null;
    switch (type){
      case 'general': {
        break;
      }
      case 'period_essai': {
        dynamicModal = ModalAddPeriodEssaiComponent;
        break;
      }
      case 'entree': {
        dynamicModal = ModalAddEntreeComponent;
        break;
      }
      case 'sortie': {
        dynamicModal = ModalAddSortieComponent;
        break;
      }
      case 'entretien': {
        dynamicModal = ModalAddEntretienComponent;
        break;
      }
      case 'formation': {
        // dynamicModal = ModalAddFormationComponent;
        break;
      }
      case 'visite_medicale': {
        dynamicModal = ModalAddVisiteMedicalComponent;
        break;
      }
    }
    const modalRef = this.modalService.open(dynamicModal, { size: 'sm' , centered: true, windowClass: 'myModal'});
    modalRef.result.then(result=>{
      console.log('closed', result);
      this.getListElements();
    }, reason => {
      console.log('closed');
    });
    if(item){
      modalRef.componentInstance.data = item;
    }
  }

  gotoAddUser(){
    this.router.navigate(['users/add']);
  }

  goToUpdateUser(user){
    if(user?.type_account?.length>0){
      this.router.navigate(['users/new/'+user.type_account], {queryParams: {step: 0, user_id: user.id}});
    }
  }

  ngOnDestroy() {
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
  }

  resetFilters() {
    this.filter = Object.assign(this.filter, {
      is_blocked: null,
      to_be_completed: null,

      roles: [],
      member_ships: [],
      profiles: [],
      profit_centers: [],

      business_lines: [],
      op_directions: [],
      business_units: [],
      departments: [],
      facturation_stats: [],
      stats_to_complete: [],
      matricule_stats: [],
      personals: [],
      is_virtual: null,
      user_stats: null,

      entities:[],
      sieges:[],
      contrats:[],
      status:[],
      actions_valid:[],
      actions_to_valid:[],
      decisions:[],
      centre:null,
      types:[]
    });
    console.log('resetFilters', this.filter)
    this.getListElements();
    // showFilters = !showFilters;
  }

  openModal(idUser) {
    if(this.modalService.hasOpenModals()){
      this.modalService.dismissAll();
    }
    let size = 'xl';
    let title = 'collaborateur';
    let type ='collab';

    const modalRef = this.modalService.open(UserInfoFormComponent, { size: size , centered: true, windowClass: 'myModal'});
    modalRef.result.then(result=>{
      console.log('closed', result);
      // if(result === 'QUERY'){
      // }
    }, reason => {
      console.log('closed');
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.idUser = idUser;
  }

  changePagination() {
    this.pagination = { ...this.pagination, pageSize: this.pagination.pageSize, total: this.pagination.total };
    this.filter.page = this.pagination.page;
    this.filter.limit = this.pagination.pageSize;
    this.getListElements();
  }


  filterChanged() {
    console.log('resetFilters', this.filter)
    // add filters to query params merge
    this.filter.page = 1;
    this.filter.limit = 10;
    this.router.navigate([], { queryParams: this.filter, queryParamsHandling: 'merge' });
    this.getListElements();
  }


  onCheckChange($event) {
    localStorage.setItem("columns_"+this.model_type, JSON.stringify(this.columns_entree));
  }

  ischecked(id) {
    return this.columns_entree.find(item => item.id === id)?.checked;
  }

  selectAllColumns() {
    let select = false;
    if(this.columns_entree.find(item => item.checked === false)){
      select = true
    }

    this.columns_entree.forEach((column) => {
      column.checked = select;
    });
    localStorage.setItem("columns_"+this.model_type, JSON.stringify(this.columns_entree));
  }

  getActiveColumns(column) {
    return this[column]?.filter((column) => column.checked);
  }

  async updateDateInterview(id, effective_date: any) {
    const params = {
      id,
      effective_date: formatDateForBackend(effective_date)
    }
    try{
      const result = await this.personalService.updateEntretien(params).toPromise();
      this.getListElements();
      if(result){
        this.messageService.add({
          severity: 'success',
          summary: 'Parfait!',
          detail: 'La date a bien été modifiée',
          sticky: false,
        });
      }
    }catch (err){
      console.log('err updateDateInterview', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur!',
        detail: 'Une erreur est survenue, veillez réessayer plus tard',
        sticky: false,
      })
    }

  }

  async updateVM(input_name: string, id, value) {
    const params = {
      id,
      [input_name]: input_name === 'scheduled_date' ? formatDateForBackend(value): value
    }
    try{
      const result = await this.personalService.updateVM(params).toPromise();
      this.getListElements();
      if(result){
        this.messageService.add({
          severity: 'success',
          summary: 'Parfait!',
          detail: 'La date a bien été modifiée',
          sticky: false,
        });
      }
    }catch (err){
      console.log('err updateDateInterview', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur!',
        detail: 'Une erreur est survenue, veillez réessayer plus tard',
        sticky: false,
      })
    }finally {
    }
  }

  openVmForEditting(input: string, vm) {
    if(input === 'centre'){
      vm.tmp_medical_centre = vm.centre;
      vm.is_editting_mc = true
    }
  }

  async export(){
    try{
      const params = {
        type: this.type
      }
      Object.keys(this.filter).forEach(key => {
        if(this.filter[key] !== null && this.filter[key] !== []){
          params[key] = this.filter[key];
        }
      })
      let entity = null;
      switch (this.type){
        case 'period_essai': {
          entity = 'personal_trial_period';
          break;
        }
        case 'entree': {
          entity = 'entrances';
          break;
        }
        case 'sortie': {
          entity = 'exit';
          break;
        }
        case 'entretien': {
          entity = 'interview';
          break;
        }
        case 'formation': {
          entity = 'personal_formation';
          break;
        }
        case 'visite_medicale': {
          entity = 'medical_visit';
          break;
        }
      }
      if(!entity){
        return;
      }
      const res = await this.personalService.export(params, entity).toPromise();
      console.log('res export', res);
      saveAs(res.body, `export_${entity}.xlsx`);
    }catch (e){

    }finally {

    }
  }

  openDocumentRHFilesModal(document?){
    const modalRef = this.modalService.open(ModalDocumentrhFilesComponent, { size: 'lg' , centered: true, windowClass: 'myModal'});
    modalRef.result.then(result=>{
      console.log('closed result', result);
    }, reason => {
      console.log('closed reason', reason);
    });
    if(document){
      modalRef.componentInstance.files = document.attachments;
      modalRef.componentInstance.title = 'Télécharger les documents';
    }
  }

  async updatePE(item: any, attrToUpdate: string) {
    try {
      const params = {
        id: item.id,
        [attrToUpdate]: item[attrToUpdate]
      }
      const res = await this.personalService.createOrUpdateTrialPeriod(params).toPromise();
      this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Période d\'essai modifiée avec succès'});
      this.getListElements();
    }catch (e) {
      this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la modification de la période d\'essai'});
    }
  }


  goToDetails(route: string, queryParams = {}) {
    this.router.navigate([route], { queryParams: {...queryParams, ...this.filter}, queryParamsHandling: 'merge' });
  }
}
