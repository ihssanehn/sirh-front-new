import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UniqueEntiteGuard} from "@app/core/guards/unique-entite-guard.service";
import {CreationStepperComponent} from "@layout/project/creation-stepper/creation-stepper.component";
import {ProjectListComponent} from "@layout/project/project-list/project-list.component";
import {FinMissionListComponent} from "@layout/project/fin-mission-list/fin-mission-list.component";
import {RegularisationListComponent} from "@layout/project/regularisation-list/regularisation-list.component";

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
    path: 'fin_mission',
    component: FinMissionListComponent,
  },
  {
    path: 'regularisation',
    component: RegularisationListComponent,
  },
  {
    path: 'creation',
    component: CreationStepperComponent,
    canActivate: [UniqueEntiteGuard]
  },
  {
    path: 'modification/:id',
    component: CreationStepperComponent,
    canActivate: [UniqueEntiteGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
