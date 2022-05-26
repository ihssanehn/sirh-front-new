import {Component, OnDestroy, OnInit} from '@angular/core';
import { UserService } from '@services/index';
import { Router } from '@angular/router';
import {Subscription} from 'rxjs';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';
import {User} from "@app/core/entities";

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

  constructor(private userService : UserService,
              private translate: TranslateService,
              private router: Router) { }

  ngOnInit() {
    this.getUsers();
  }


  getUsers(){
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    this.searchSubscription = this.userService.getUsers({keyword: this.keyword}).subscribe((result) => {
      this.users = result;
      console.log('this.users', result);

    }, err =>{
      console.log('err getUsers', err);
    })
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
}
