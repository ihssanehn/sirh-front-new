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
  contracts = [];
  managers = [];
  functions = [];
  family_situations = [];
  profiles = [];
  status = [];

  entities = [];
  profit_centers = [];
  filter = {
    keyword: '',
    family_situations: [],
    functions: [],
    contracts: [],
    entities: [],
    profiles: [],
    status: [],
    profit_centers: [],
    managers: [],
    is_virtual: null,
    page: 1,
    limit: 10,
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
          break;
        }
        case 'period_essai': {
          break;
        }
        case 'entretien': {
          break;
        }
        case 'formation': {
          break;
        }
        case 'visite_medicale': {
          break;
        }
        default: {
        }
      }
    });
    const data = [
      {
        "name": "id",
        "type": "INT",
        "length": "10",
        "isPrimary": true,
        "isGenerated": true,
        "generationStrategy": "increment",
        "isNullable": false,
        "unsigned": true
      },
      {
        "name": "registration_number",
        "type": "VARCHAR",
        "length": "255",
        "isNullable": true,
        "comment": "Matricule"
      },
      {
        "name": "first_name",
        "type": "VARCHAR",
        "length": "255",
        "isNullable": false
      },
      {
        "name": "last_name",
        "type": "VARCHAR",
        "length": "255",
        "isNullable": false
      },
      {
        "name": "email",
        "type": "VARCHAR",
        "length": "255",
        "isUnique": true,
        "isNullable": false
      },
      {
        "name": "civility",
        "type": "VARCHAR",
        "length": "255",
        "isNullable": false
      },
      {
        "name": "fiche_to_be_completed",
        "type": "boolean",
        "default": false
      },
      {
        "name": "birthday",
        "type": "date",
        "isNullable": false
      },
      {
        "name": "number_security_social",
        "type": "INT",
        "length": "10",
        "isNullable": true
      },
      {
        "name": "nationality_id",
        "type": "INT",
        "length": "10",
        "isNullable": true
      },
      {
        "name": "city_id",
        "type": "INT",
        "length": "10",
        "isNullable": true
      },
      {
        "name": "address",
        "type": "VARCHAR",
        "length": "255",
        "isNullable": true
      },
      {
        "name": "code_postal",
        "type": "VARCHAR",
        "length": "255",
        "isNullable": true
      },
      {
        "name": "telephone_fix",
        "type": "VARCHAR",
        "length": "255",
        "isNullable": true
      },
      {
        "name": "telephone_bureau",
        "type": "VARCHAR",
        "length": "255",
        "isNullable": true
      },
      {
        "name": "telephone_portable",
        "type": "VARCHAR",
        "length": "255",
        "isNullable": true
      },
      {
        "name": "profile_id",
        "type": "INT",
        "length": "10",
        "isNullable": false,
        "unsigned": true
      },
      {
        "name": "role_id",
        "type": "INT",
        "length": "10",
        "isNullable": true,
        "unsigned": true
      },
      {
        "name": "member_ship_id",
        "type": "INT",
        "length": "10",
        "isNullable": true,
        "unsigned": true,
        "comment": "Appartenance"
      },
      {
        "name": "supplier_id",
        "type": "INT",
        "length": "10",
        "isNullable": true,
        "unsigned": true,
        "comment": "Fournisseur"
      },
      {
        "name": "cp_id",
        "type": "INT",
        "length": "10",
        "isNullable": true,
        "unsigned": true
      },
      {
        "name": "original_company_id",
        "type": "INT",
        "length": "10",
        "isNullable": true,
        "unsigned": true
      },
      {
        "name": "attachment_agency_id",
        "type": "INT",
        "length": "10",
        "isNullable": true,
        "unsigned": true
      },
      {
        "name": "not_billable",
        "type": "boolean",
        "default": false,
        "comment": "Non Facturable"
      },
      {
        "name": "in_out_office",
        "type": "boolean",
        "default": false
      },
      {
        "name": "is_part_time",
        "type": "boolean",
        "default": false
      },
      {
        "name": "time_entry_id",
        "type": "INT",
        "length": "10",
        "isNullable": false,
        "unsigned": true
      },
      {
        "name": "calendar_id",
        "type": "INT",
        "length": "10",
        "isNullable": false,
        "unsigned": true
      },
      {
        "name": "emission_of_contract_date",
        "type": "date",
        "isNullable": true
      },
      {
        "name": "signature_of_contract_date",
        "type": "date",
        "isNullable": true
      },
      {
        "name": "group_start_date",
        "type": "date",
        "isNullable": false
      },
      {
        "name": "is_group_mutation_entry",
        "type": "boolean",
        "default": false
      },
      {
        "name": "entry_date",
        "type": "date",
        "isNullable": false
      },
      {
        "name": "end_trial_period_date",
        "type": "date",
        "isNullable": true
      },
      {
        "name": "depart_mail_received_date",
        "type": "date",
        "isNullable": false
      },
      {
        "name": "theory_end_date",
        "type": "date",
        "isNullable": false
      },
      {
        "name": "end_date",
        "type": "date",
        "isNullable": false
      },
      {
        "name": "could_be_manager",
        "type": "boolean",
        "default": false
      },
      {
        "name": "manager_id",
        "type": "INT",
        "length": "10",
        "isNullable": true,
        "unsigned": true
      },
      {
        "name": "manage_holidays",
        "type": "boolean",
        "default": false
      },
      {
        "name": "validator_absence_id",
        "type": "INT",
        "length": "10",
        "isNullable": true,
        "unsigned": true
      },
      {
        "name": "fiscal_car_power_id",
        "type": "INT",
        "length": "10",
        "isNullable": true,
        "unsigned": true
      },
      {
        "name": "complex_charge",
        "type": "boolean",
        "default": false,
        "comment": "Frais refacturables complexes"
      },
      {
        "name": "is_exclusion_etp",
        "type": "boolean",
        "default": false,
        "comment": "Exclusion ETP"
      },
      {
        "name": "is_exclusion_reporting",
        "type": "boolean",
        "default": false,
        "comment": "Exclusion Reporting"
      },
      {
        "name": "creator_id",
        "type": "INT",
        "length": "10",
        "isNullable": true,
        "unsigned": true
      },
      {
        "name": "created_at",
        "type": "TIMESTAMP",
        "isNullable": true
      },
      {
        "name": "updated_at",
        "type": "TIMESTAMP",
        "isNullable": true
      },
      {
        "name": "deleted_at",
        "type": "TIMESTAMP",
        "isNullable": true
      }
    ];
    let fb_json: any = {};
    data.forEach(element => {
      fb_json[element.name] = [null];
      if(element.isNullable){
        fb_json[element.name].push(Validators.required);
      }
    });
    fb_json = JSON.stringify(fb_json);  // {"name":"John Smith"}
    fb_json = fb_json.replace(/"([^"]+)":/g, '$1:');
     // {name:"John Smith"}
    console.log('form builder data', fb_json);
  }

  ngOnInit() {
    this.getUsers();
    this.getFilters();
  }

  async getFilters(){
    const id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    try{ this.family_situations = await this.listService.getAll(this.listService.list.FAMILY_SITUATION).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.functions = await this.listService.getAll(this.listService.list.FUNCTION).toPromise();} catch (e) {console.log('error filter FUNCTION', e);}
    try{ this.contracts = await this.listService.getAll(this.listService.list.CONTRACT).toPromise();} catch (e) {console.log('error filter CONTRACT', e);}
    try{ this.entities = await this.listService.getAll(this.listService.list.ENTITY).toPromise();} catch (e) {console.log('error filter ENTITY', e);}
    try{  this.managers = await this.listService.getAll(this.listService.list.MANAGER).toPromise();} catch (e) {console.log('error filter MANAGER', e);}
    try{ this.profiles = await this.listService.getAll(this.listService.list.PROFILE).toPromise();} catch (e) {console.log('error filter PROFILE', e);}
    try{ this.status = await this.listService.getAll(this.listService.list.STATUS, this.listService.list.PERSONAL).toPromise();} catch (e) {console.log('error filter PERSONAL', e);}
    try{ this.profit_centers = await this.listService.getAll(this.listService.list.PROFIT_CENTER, {id: id_entite}).toPromise();} catch (e) {console.log('error filter PROFIT_CENTER', e);}
  }

  getUsers(){
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    const params = {
      ...this.filter
    }
    if(this.filter.is_virtual === null){
      params.is_virtual = -1;
    }else if(this.filter.is_virtual){
      params.is_virtual = 1;
    }else {
      params.is_virtual = 0;
    }
    this.searchSubscription = this.userService.getUsers(params).subscribe((result) => {
      this.users = result.data.data;
      console.log('this.users', this.users);
      this.pagination = { ...this.pagination, total: result?.data?.total };
    }, err =>{
      console.log('err getUsers', err);
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
    this.router.navigate(['users/new/simple'], {queryParams: {step: 0, user_id: user.id}});
  }
  ngOnDestroy() {
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
  }

  resetFilters() {
    this.filter = Object.assign(this.filter, {
      functions: [],
      contracts: [],
      entities: [],
      profiles: [],
      status: [],
      profit_centers: [],
      managers: [],
      is_virtual: null
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
      //   this.getAllStudents();
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
