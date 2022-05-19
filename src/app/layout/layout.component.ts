import {ChangeDetectionStrategy, Component, HostListener, Inject, OnInit} from '@angular/core';
import { UserService } from '@services/index';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MainStore} from '@store/mainStore.store';
import {Subscription} from 'rxjs';

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
          url = value.urlAfterRedirects;
        }
      }
    });
  }


  ngOnInit(): void {
    // this.onResize(null);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // if(this.mainStore.noPaddingPage) return;
    // this.mainStore.sidebarOpened = window.innerWidth >= 992;
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
