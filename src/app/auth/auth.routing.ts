import {Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {AuthGuard2} from '@app/core/guards/auth-guard-2.service';
import { AuthLayoutComponent } from './layout/layout.component';

export const AuthRouting: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'signin',
        component: LoginComponent,
        // canActivate: [AuthGuard2]
      },
      {
        path: 'forgotPassword',
        component: ForgotPasswordComponent,
      },
      {
        path: 'resetPassword/:email/:token',
        component: ResetPasswordComponent,
      },
      { path: '', redirectTo: '/auth/signin'},
    ]
  }
];
