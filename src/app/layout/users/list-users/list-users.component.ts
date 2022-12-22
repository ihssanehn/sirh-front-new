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
import {MessageService} from "primeng/api";
import {ModalAddSortieComponent} from "@layout/users/modal-add-sortie/modal-add-sortie.component";
import {ModalAddEntreeComponent} from "@layout/users/modal-add-entree/modal-add-entree.component";



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
  sectionName;
  personnalFilters;
  actions;
  model_type;
  
  //   {
  //     id: 1,
  //     label: 'DPAE',
  //     checked: false,
  //     slug:'DPAE'
  //   },
  //   {
  //     id: 2,
  //     label: 'APICIL',
  //     checked: false,
  //     slug:'APICIL'
  //   },
  //   {
  //     id: 3,
  //     label: 'Carte D\'identité',
  //     checked: false,
  //     slug:'ID_CARD'
  //   },
  //   // {
  //   //   id: 4,
  //   //   label: 'RIB',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 5,
  //   //   label: 'Relance Mail Documents',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 5,
  //   //   label: 'Inscription AST',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 6,
  //   //   label: 'Création SIRH',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 7,
  //   //   label: 'Mail Informatique',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 8,
  //   //   label: 'Mail Embauche',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 9,
  //   //   label: 'Envoi Matricule DIGIPOSTE',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 10,
  //   //   label: 'Envoi Code SIMUS',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 11,
  //   //   label: 'Saisie ADP',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 12,
  //   //   label: 'MAJ Tableau Primes',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 13,
  //   //   label: 'Modif Matricule SIRH',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 14,
  //   //   label: 'Bilan D\'intégration',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 15,
  //   //   label: 'Journée D\'intégration + Remise Du Kit',
  //   //   checked: false
  //   // },
  //   // {
  //   //   id: 16,
  //   //   label: 'Bouteille De Champagne',
  //   //   checked: false
  //   // }
  // ];
  columns_sortie = [

  ];
  columns_entree;
  _allActions;

  constructor(private userService : UserService,
              private translate: TranslateService,
              private modalService: NgbModal,
              private messageService: MessageService,
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
          this.sectionName = 'Salariés'
          break;
        }
        case 'period_essai': {
          this.type = 'period_essai';
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
          this.sectionName = 'Suivi salariés - Entretiens'
          break;
        }
        case 'formation': {
          this.type = 'formation';
          break;
        }
        case 'visite_medicale': {
          this.type = 'visite_medicale';
          this.sectionName = 'Suivi salariés - Visites médicales'
          break;
        }
        default: {
          this.type = 'general';
        }
      }
      this.getUsers();
      if(type == 'entree' || type == 'sortie')
        this.getAction();

    });
   
  }

  ngOnInit() {
    this.getUsers();
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
    } catch (e) {
      console.log('error filter PROFIT_CENTER', e);
    }
  }

  async getAction(){
    this._allActions = await this.userService.listActions({model_type:this.model_type}).toPromise();

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
    // this.router.navigate(['users/new']);
    if(this.modalService.hasOpenModals()){
      return;
    }
    const modalRef = this.modalService.open(ModalAddEntreeComponent, { size: 'sm' , centered: true, windowClass: 'myModal'});
    modalRef.result.then(result=>{
      console.log('closed', result);
    }, reason => {
      console.log('closed');
    });
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
    return this[column].filter((column) => column.checked);
  }
}
