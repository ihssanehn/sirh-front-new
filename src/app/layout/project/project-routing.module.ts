import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListUsersComponent} from "@layout/users/list-users/list-users.component";
import {TrombiComponent} from "@layout/users/trombi/trombi.component";
import {UniqueEntiteGuard} from "@app/core/guards/unique-entite-guard.service";
import {SimpleAddStepperComponent} from "@layout/users/simple-add-stepper/simple-add-stepper.component";
import {IndependentAddStepperComponent} from "@layout/users/independent-add-stepper/independent-add-stepper.component";
import {GroupAddStepperComponent} from "@layout/users/group-add-stepper/group-add-stepper.component";
import {CreationStepperComponent} from "@layout/project/creation-stepper/creation-stepper.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: ListUsersComponent,
  },
  {
    path: 'creation',
    component: CreationStepperComponent,
    canActivate: [UniqueEntiteGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
