import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthRouting } from './auth.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {ToastModule} from 'primeng/toast';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuthRouting),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatButtonModule,
        ToastModule,
    ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  exports: [
    ResetPasswordComponent
  ],
})
export class AuthModule { }

