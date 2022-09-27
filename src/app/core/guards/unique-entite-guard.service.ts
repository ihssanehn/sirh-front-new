import { Injectable } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {NgxPermissionsService} from 'ngx-permissions';
import {UserService} from '@app/core/services';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {UserStore} from '@store/user.store';
import {toJS} from 'mobx';
import {MainStore} from "@store/mainStore.store";
import {MessageService} from "primeng/api";

@Injectable()
export class UniqueEntiteGuard implements CanActivate {
  constructor(private router: Router,
              private userService: UserService,
              private messageService: MessageService,
              private mainStore: MainStore,
              private activeRoute: ActivatedRoute,
              private permissionService: NgxPermissionsService
              ) {
    console.log('AuthGuard');
  }

  // This file is for managing this case:
  // When a user that has already selected a multiple entities and try to access a page wich it s not allowed to have multiple selected entities .
  // we redirect to parent

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    console.log('canActivate UniqueEntiteGuard', this.mainStore.selectedEntities, state, next)
    if(this.mainStore.selectedEntities?.length>1){
      this.router.navigate([this.router.url.substring(0, this.router.url.lastIndexOf('/'))]).then(() => {
      // this.router.navigate(['../'], { relativeTo: this.activeRoute }).then(() => {
      // this.router.navigate(['/list']).then(() => {
        this.messageService.add({
          severity: 'warning',
          summary: 'Echec!',
          detail: 'Veillez sélectioner une seule entité',
          sticky: false});
      });
      return false;
    }
    return true;
  }


}
