import {Component, OnDestroy, OnInit} from '@angular/core';
import { UserService } from '@services/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';
import {User} from "@app/core/entities";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserInfoFormComponent} from "@layout/users/user-info-form/user-info-form.component";
import {ListsService} from "@services/lists.service";
import {Validators} from "@angular/forms";
import {MainStore} from "@store/mainStore.store";

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, OnDestroy {

  users: User[] = [];
  keyword = '';
  searchSubscription: Subscription;
  $roles = $userRoles;
  showFilters = false;
  pagination: any = {
    page: 1,
    total: 10,
    limit: 10
  };
  // contracts = [];
  // managers = [];
  // functions = [];
  // family_situations = [];
  // profiles = []; //oui
  // status = [];
  // entities = [];
  // profit_centers = [];

  // roles = [];
  // member_ships = [];
  // types = [];


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


  filter = {
    keyword: '',
    is_virtual: null,
    page: 1,
    limit: 10,
    is_blocked: null,
    to_be_completed: null,

    roles: [],
    member_ships: [],
    profiles: [],
    profit_centers: [],
    // managers: [],
    // status: [],
    // type: [],

    business_lines: [],
    op_directions: [],
    business_units: [],
    departments: [],
    facturation_stats: [],
    stats_to_complete: [],
    matricule_stats: [],
    user_stats: null,
    personals: []
  }
  shownItems: {
    photo_profile: false;
    registration_number: false;
    first_name: false;
    last_name: false;
    function_id: false;
    function_name: false;
    profile_name: false;
    cp_name: false;
    start_date: false;
    end_date: false;
    telephone_personal: false;
    email_professional: false;
    birthday: false;


    // parameter: any;
    // nationality_id: number;
    // permissions: Array<any>;
    // perimeters: Array<any>;
    // email_personal: string;
    // civility: string;
    // birth_place: string;
    // nationality: string;
    // address: string;
    // code_postal: string;
    // city: string;
    // creator_id: number;
    // manager_id: number;
    // kids_number: number;
    // number_security_social: number;
    // number_carte_vitale: any;
    // urgency_name_1: string;
    // urgency_telephone_1: string;
    // family_link_1: string;
    // urgency_name_2: any;
    // urgency_telephone_2: any;
    // family_link_2: any;
    // telephone_professional: string;
    // family_situation_id: number;
    // validator_absence_id: any;
    // status_id: number;
    // cp_id: number;
    // is_head_office: any;
    // is_part_time: any;
    // first_annual_salary: string;
    // benefits: string;
    // created_at: Date;
    // updated_at: Date;
  }
  loadingData: boolean;
  type;
  personnalFilters;
  constructor(private userService : UserService,
              private translate: TranslateService,
              private modalService: NgbModal,
              public mainStore: MainStore,
              private listService: ListsService,
              private route: ActivatedRoute,
              private router: Router) {

    this.route.params.subscribe(params => {
      console.log('params', params);
      const {type} = params;
      switch (type){
        case 'general': {
          this.type = 'general';
          break;
        }
        case 'period_essai': {
          this.type = 'period_essai';
          break;
        }
        case 'entretien': {
          this.type = 'entretien';
          break;
        }
        case 'formation': {
          this.type = 'formation';
          break;
        }
        case 'visite_medicale': {
          this.type = 'visite_medicale';
          break;
        }
        default: {
          this.type = 'general';
        }
      }
    });
  }

  ngOnInit() {
    this.getUsers();
    this.getFilters();
  }

  // civility: "M"
  // cp_name: "CP 1 Piman Switzerland"
  // created_at: "2022-07-20T16:19:47.000Z"
  // email: "chbanianass25@gmail.com"
  // end_date: "2022-07-24T23:00:00.000Z"
  // entry_date: "2022-07-04T23:00:00.000Z"
  // first_name: "ANASS"
  // full_name: "M CHBANI ANASS"
  // id: 46
  // last_login: null
  // last_name: "CHBANI"
  // manager_id: 2
  // manager_name: "Homme SIRH Manager-2"
  // member_ship_name: "Externe"
  // photo_profile: "http://localhost:9073/personal/getPhotoProfile?personal_id=46"
  // profile_id: 1
  // profile_name: "Assistante"
  // registration_number: "2322332"
  // role_name: "Comptabilité"
  // seniority: "0a 0m 22j"
  // telephone_portable: "023322323"


  async getFilters(){
    const id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    // try{ this.family_situations = await this.listService.getAll(this.listService.list.FAMILY_SITUATION).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    // try{ this.functions = await this.listService.getAll(this.listService.list.FUNCTION).toPromise();} catch (e) {console.log('error filter FUNCTION', e);}
    // try{ this.contracts = await this.listService.getAll(this.listService.list.CONTRACT).toPromise();} catch (e) {console.log('error filter CONTRACT', e);}
    // try{ this.entities = await this.listService.getAll(this.listService.list.ENTITY).toPromise();} catch (e) {console.log('error filter ENTITY', e);}
    // try{  this.managers = await this.listService.getAll(this.listService.list.MANAGER).toPromise();} catch (e) {console.log('error filter MANAGER', e);}
    // try{ this.profiles = await this.listService.getAll(this.listService.list.PROFILE).toPromise();} catch (e) {console.log('error filter PROFILE', e);}
    // try{ this.status = await this.listService.getAll(this.listService.list.STATUS, this.listService.list.PERSONAL).toPromise();} catch (e) {console.log('error filter PERSONAL', e);}
    // try{ this.profit_centers = await this.listService.getAll(this.listService.list.PROFIT_CENTER, {id: id_entite}).toPromise();} catch (e) {console.log('error filter PROFIT_CENTER', e);}
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
    this.searchSubscription = this.userService.getUsers(params).subscribe((result) => {
      this.users = result.data.data;
      console.log('this.users', this.users);
      this.pagination = { ...this.pagination, total: result?.data?.total };
    }, err =>{
      console.log('err getUsers', err);
    }, ()=>{
      this.loadingData = false;
    })
  }

  openSelectRole(){
    this.router.navigate(['users/new']);
    // if(this.modalService.hasOpenModals()){
    //   return;
    // }
    // const modalRef = this.modalService.open(SelectRoleComponent, { size: 'sm' , centered: true, windowClass: 'myModal'});
    // modalRef.result.then(result=>{
    //   console.log('closed', result);
    // }, reason => {
    //   console.log('closed');
    // });
    // modalRef.componentInstance.idUser = item.id;
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
      user_stats: null
    });
    console.log('resetFilters', this.filter)
    this.getUsers();
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
    this.pagination = { ...this.pagination, limit: this.pagination.limit, total: this.pagination.total };
    this.filter.page = this.pagination.page;
    this.filter.limit = this.pagination.limit;
    this.getUsers();
  }

  filterChanged() {
    this.getUsers();
  }
}
