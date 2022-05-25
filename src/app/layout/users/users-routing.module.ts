import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUsersComponent } from './list-users/list-users.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AddUserComponent } from './add-user/add-user.component';
import {UpdateUserComponent} from '@layout/users/update-user/update-user.component';

const routes: Routes = [
  {
    path: '',
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
    path: 'add',
    component: AddUserComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['superadmin'],
        redirectTo: '/'
      }
    }
  },
  {
    path: 'update/:id',
    component: UpdateUserComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['superadmin'],
        redirectTo: '/'
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule {}
