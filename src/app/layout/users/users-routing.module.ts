import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuiviSalariesComponent } from './suivi-salaries/suivi-salaries.component';
import {TrombiComponent} from "@layout/users/trombi/trombi.component";
import {SimpleAddStepperComponent} from "@layout/users/simple-add-stepper/simple-add-stepper.component";
import {IndependentAddStepperComponent} from "@layout/users/independent-add-stepper/independent-add-stepper.component";
import {GroupAddStepperComponent} from "@layout/users/group-add-stepper/group-add-stepper.component";
import {UniqueEntiteGuard} from "@app/core/guards/unique-entite-guard.service";
import {EntiteGuard} from "@app/core/guards/entite-guard.service";
import {AdvancedAddStepperComponent} from "@layout/users/advanced-add-stepper/advanced-add-stepper.component";
import {UserBasicFormComponent} from "@layout/users/user-basic-form/user-basic-form.component";
import {ListUsersComponent} from "@layout/users/list-users/list-users.component";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'suivi',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'entree'
      },
      {
        path: ':type',
        component: SuiviSalariesComponent,
      },
    ]
  },
  {
    path: 'list',
    component: ListUsersComponent,
  },
  {
    path: 'trombi',
    component: TrombiComponent,
  },
  {
    path: 'new',
    canActivate: [UniqueEntiteGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'basic'
      },
      {
        path: 'simple',
        component: SimpleAddStepperComponent,
      },
      {
        path: 'independent',
        component: IndependentAddStepperComponent,
      },
      {
        path: 'group',
        component: GroupAddStepperComponent,
      },
      {
        path: 'basic/:id',
        component: UserBasicFormComponent,
      },
      {
        path: 'basic',
        component: UserBasicFormComponent,
      }
    ]
  },
  {
    path: 'details',
    canActivate: [UniqueEntiteGuard],
    component: AdvancedAddStepperComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule {}
