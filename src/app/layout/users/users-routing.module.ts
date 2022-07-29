import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUsersComponent } from './list-users/list-users.component';
import {TrombiComponent} from "@layout/users/trombi/trombi.component";
import {SimpleAddStepperComponent} from "@layout/users/simple-add-stepper/simple-add-stepper.component";
import {IndependentAddStepperComponent} from "@layout/users/independent-add-stepper/independent-add-stepper.component";
import {GroupAddStepperComponent} from "@layout/users/group-add-stepper/group-add-stepper.component";


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
    // component: ListUsersComponent,
    // canActivate: [NgxPermissionsGuard],
    // data: {
    //   permissions: {
    //     only: ['superadmin', 'manager'],
    //     redirectTo: '/'
    //   }
    // }
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'general'
      },
      {
        path: ':type',
        component: ListUsersComponent,
      },
      // {
      //   path: 'general',
      //   component: ListUsersComponent,
      // },
      // {
      //   path: 'period_essai',
      //   component: ListUsersComponent,
      // },
      // {
      //   path: 'entretien',
      //   component: ListUsersComponent,
      // },
      // {
      //   path: 'formation',
      //   component: ListUsersComponent,
      // },
      // {
      //   path: 'visite_medicale',
      //   component: ListUsersComponent,
      // },
    ]
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
        component: SimpleAddStepperComponent,
      },
      {
        path: 'independant',
        component: IndependentAddStepperComponent,
      },
      {
        path: 'group',
        component: GroupAddStepperComponent,
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
