import {Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {AuthGuard2} from '@app/core/guards/auth-guard-2.service';

export const AuthRouting: Routes = [
  {
    path: '',
    // component: LayoutComponent,
    children: [
      {
        path: 'signin',
        component: LoginComponent,
        canActivate: [AuthGuard2]
      },
      {
        path: 'forgotPassword',
        component: ForgotPasswordComponent,
        canActivate: [AuthGuard2]
      },
      {
        path: 'resetPassword/:email/:token',
        component: ResetPasswordComponent,
        canActivate: [AuthGuard2]
      },
      { path: '', redirectTo: '/auth/signin'},
    ]
  }
];
