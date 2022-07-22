import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { UserService } from '@services/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';
import {RHDocument, User} from "@app/core/entities";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListsService} from "@services/lists.service";
import {Validators} from "@angular/forms";
import {MainStore} from "@store/mainStore.store";
import * as moment from "moment";
import {ModalDocrhItemComponent} from "@layout/users/modal-docrh-item/modal-docrh-item.component";

@Component({
  selector: 'app-docrh-simple-form',
  templateUrl: './docrh-simple-form.component.html',
  styleUrls: ['./docrh-simple-form.component.scss']
})
export class DocrhSimpleFormComponent implements OnInit, OnDestroy {

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
  documents: Array<RHDocument> = [];
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
   loading: boolean;
  constructor(private userService : UserService,
              private translate: TranslateService,
              private modalService: NgbModal,
              public mainStore: MainStore,
              private listService: ListsService,
              private route: ActivatedRoute,
              private router: Router) {

    // this.openDocumentRHModal();
    this.route.params.subscribe(params => {
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
  }

  ngOnInit() {
    this.getFilters();
    this.getDocuments();
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
    this.getDocuments();
  }

  changePagination() {
    this.pagination = { ...this.pagination, limit: this.pagination.limit, total: this.pagination.total };
    this.filter.page = this.pagination.page;
    this.filter.limit = this.pagination.limit;
    this.getDocuments();
  }

  openDocumentRHModal(id?){
    const modalRef = this.modalService.open(ModalDocrhItemComponent, { size: 'lg' , centered: true, windowClass: 'myModal'});
    modalRef.result.then(result=>{
      console.log('closed', result);
    }, reason => {
      console.log('closed');
    });
    if(id){
      modalRef.componentInstance.id_document = id;
    }
  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }

  async getDocuments(){
    try {
      this.loading = true;
      const params = {
        ...this.filter
      }
      const res = await this.userService.getRHDocuments(params).toPromise();
      this.documents = res.data;
      console.log('res getDocuments', res);
    }catch (e){

    }finally {
      this.loading = false;
    }
  }
}
