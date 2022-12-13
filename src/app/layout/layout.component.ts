import {ChangeDetectionStrategy, Component, HostListener, Inject, OnInit} from '@angular/core';
import { UserService } from '@services/index';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MainStore} from '@store/mainStore.store';
import {Subscription} from 'rxjs';
import {
  $headerSectionsMetaData,
  $sidebarItems_activity,
  $sidebarItems_project,
  $sidebarItems_users
} from "@shared/Objects/sharedObjects";
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
                  $sidebarItems_users[0].opened = true; // todo make it false (true only on Lot 1)
                  $sidebarItems_users[1].opened = true;
                }

                break;
              }
              case 'missions': {
                this.mainStore.currentHeaderSection = $headerSectionsMetaData.projet;

                if(this.router.url.indexOf('missions/ordre_mission') !== -1){
                  $sidebarItems_project[0].opened = false;
                  $sidebarItems_project[1].opened = true;
                }
                break;
              }
              case 'projets': {
                this.mainStore.currentHeaderSection = $headerSectionsMetaData.projet;

                if(this.router.url.indexOf('projets/list') !== -1){
                  $sidebarItems_project[0].opened = true;
                  $sidebarItems_project[1].opened = false;
                }
                if(this.router.url.indexOf('projets/fin_mission') !== -1){
                  $sidebarItems_project[0].opened = true;
                  $sidebarItems_project[1].opened = false;
                }
                if(this.router.url.indexOf('projets/regularisation') !== -1){
                  $sidebarItems_project[0].opened = true;
                  $sidebarItems_project[1].opened = false;
                }
                if(this.router.url.indexOf('projets/creation') !== -1){
                  $sidebarItems_project[0].opened = true;
                  $sidebarItems_project[1].opened = false;
                }
                // store.upwebapp.com/wordpress
                // UPDATE wp_posts SET guid = REPLACE(guid, 'store.upwebapp.com/wordpress', 'store.upwebapp.com');
                break;
              }
              case 'activites': {
                this.mainStore.currentHeaderSection = $headerSectionsMetaData.activity;

                $sidebarItems_activity.forEach(item => item.opened = false);
                if(this.router.url.indexOf('activites/list') !== -1 ||
                  this.router.url.indexOf('activites/mes_activites') !== -1 ||
                  this.router.url.indexOf('activites/annulation_diffusion') !== -1 ||
                  this.router.url.indexOf('activites/impression') !== -1 ||
                  this.router.url.indexOf('activites/history') !== -1
                ){
                  $sidebarItems_activity[0].opened = true;
                }
                if(this.router.url.indexOf('activites/frais') !== -1){
                  $sidebarItems_activity[1].opened = true;
                }
                if(this.router.url.indexOf('activites/absence') !== -1){
                  $sidebarItems_activity[2].opened = true;
                }
                if(this.router.url.indexOf('activites/cloture') !== -1){
                  $sidebarItems_activity[3].opened = true;
                }
                if(this.router.url.indexOf('activites/delegation') !== -1){
                  $sidebarItems_activity[4].opened = true;
                }
                if(this.router.url.indexOf('activites/avance') !== -1){
                  $sidebarItems_activity[5].opened = true;
                }
                if(this.router.url.indexOf('activites/conge') !== -1){
                  $sidebarItems_activity[6].opened = true;
                }
                if(this.router.url.indexOf('activites/mes_frais') !== -1){
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
