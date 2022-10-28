import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UniqueEntiteGuard} from "@app/core/guards/unique-entite-guard.service";
import {CreationStepperComponent} from "@layout/project/creation-stepper/creation-stepper.component";
import {ProjectListComponent} from "@layout/project/project-list/project-list.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'liste'
  },
  {
    path: 'liste',
    component: ProjectListComponent,
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
