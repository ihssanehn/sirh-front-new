import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MainStore} from "@store/mainStore.store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public translate: TranslateService, private mainStore: MainStore) {
    this.translate.addLangs(['en', 'fr']);
    this.translate.setDefaultLang('fr');
    // this.translate.use('fr');
    const localLang: string = localStorage.getItem('lang');
    // this.translate.use('en');
    if (localLang) {
      this.translate.use(localLang);
      this.mainStore.selectedLanguage = localLang;
    } else {
      const browserLang: string = translate.getBrowserLang();
      this.translate.use(browserLang.match(/en|fr/) ? browserLang : 'fr');
      localStorage.setItem('lang', 'fr');
    }
  }
}
