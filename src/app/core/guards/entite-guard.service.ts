import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {NgxPermissionsService} from 'ngx-permissions';
import {UserService} from '@app/core/services';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {UserStore} from '@store/user.store';
import {toJS} from 'mobx';
import {MainStore} from "@store/mainStore.store";
import {MessageService} from "primeng/api";

@Injectable()
export class EntiteGuard implements CanActivate {
  constructor(private router: Router,
              private userService: UserService,
              private messageService: MessageService,
              private mainStore: MainStore,
              private permissionService: NgxPermissionsService
              ) {
    console.log('AuthGuard');
  }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // this.mainStore.selectedEntities = JSON.parse(localStorage.getItem('selectedEntities'));

    console.log('canActivate this.mainStore.selectedEntities', this.mainStore.selectedEntities)
    if(!(this.mainStore.selectedEntities?.length>0)){
      this.router.navigate(['/accueil']).then(() => {
        this.messageService.add({
          severity: 'warning',
          summary: 'Echec!',
          detail: 'Veillez sélectioner une entité',
          sticky: false});
      });
      return false;
    }
    return true;
  }


}
