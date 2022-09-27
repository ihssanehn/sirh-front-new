import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {CustomAdapter, CustomDateParserFormatter} from '@shared/classes/dateAdapter';
import {OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {CustomDateTimeIntl, MY_CUSTOM_DATETIME_FORMATS} from '@shared/classes/CustomDateTimeFormat';
import {NgbDateAdapter, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {MainStore} from "@store/mainStore.store";
import {JwtStore} from "@store/jwt.store";
import {UserStore} from "@store/user.store";
import {ApiService, ErrorService, UserService} from "@app/core/services";
import {AuthGuard} from "@app/core/guards/auth-guard.service";
import {AuthGuard2} from "@app/core/guards/auth-guard-2.service";
import {HttpTokenInterceptor} from "@app/core/interceptors";
import {NgxPermissionsModule} from "ngx-permissions";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "@shared/shared.module";
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {MessageService} from "primeng/api";
import { ToastModule } from 'primeng/toast';
import {MATERIAL_SANITY_CHECKS} from "@angular/material/core";
import {ListsService} from "@services/lists.service";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {ActivitiesService} from "@services/activities.service";
import {EntiteGuard} from "@app/core/guards/entite-guard.service";
import {UniqueEntiteGuard} from "@app/core/guards/unique-entite-guard.service";
// import {OwlMomentDateTimeModule} from "ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-format.class";
// import { OwlMomentDateTimeModule } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json?t='+new Date().getTime());
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    RouterModule,
    SharedModule,
    ToastModule,
    InfiniteScrollModule,
    SweetAlert2Module.forRoot(),
    NgxPermissionsModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // OwlMomentDateTimeModule,
    // OwlNativeDateTimeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ApiService,
    ErrorService,
    UserService,
    ActivitiesService,
    AuthGuard,
    AuthGuard2,
    EntiteGuard,
    UniqueEntiteGuard,
    MainStore,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    JwtStore,
    UserStore,
    MessageService,
    ListsService,
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'fr-FR'},
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_DATETIME_FORMATS},
    {provide: OwlDateTimeIntl, useClass: CustomDateTimeIntl},
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    {
      provide: MATERIAL_SANITY_CHECKS,
      useValue: false
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
