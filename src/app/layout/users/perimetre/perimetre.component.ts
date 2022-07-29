import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup} from '@angular/forms';
import {UserService} from '@app/core/services';
import {SharedClasses} from '@shared/Utils/SharedClasses';
import {User} from "@app/core/entities";
import { NgbModal} from "@ng-bootstrap/ng-bootstrap";
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
  @Input() submitting;
  @Input() user: User;
  @Input()
  public set perimeters(val) {
    if(val){
      this.selectedUsers = val.map(item => {item.id = item.personal_perimeter_id; return item;});
    }
  }

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
  totalUsers: any;
  loadingData: boolean;

  constructor(private userService : UserService, private modalService: NgbModal) {
    this.pagination = {
      limit: this.pagesize,
      page: 1
    }
  }

  ngOnInit() {
    this.getUsers();
  }

  getSelectedUsers(){
    return this.selectedUsers.filter(item => item.id !== this.user?.id )
  }

  getUsers(){
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    this.loadingData = true;
    this.searchSubscription = this.userService.getUsers({type: 'general', with_perimeter: true, keywords: this.keyword, ...this.pagination}).subscribe((result) => {
      if(result){
        this.users = result.data.data;
        this.totalUsers = result?.data?.total;
      }
      this.users = this.users.filter(item => item.id !== this.user?.id);
      console.log('result', result, result?.data?.total);
    }, err =>{
      console.log('err getUsers', err);
    }, () => {
      this.loadingData = false;
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
    const filtered =  this.users.filter(user => user.id !== this.user?.id && !this.selectedUsers?.find(selectedUser => selectedUser.id === user.id));
    if(filtered?.length===0){
      this.onScroll();
    }
    return filtered;
  }

  deleteFromSelectedUsers(id){
    if(!id) return;
    this.selectedUsers = this.selectedUsers.filter(selectedUser => selectedUser.id !== id );
  }

  savePermimeters() {
    this.error = '';
    // markFormAsDirty(this.myForm);
    // if(!this.myForm.valid ){
    //   this.error = '';
    //   return;
    // }
    // this.submitPerimeters.emit(this.myForm.value);

    const appended_users = [];
    this.selectedUsers.forEach(user => {
      if(user.with_perimeter && user.perimeters?.length>0){
        user.perimeters.forEach(item => appended_users.push(item.personal_perimeter_id));
      }
    });
    const submitted_users = [...this.selectedUsers.map(item => item.id), ...appended_users];
    console.log('submitted_users', SharedClasses.remove_duplicates(submitted_users),submitted_users );
    this.submitPerimeters.emit(SharedClasses.remove_duplicates(submitted_users));
  }

}

