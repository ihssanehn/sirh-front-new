import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {markFormAsDirty, SharedClasses} from '@shared/Utils/SharedClasses';
import {Location} from '@angular/common';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {User} from "@app/core/entities";
import * as moment from "moment";
import { NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ImageCropperComponent} from "@shared/components/image-cropper/image-cropper.component";
import {Subscription} from "rxjs";
import {ModalPerimetreUsersComponent} from "@layout/users/modal-perimetre-users/modal-perimetre-users.component";



@Component({
  selector: 'app-perimetre',
  templateUrl: './perimetre.component.html',
  styleUrls: ['./perimetre.component.scss']
})
export class PerimetreComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Output() submitPerimeters: EventEmitter<any> = new EventEmitter();
  users: User[] = [];
  keyword = '';
  error = '';
  warning = '';
  searchSubscription: Subscription;
  pagesize = 10;

  pagination: {
    limit: number,
    page: number,
  }

  selectedUsers = [];
  myForm: FormGroup;

  constructor(private userService : UserService, private modalService: NgbModal) {
    this.pagination = {
      limit: this.pagesize,
      page: 1
    }
  }



  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    this.searchSubscription = this.userService.getUsers({with_perimeter: true, keywords: this.keyword, ...this.pagination}).subscribe((result) => {
      this.users = result.data.data;
      console.log('this.users', this.users);
    }, err =>{
      console.log('err getUsers', err);
    })
  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }

  onScroll() {
    console.log('scrooool');
    this.pagination.limit = this.pagination.limit + this.pagesize;
    this.getUsers();
  }

  openUsersPerimetreModal(user){
    const modalRef = this.modalService.open(ModalPerimetreUsersComponent,
      { size: 'sm' , centered: true, windowClass: 'myModal'});
    modalRef.result.then(result=>{
      console.log('closed', result);

    }, reason => {
      console.log('closed');
    });
    modalRef.componentInstance.users = user.perimeters;
  }

  appendToSelected(user) {
    if(! this.selectedUsers){
      this.selectedUsers = [];
    }
    this.selectedUsers.push(user)
  }

  getFiltredUsers() {
    return this.users.filter(user => !this.selectedUsers.find(selectedUser => selectedUser.id === user.id));
  }

  deleteFromSelectedUsers(id){
    if(!id) return;
    this.selectedUsers = this.selectedUsers.filter(selectedUser => selectedUser.id !== id );
  }

  savePermimeters() {
    this.error = '';
    markFormAsDirty(this.myForm);
    if(!this.myForm.valid ){
      this.error = '';
      return;
    }
    this.submitPerimeters.emit(this.myForm.value);
  }
}

