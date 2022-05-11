import { Component, OnInit } from '@angular/core';
import {MainStore} from '@store/mainStore.store';
import {Router} from '@angular/router';
import {UserService} from '@services/index';
import {UserStore} from '@store/user.store';
import {toJS} from 'mobx';
import {$userRoles} from '@shared/Objects/sharedObjects';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  $roles = $userRoles;
  constructor(public mainStore: MainStore,
              public router: Router,
              private userService: UserService,
              public userStore: UserStore) {

  }

  ngOnInit(): void {
  }

  selectItem(item) {
    console.log('item', item);
  }

  onLoggedout(){}

  toggleExpand(item) {
    item.opened = !item.opened;
    console.log('toggleExpand', toJS(item));
  }

  getRole(){
    return this.userStore.getAuthenticatedUser.roles[0].description;
  }


  async logOut(){
    try {
      this.router.navigate(['/auth/login']).then(async ()=>{
        this.userService.purgeAuth();
        const res = await this.userService.loggout().toPromise();
      });
    } catch (error) {
      console.log('error', error);
    }
  }

  toggleSidebar(){
    this.mainStore.sidebarOpened = !this.mainStore.sidebarOpened;
  }
}
