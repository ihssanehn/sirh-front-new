import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListUsersComponent} from "@layout/users/list-users/list-users.component";
import {UniqueEntiteGuard} from "@app/core/guards/unique-entite-guard.service";
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
