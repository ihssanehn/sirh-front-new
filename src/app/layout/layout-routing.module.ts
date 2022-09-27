import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LayoutComponent} from '@layout/layout.component';
import {AcceilComponent} from "@layout/acceil/acceil.component";
import {AuthGuard} from "@app/core/guards/auth-guard.service";
import {EntiteGuard} from "@app/core/guards/entite-guard.service";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'accueil'
      },
      {
        path: 'users',
         loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        canActivate: [EntiteGuard]
      },
      {
        path: 'accueil',
        component: AcceilComponent,
      },
      {
        path: 'activity',
        loadChildren: () => import('./activity/activity.module').then(m => m.ActivityModule),
        canActivate: [EntiteGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
