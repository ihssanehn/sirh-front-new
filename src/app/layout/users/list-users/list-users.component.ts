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
import {PersonalService} from "@services/personal.service";
import {formatDateForBackend} from "@shared/Utils/SharedClasses";
import {debounceTime, distinctUntilChanged, switchMap, tap} from "rxjs/operators";
import { saveAs } from 'file-saver';
import {User} from "@app/core/entities";


@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, OnDestroy {

  listItems: Array<Partial<User>> = [];
  keyword = '';
  searchSubscription: Subscription;
  $roles = $userRoles;
  showFilters = false;
  pagination: any = {
    page: 1,
    total: 10,
    limit: 10
  };
  profiles
  roles

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

  constructor(private userService : UserService,
              private translate: TranslateService,
              private modalService: NgbModal,
              private messageService: MessageService,
              public mainStore: MainStore,
              private listService: ListsService,
              private route: ActivatedRoute,
              private router: Router) {


  }

  ngOnInit() {
    this.getUsers();
    this.getFilters();
  }


  async getFilters(){
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    try{
       this.personnalFilters = await this.listService.getPersonalFilters().toPromise();
       console.log('this.filters', this.personnalFilters);
       this.profiles = this.personnalFilters.profiles;
       this.roles = this.personnalFilters.roles;
    } catch (e) {
      console.log('error filter PROFIT_CENTER', e);
    }
  }

  getUsers(){
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    const params = {
      type: this.type
    }
    Object.keys(this.filter).forEach(key => {
      if(this.filter[key] !== null && this.filter[key] !== []){
        params[key] = this.filter[key];
      }
    })
    this.loadingData = true;
    this.searchSubscription = this.userService.getListUsers(params).subscribe((result) => {
      this.listItems = result.data.data;
      console.log('this.listItems', this.listItems);
      this.pagination = { ...this.pagination, total: result?.data?.total };
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
      is_blocked: null,
      to_be_completed: null,

      roles: [],
      member_ships: [],
      profiles: [],
      profit_centers: [],

    });
    console.log('resetFilters', this.filter)
    this.getUsers();
    // showFilters = !showFilters;
  }


  changePagination() {
    this.pagination = { ...this.pagination, limit: this.pagination.limit, total: this.pagination.total };
    this.filter.page = this.pagination.page;
    this.filter.limit = this.pagination.limit;
    this.getUsers();
  }

  filterChanged() {
    this.getUsers();
  }

  onCheckChange($event) {

  }

}
