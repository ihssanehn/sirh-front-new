import {ChangeDetectionStrategy, Component, HostListener, Inject, OnInit} from '@angular/core';
import { UserService } from '@services/index';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MainStore} from '@store/mainStore.store';
import {Subscription} from 'rxjs';
import {$headerSectionsMetaData, $sidebarItems_users} from "@shared/Objects/sharedObjects";

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

                if(this.router.url.indexOf('/users/list') !== -1){
                  $sidebarItems_users[0].opened = true;
                  $sidebarItems_users[1].opened = false;
                }
                if(this.router.url.indexOf('/users/new') !== -1){
                  $sidebarItems_users[0].opened = false;
                  $sidebarItems_users[1].opened = true;
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
  }


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
