import {ChangeDetectionStrategy, Component, HostListener, Inject, OnInit} from '@angular/core';
import { UserService } from '@services/index';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MainStore} from '@store/mainStore.store';
import {Subscription} from 'rxjs';
import {$headerSectionsMetaData, $sidebarItems_activity, $sidebarItems_users} from "@shared/Objects/sharedObjects";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit{

  logo = '';
  opened: boolean = false;

   routeSubscription: Subscription;

  constructor(
      // @Inject(APP_BASE_HREF) private baseHref:string,
              private userService: UserService,
              private router: Router,
              private messageService: MessageService,
              private route: ActivatedRoute,
            public mainStore: MainStore

            ) {
    // this.logo = this.baseHref + 'assets/images/' + environment.logo;
    // this.loggedUser = this.userService.getCurrentUser();
    // this.route.snapshot
    // this.mainStore.noPaddingPage = true;
    this.routeSubscription = this.router.events.subscribe((value: any) => {
      let url;
      if (value instanceof NavigationEnd) {
        if (value.urlAfterRedirects) {
          url = value.urlAfterRedirects.split('/');
          if(url?.length>0){
            url = url.filter(item => item?.length>0)
            console.log('url', url);
            switch (url[0]){
              case 'users': {
                this.mainStore.currentHeaderSection = $headerSectionsMetaData.utilisateur;

                if(this.router.url.indexOf('users/list') !== -1){
                  $sidebarItems_users[0].opened = true;
                  $sidebarItems_users[1].opened = false;
                }
                if(this.router.url.indexOf('users/new') !== -1){
                  $sidebarItems_users[0].opened = false;
                  $sidebarItems_users[1].opened = true;
                }

                break;
              }
              case 'activity': {
                this.mainStore.currentHeaderSection = $headerSectionsMetaData.activity;

                $sidebarItems_activity.forEach(item => item.opened = false);
                if(this.router.url.indexOf('activity/list') !== -1 ||
                  this.router.url.indexOf('activity/my_activities') !== -1 ||
                  this.router.url.indexOf('activity/annulation_diffusion') !== -1 ||
                  this.router.url.indexOf('activity/impression') !== -1 ||
                  this.router.url.indexOf('activity/history') !== -1
                ){
                  $sidebarItems_activity[0].opened = true;
                }
                if(this.router.url.indexOf('activity/frais') !== -1){
                  $sidebarItems_activity[1].opened = true;
                }
                if(this.router.url.indexOf('activity/absence') !== -1){
                  $sidebarItems_activity[2].opened = true;
                }
                if(this.router.url.indexOf('activity/cloture') !== -1){
                  $sidebarItems_activity[3].opened = true;
                }
                if(this.router.url.indexOf('activity/delegation') !== -1){
                  $sidebarItems_activity[4].opened = true;
                }
                if(this.router.url.indexOf('activity/avance') !== -1){
                  $sidebarItems_activity[5].opened = true;
                }
                if(this.router.url.indexOf('activity/conge') !== -1){
                  $sidebarItems_activity[6].opened = true;
                }
                if(this.router.url.indexOf('activity/mes_frais') !== -1){
                  $sidebarItems_activity[7].opened = true;
                }

                break;
              }
              case 'accueil': {
                this.mainStore.currentHeaderSection = $headerSectionsMetaData.acceuil;
                this.mainStore.sidebarOpened = true;
                break;
              }
            }
          }
        }
      }
    });
    this.onResize();
    // this.checkEntite();
  }

  // checkEntite(){
  //   if(!(this.mainStore.selectedEntities?.length>0)){
  //     this.messageService.add({
  //       severity: 'info',
  //       summary: 'Info!',
  //       detail: 'Veillez sélectioner une entité',
  //       sticky: false});
  //   }
  // }

  ngOnInit(): void {
    // this.onResize(null);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    // if(this.mainStore.noPaddingPage) return;
    this.mainStore.sidebarOpened = window.innerWidth >= 992;
    this.mainStore.sidebarOverMode = window.innerWidth < 992;
  }

  toggleMenu() {
    this.opened = !this.opened;
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigate(['/auth/signin']);
  }

}
