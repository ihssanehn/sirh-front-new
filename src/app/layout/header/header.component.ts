import { Component, OnInit } from '@angular/core';
import {MainStore} from '@store/mainStore.store';
import {UserStore} from '@store/user.store';
import {$headerItems, $userRoles} from '@shared/Objects/sharedObjects';
import {Router} from '@angular/router';
import {UserService} from '@app/core/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  $userRoles = $userRoles;
  $headerItems = $headerItems;
  constructor(
    public mainStore: MainStore,
    public userStore: UserStore,
    public userService: UserService,
    private router: Router
  ) { }
  ngOnInit(): void {
  }

  toggleSidebar(){
    this.mainStore.sidebarOpened = !this.mainStore.sidebarOpened;
  }

  searchIt() {

  }

  async logOut(){
    try {
      await   this.userService.purgeAuth();
      this.router.navigate(['/auth/signin']).then(async ()=>{

        // try {
        //    const res = await this.userService.loggout().toPromise();
        // }catch (e){
        //
        // }
      });
    } catch (error) {
      console.log('error', error);
    }
  }
}
