import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "@app/core/guards/auth-guard.service";
import { AuthGuard2 } from './core/guards/auth-guard-2.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    // component: AuthLayoutComponent,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    // loadChildren: './auth/auth.module#AuthModule'// import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [AuthGuard2]
  },
  // {
  //   path: 'app',
  //   redirectTo: '',
  //   canActivate: [AuthGuard]
  // },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
