import {Component, OnDestroy, OnInit} from '@angular/core';
import { UserService } from '@services/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {TranslateService} from '@ngx-translate/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserInfoFormComponent} from "@layout/users/user-info-form/user-info-form.component";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {MessageService} from "primeng/api";
import {ModalAddSortieComponent} from "@layout/users/modal-add-sortie/modal-add-sortie.component";
import {ModalAddEntreeComponent} from "@layout/users/modal-add-entree/modal-add-entree.component";
import {ModalAddEntretienComponent} from "@layout/users/modal-add-entretien/modal-add-entretien.component";
import {ModalAddVisiteMedicalComponent} from "@layout/users/modal-add-visite-medical/modal-add-visite-medical.component";
import {User} from "@app/core/entities";
import {PersonalService} from "@services/personal.service";
import {Personal} from "@entities/personal.entity";
import {ProfileAdvancedFormComponent} from "@layout/users/profile-advanced-form/profile-advanced-form.component";
import {formatDateForBackend} from "@shared/Utils/SharedClasses";


@Component({
  selector: 'app-list-users',
  templateUrl: './list-personels.component.html',
  styleUrls: ['./list-personels.component.scss']
})
export class ListPersonelsComponent implements OnInit, OnDestroy {

  listItems: Array<Partial<Personal>> = [];
  keyword = '';
  searchSubscription: Subscription;
  $roles = $userRoles;
  showFilters = false;
  pagination: any = {
    page: 1,
    total: 10,
    pageSize: 10,
  };
  profiles = [];
  STEPS = {
    entree: 0,
    periode_essai: 1,
    entretien: 2,
    visite_medicale: 3,
    sortie: 4,
  }

  filter = {
    keyword: '',
    page: 1,
    limit: 10,

    entities:[],
    sieges:[],
    contrats:[],
    status:[]
  }
  loadingData: boolean;
  type;
  sectionName;
  personnalFilters;
  actions;
  model_type;
  _allActions;

  id_entite = null;
  entities = [];
  sieges = [];
  contrats = [];
  status = [];
  loadingSelect = {};

  constructor(
              private personelService: PersonalService,
              private userService: UserService,
              private translate: TranslateService,
              private modalService: NgbModal,
              private messageService: MessageService,
              public mainStore: MainStore,
              public listService: ListsService,
              private route: ActivatedRoute,
              private router: Router) {

    this.route.queryParams.subscribe((params: any) => {
      console.log('params', params);
      const filters = Object.keys(this.filter).filter(item => !['keyword', 'page', 'limit'].includes(item));
      filters.forEach(filter => {
        if(params[filter]){
          if(Array.isArray(params[filter])){
            this.filter[filter] = params[filter].map(item => +item); // Filers arrays
          }else{
              this.filter[filter] = [+params[filter]]; // Filers ids
          }
        }
        if(this.filter[filter]?.length>0){
          this.showFilters = true;
        }
      });
      const page = params?.page ? +params.page : 1;
      const limit = params?.limit ? +params.limit : 10;
      this.filter = {...this.filter, page, limit };

      this.getUsers();
      console.log('params', this.filter);
    });

  }

  ngOnInit() {
    this.getUsers();
    this.getFilters();
  }

  async getFilters(){
    try{
      this.personnalFilters = await this.listService.getPersonalFilters().toPromise();
      this.entities = await this.listService.getAll('entity').toPromise();
      this.sieges = await this.listService.getAll('siege_type').toPromise();
      this.contrats = await this.listService.getAll('contrat_type').toPromise();
      this.status = await this.listService.getAll('status','PERSONAL').toPromise();
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

  getUsers(){
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    const params = {
      limit: this.filter.limit,
      page: this.filter.page
    }
    Object.keys(this.filter).forEach(key => {
      if(this.filter[key] !== null && this.filter[key] !== [] && (Array.isArray(this.filter[key]) ? this.filter[key].length > 0 : true)){
        params[key] = this.filter[key];
      }
    })
    if(!(this.listItems?.length > 0)){
      this.loadingData = true;
    }
    this.searchSubscription = this.personelService.getAllPersonalsAnnex(params).subscribe((result) => {
      console.log('result', result);
      this.listItems = result.data;
      console.log('this.listItems', this.listItems);
      this.pagination = {...this.pagination, page: result?.current_page, pageSize: result?.per_page, total: result?.total};
      this.filter.page = this.pagination.page;
      this.filter.limit = this.pagination.pageSize;
      this.router.navigate([], { queryParams: this.filter, queryParamsHandling: 'merge' });
    }, err =>{
      console.log('err getUsers', err);
      this.listItems = [];
      this.loadingData = false;
    }, ()=>{
      this.loadingData = false;
    })

  }

  openEditModal(item = null){
    if(this.modalService.hasOpenModals()){
      return;
    }
    const modalRef = this.modalService.open(ProfileAdvancedFormComponent, { size: 'sm' , centered: true, windowClass: 'myModal'});
    modalRef.result.then(result=>{
      console.log('closed', result);
      this.getUsers();
    }, reason => {
      console.log('closed');
    });
    if(item){
      modalRef.componentInstance.personal = item;
    }
  }

  gotoAddUser(){
    this.router.navigate(['users/add']);
  }

  goToUpdateUser(user){
    this.router.navigate(['users/basic/'+user.id]);
  }

  ngOnDestroy() {
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
  }

  resetFilters() {
    this.filter = Object.assign(this.filter, {
      entities:[],
      sieges:[],
      contrats:[],
      status:[]
    });
    console.log('resetFilters', this.filter)
    this.filterChanged();
    // showFilters = !showFilters;
  }


  changePagination() {
    this.pagination = { ...this.pagination, limit: this.pagination.pageSize, total: this.pagination.total };
    this.filter.page = this.pagination.page;
    this.filter.limit = this.pagination.pageSize;
    console.log('changePagination', this.filter);
    this.getUsers();
  }

  filterChanged() {
    console.log('filterChanged', this.filter)
    // add filters to query params merge
    this.filter.page = this.filter.page || 1;
    this.filter.limit = this.filter.limit || 10;
    this.router.navigate([], { queryParams: this.filter, queryParamsHandling: 'merge' });
    this.getUsers();
  }

  getRoleLabel(role){
    switch (role){
      case 'assistant': {
        return 'Assistant'
      }
      case 'user': {
        return 'Utilisateur'
      }
      case 'business_manager': {
        return 'Business manager'
      }
      case 'gp': {
        return 'GP'
      }
      case 'adv': {
        return 'ADV'
      }
      case 'accounting': {
        return 'Comptable'
      }
      case 'reporting': {
        return 'Reporting'
      }
    }
  }

  goToEdit(item) {
    this.router.navigate(['users/new/basic/'+item.id],
      { queryParams: this.route.snapshot.queryParams });
  }

  goToDetails(route: string, queryParams = {}) {
    this.router.navigate([route], { queryParams: {...queryParams, ...this.filter}, queryParamsHandling: 'merge' });
  }

}
