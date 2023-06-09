import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LayoutComponent} from '@layout/layout.component';
import {AcceilComponent} from "@layout/acceil/acceil.component";
import {AuthGuard} from "@app/core/guards/auth-guard.service";
import {EntiteGuard} from "@app/core/guards/entite-guard.service";
import {UpdateComponent} from "@layout/profile/update/update.component";

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
        path: 'projets',
         loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
        canActivate: [EntiteGuard]
      },
      {
        path: 'missions',
         loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
        canActivate: [EntiteGuard]
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
        path: 'activites',
        loadChildren: () => import('./activity/activity.module').then(m => m.ActivityModule),
        canActivate: [EntiteGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
