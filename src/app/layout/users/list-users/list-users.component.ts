import {Component, OnDestroy, OnInit} from '@angular/core';
import { UserService } from '@services/index';
import { Router } from '@angular/router';
import {Subscription} from 'rxjs';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';
import {User} from "@app/core/entities";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserInfoFormComponent} from "@layout/users/user-info-form/user-info-form.component";
import {ListsService} from "@services/lists.service";

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
  constructor(private userService : UserService,
              private translate: TranslateService,
              private modalService: NgbModal,
              private listService: ListsService,
              private router: Router) { }

  ngOnInit() {
    this.getUsers();
    this.getFilters();
  }

  async getFilters(){
    try{ this.family_situations = await this.listService.getAll(this.listService.list.FAMILY_SITUATION).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.functions = await this.listService.getAll(this.listService.list.FUNCTION).toPromise();} catch (e) {console.log('error filter FUNCTION', e);}
    try{ this.contracts = await this.listService.getAll(this.listService.list.CONTRACT).toPromise();} catch (e) {console.log('error filter CONTRACT', e);}
    try{ this.entities = await this.listService.getAll(this.listService.list.ENTITY).toPromise();} catch (e) {console.log('error filter ENTITY', e);}
    try{  this.managers = await this.listService.getAll(this.listService.list.MANAGER).toPromise();} catch (e) {console.log('error filter MANAGER', e);}
    try{ this.profiles = await this.listService.getAll(this.listService.list.PROFILE).toPromise();} catch (e) {console.log('error filter PROFILE', e);}
    try{ this.status = await this.listService.getAll(this.listService.list.STATUS, this.listService.list.PERSONAL).toPromise();} catch (e) {console.log('error filter PERSONAL', e);}
    try{ this.profit_centers = await this.listService.getAll(this.listService.list.PROFIT_CENTER, this.listService.list.PROFIT_CENTER).toPromise();} catch (e) {console.log('error filter PROFIT_CENTER', e);}
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

  ngOnDestroy() {
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
  }

  async askBlockUser(id) {
    Swal.fire({
      title: this.translate.instant('ARE YOU SURE?'),
      text: this.translate.instant('ARE YOU SURE YOU WANT TO BLOCK THIS USER ACCOUNT?'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#59a6d4',
      cancelButtonColor: '#f3533b',
      confirmButtonText: this.translate.instant('YES, BLOCK!'),
      cancelButtonText: this.translate.instant('CANCEL'),
      heightAuto: false
    }).then(async (result) => {
      if (result.value) {
        try {
          const res = await this.userService.update({id,  blocked_at: true, keyword: this.keyword}).toPromise();
          console.log('res', res);
          if ( res?.result?.data) {
            Swal.fire({
              title: this.translate.instant('SUCCESSFUL OPERATION!'),
              text: 'Ce compte utilisateur a bien été bloqué',
              icon: 'success',
              heightAuto: false
            });
            this.users = res?.result.data;
            // this.getUsers();
          } else {
            throw new Error();
          }
        } catch (error) {
          // const errorMessage = this.errorsService.getErrorMessage(error.status || null, error);
          console.log('errorMessage', error);
          Swal.fire(
              this.translate.instant('FAILURE!'),
              error,
              'error'
          );
        }
      }
    });
  }

  async askUnBlockUser(id) {
    Swal.fire({
      title: this.translate.instant('ARE YOU SURE?'),
      text: this.translate.instant('ARE YOU SURE YOU WANT TO UNBLOCK THIS USER ACCOUNT?'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#59a6d4',
      cancelButtonColor: '#f3533b',
      confirmButtonText: 'Oui, débloquer!',
      cancelButtonText: this.translate.instant('CANCEL'),
      heightAuto: false
    }).then(async (result) => {
      if (result.value) {
        try {
          const res = await this.userService.update({id, blocked_at: false, keyword: this.keyword}).toPromise();
          console.log('res', res);
          if ( res?.result?.data) {
            Swal.fire({
              title: this.translate.instant('SUCCESSFUL OPERATION!'),
              text: 'Ce compte utilisateur a bien été débloqué',
              icon: 'success',
              heightAuto: false
            });
            this.users = res.result.data;
            // this.getUsers();
          } else {
            throw new Error();
          }
        } catch (error) {
          // const errorMessage = this.errorsService.getErrorMessage(error.status || null, error);
          console.log('errorMessage', error);
          Swal.fire(
              this.translate.instant('FAILURE!'),
              error,
              'error'
          );
        }
      }
    });
  }

  async archive(id) {
    Swal.fire({
      title: this.translate.instant('ARE YOU SURE?'),
      text: this.translate.instant('ARE YOU SURE YOU WANT TO DELETE THIS USER ACCOUNT?'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#59a6d4',
      cancelButtonColor: '#f3533b',
      confirmButtonText: this.translate.instant('YES, DELETE!'),
      cancelButtonText: this.translate.instant('CANCEL'),
      heightAuto: false
    }).then(async (result) => {
      if (result.value) {
        try {
          const res = await this.userService.delete({id}).toPromise();
          console.log('res', res);
          if ( res?.result?.data) {
            Swal.fire({
              title: this.translate.instant('SUCCESSFUL OPERATION!'),
              text: 'Ce compte utilisateur a bien été supprimé',
              icon: 'success',
              heightAuto: false
            });
            this.users = res?.result.data
          } else {
            throw new Error();
          }
        } catch (error) {
          // const errorMessage = this.errorsService.getErrorMessage(error.status || null, error);
          console.log('errorMessage', error);
          Swal.fire(
              this.translate.instant('FAILURE!'),
              error,
              'error'
          );
        }
      }
    });
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
