import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthRouting } from './auth.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import { AuthLayoutComponent } from './layout/layout.component';
import { SharedModule } from '@app/shared/shared.module';
import {ToastModule} from "primeng/toast";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuthRouting),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatButtonModule,
        SharedModule,
        ToastModule
    ],
  declarations: [
    LoginComponent,
    AuthLayoutComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ]
})
export class AuthModule { }

