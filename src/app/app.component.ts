import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MainStore} from "@store/mainStore.store";
import {UserStore} from "@store/user.store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public translate: TranslateService, private mainStore: MainStore, private userStore: UserStore) {
    this.translate.addLangs(['en', 'fr']);
    this.translate.setDefaultLang('fr');
    this.mainStore.selectedEntities = JSON.parse(localStorage.getItem('selectedEntities'));
    console.log("app local", this.mainStore.selectedEntities  );
    console.log("app local", JSON.parse(localStorage.getItem('selectedEntities') ));
    console.log("app local", localStorage.getItem('selectedEntities') );
    // this.translate.use('fr');
    const localLang: string = localStorage.getItem('lang');
    // this.translate.use('en');
    if (localLang) {
      this.translate.use(localLang);
      this.mainStore.selectedLanguage = localLang;
    } else {
      const browserLang: string = translate.getBrowserLang();
      // this.translate.use(browserLang.match(/en|fr/) ? browserLang : 'fr');
      this.translate.use('fr');
      localStorage.setItem('lang', 'fr');
    }
  }
}
