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
    per_page: 10,
    profiles: null
  }
  loadingData: boolean;
  type;
  sectionName;
  personnalFilters;
  actions;
  model_type;
  _allActions;
  id_entite = null;

  constructor(
              private personelService: PersonalService,
              private translate: TranslateService,
              private modalService: NgbModal,
              private messageService: MessageService,
              public mainStore: MainStore,
              private listService: ListsService,
              private route: ActivatedRoute,
              private router: Router) {

    this.route.queryParams.subscribe((params: any) => {
      console.log('params', params);
      let profiles;
      if(params?.profiles){
        if(Array.isArray(params.profiles)){
          profiles = params.profiles.map(item => +item);
        }else{
          profiles = [+params.profiles];
        }
        console.log('profiles', profiles);
        if(profiles?.length>0){
          this.filter.profiles = profiles;
          this.showFilters = true;
        }
      }
      const page = params?.page ? +params.page : 1;
      const per_page = params?.per_page ? +params.per_page : 10;
      this.filter = {...this.filter, page, per_page };
      this.getUsers();
      console.log('params', this.filter);
    });
  }

  ngOnInit() {
    this.getUsers();
    this.getFilters();
  }


  async getFilters(){
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    try{
       const personnalFilters = await this.listService.getPersonalFilters().toPromise();
       console.log('this.filters', this.personnalFilters);
       this.profiles = personnalFilters.profiles;
    } catch (e) {
      console.log('error filter PROFIT_CENTER', e);
    }
  }

  getUsers(){
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    const params = {
      type: this.type,
      limit: this.filter.per_page
    }
    Object.keys(this.filter).forEach(key => {
      if(this.filter[key] !== null && this.filter[key] !== [] && (Array.isArray(this.filter[key]) ? this.filter[key].length > 0 : true)){
        params[key] = this.filter[key];
      }
    })
    this.loadingData = true;
    this.searchSubscription = this.personelService.getAllPersonals().subscribe((result) => {
      console.log('result', result);
      this.listItems = result.data;
      console.log('this.listItems', this.listItems);
      this.pagination = {...this.pagination, page: result?.data?.current_page, pageSize: result?.data?.per_page, total: result?.data?.total};
      this.filter.page = this.pagination.page;
      this.filter.per_page = this.pagination.pageSize;
      this.router.navigate([], { queryParams: this.filter, queryParamsHandling: 'merge' });
    }, err =>{
      console.log('err getUsers', err);
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
      this.getUsers();
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
    this.router.navigate(['users/basic/'+user.id]);
  }

  ngOnDestroy() {
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
  }

  resetFilters() {
    this.filter = Object.assign(this.filter, {
      // is_blocked: null,
      // to_be_completed: null,

      // roles: [],
      profiles: [],
      // profit_centers: [],
    });

    // this.getUsers();
    // showFilters = !showFilters;
  }


  changePagination() {
    this.pagination = { ...this.pagination, per_page: this.pagination.pageSize, total: this.pagination.total };
    this.filter.page = this.pagination.page;
    this.filter.per_page = this.pagination.pageSize;
    this.getUsers();
  }

  filterChanged() {

    console.log('resetFilters', this.filter)
    // add filters to query params merge
    this.filter.page = 1;
    this.filter.per_page = 10;
    this.router.navigate([], { queryParams: this.filter, queryParamsHandling: 'merge' });
    // this.getUsers();
  }

  onCheckChange($event) {

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

  goToDetails(s: string, param2: { user_id: any; step: number }) {

  }
}
