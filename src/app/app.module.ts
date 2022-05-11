import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';


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
    SweetAlert2Module.forRoot(),
    NgxPermissionsModule.forRoot(),
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
    AuthGuard,
    AuthGuard2,
    MainStore,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    JwtStore,
    UserStore,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
