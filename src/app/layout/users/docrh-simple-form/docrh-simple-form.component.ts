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
import {MessageService} from "primeng/api";

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

  filter = {
    keyword: '',
    has_treated_alert: null,
    document_type: null,
    page: 1,
    limit: 10,
  }
  alerts = [
    {
      label: 'Oui',
      value: true,
    },
    {
      label: 'Non',
      value: false,
    },
    {
      label: 'Tous',
      value: null,
    },
  ]
  documents: Array<RHDocument> = [];
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  loading: boolean;
  document_types = [];
  loadingData: boolean;
  constructor(private userService : UserService,
              private translate: TranslateService,
              private modalService: NgbModal,
              public mainStore: MainStore,
              private listService: ListsService,
              private route: ActivatedRoute,
              private messageService: MessageService,
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

  async ngOnInit() {
    this.getDocuments();
    try{ this.document_types = await this.listService.getAll(this.listService.list.DOCUMENT_TYPE).toPromise();} catch (e) {console.log('error filter FUNCTION', e);}
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

  resetFilters() {
    this.filter = Object.assign(this.filter, {
      has_treated_alert: null,
      document_type: null,
    });
    this.getDocuments();
  }

  changePagination() {
    this.pagination = { ...this.pagination, limit: this.pagination.limit, total: this.pagination.total };
    this.filter.page = this.pagination.page;
    this.filter.limit = this.pagination.limit;
    this.getDocuments();
  }

  openDocumentRHModal(document?){
    const modalRef = this.modalService.open(ModalDocrhItemComponent, { size: 'lg' , centered: true, windowClass: 'myModal'});
    modalRef.result.then(result=>{
      console.log('closed result', result);
      if(result === 'QUERY'){
        this.getDocuments();
      }
    }, reason => {
      console.log('closed reason', reason);
    });
    if(document){
      modalRef.componentInstance.document = document;
    }
  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }

  getDocuments(){
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    const params = {
      ...this.filter
    }
    if(params.has_treated_alert !== true && params.has_treated_alert !== false){
      delete params['has_treated_alert'];
    }
    this.loading = true;
    this.searchSubscription = this.userService.getRHDocuments(params).subscribe((res) => {
      this.documents = res?.result?.data?.data;
      this.pagination = { ...this.pagination, total: res?.result?.data?.total };
    }, err =>{
      console.log('err getUsers', err);
    }, ()=>{
      this.loading = false;
    });
  }

  async archive(id) {
    Swal.fire({
      title: 'Êtes vous sûr?',
      text: 'Voulez-vous vraiment supprimer ce document?',
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
          const res = await this.userService.deleteDocument({id}).toPromise();
          console.log('res', res);
          if ( res?.result?.data) {
            this.messageService.add({
              severity: 'success',
              summary: 'Opération réussie',
              detail: 'Document supprimé avec succès',
              sticky: false,
            });
            this.getDocuments();
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
}
