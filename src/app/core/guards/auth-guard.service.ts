import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {NgxPermissionsService} from 'ngx-permissions';
import {UserService} from '@app/core/services';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {UserStore} from '@store/user.store';
import {toJS} from 'mobx';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private userService: UserService,
              private userStore: UserStore,
              private permissionService: NgxPermissionsService
              ) {
    console.log('AuthGuard');
  }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('AuthGuard1', next, state);
    const result = await this.userService.populate();
    console.log('result', result);
    if (!result) {
      console.log('AuthGuard1 result', result);
      this.router.navigate(['/auth/login']).then(res=>console.log('AuthGuard1 navigate', res));
      return ;
    }

    if(!this.userStore.getAuthenticatedUser.cgu_accepted){
      this.router.navigate(['/auth/cgu']);
    }
    let route = '/auth';

    // if(state.url !== '/profile' && this.permissionService){
    //   if(this.permissionService.getPermission($userRoles.SUPERADMIN) ||
    //       this.permissionService.getPermission($userRoles.MANAGER)){
    //     if(state.url === '/' || state.url === '' ){
    //       route = '/';
    //       this.router.navigate([route]);
    //     }
    //   }
    // }
    return result;
  }
}
