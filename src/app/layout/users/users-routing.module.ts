import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUserComponent } from './add-user/add-user.component';


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
    path: 'new',
    component: AddUserComponent,
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
