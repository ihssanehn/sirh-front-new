import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import {TrombiComponent} from "@layout/users/trombi/trombi.component";
import {SimpleAddComponent} from "@layout/users/simple-add/simple-add.component";
import {IndependentAddComponent} from "@layout/users/independent-add/independent-add.component";
import {GroupAddComponent} from "@layout/users/group-add/group-add.component";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
    // canActivate: [NgxPermissionsGuard],
    // data: {
    //   permissions: {
    //     only: ['superadmin', 'manager'],
    //     redirectTo: '/'
    //   }
    // }
  },
  {
    path: 'list',
    component: ListUsersComponent,
    // canActivate: [NgxPermissionsGuard],
    // data: {
    //   permissions: {
    //     only: ['superadmin', 'manager'],
    //     redirectTo: '/'
    //   }
    // }
  },
  {
    path: 'trombi',
    component: TrombiComponent,
    // canActivate: [NgxPermissionsGuard],
    // data: {
    //   permissions: {
    //     only: ['superadmin', 'manager'],
    //     redirectTo: '/'
    //   }
    // }
  },
  {
    path: 'new',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'simple'
      },
      {
        path: 'simple',
        component: SimpleAddComponent,
      },
      {
        path: 'independent',
        component: IndependentAddComponent,
      },
      {
        path: 'group',
        component: GroupAddComponent,
      },
    ]
    // canActivate: [NgxPermissionsGuard],
    // data: {
    //   permissions: {
    //     only: ['superadmin'],
    //     redirectTo: '/'
    //   }
    // }
  },
  // {
  //   path: 'add_collab',
  //   component: InfoFormComponent,
    // canActivate: [NgxPermissionsGuard],
    // data: {
    //   permissions: {
    //     only: ['superadmin'],
    //     redirectTo: '/'
    //   }
    // }
  // },
  // {
  //   path: 'info/:id',
  //   component: InfoFormComponent,
    // canActivate: [NgxPermissionsGuard],
    // data: {
    //   permissions: {
    //     only: ['superadmin'],
    //     redirectTo: '/'
    //   }
    // }
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule {}
