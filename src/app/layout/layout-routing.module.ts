import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LayoutComponent} from '@layout/layout.component';
import {ListUsersComponent} from "@layout/users/list-users/list-users.component";
import {AcceilComponent} from "@layout/acceil/acceil.component";

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
      },
      {
        path: 'accueil',
        component: AcceilComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
