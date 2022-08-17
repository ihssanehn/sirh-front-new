import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ActivityListComponent} from "@layout/activity/activity-list/activity-list.component";
import {ActivityUpdateComponent} from "@layout/activity/activity-update/activity-update.component";
import {ActivityHistoryComponent} from "@layout/activity/activity-history/activity-history.component";
import {AvanceListComponent} from "@layout/activity/avance-list/avance-list.component";
import {AvanceCreationComponent} from "@layout/activity/avance-creation/avance-creation.component";
import {CongeDemandeComponent} from "@layout/activity/conge-demande/conge-demande.component";
import {CongeHistoryComponent} from "@layout/activity/conge-history/conge-history.component";
import {FraisSaisieComponent} from "@layout/activity/frais-saisie/frais-saisie.component";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: ActivityListComponent
      },
      {
        path: 'update/:id',
        component: ActivityUpdateComponent
      },
      {
        path: 'update',
        component: ActivityUpdateComponent
      },
      {
        path: 'history',
        component: ActivityHistoryComponent
      },
    ],
  },
  {
    path: 'avance',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: AvanceListComponent
      },
      {
        path: 'creation',
        component: AvanceCreationComponent
      },
    ],
  },
  {
    path: 'conge',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'history',
      },
      {
        path: 'demande',
        component: CongeDemandeComponent
      },
      {
        path: 'history',
        component: CongeHistoryComponent
      },
    ],
  },
  {
    path: 'frais',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'history',
      },
      {
        path: 'saisie',
        component: FraisSaisieComponent
      },
      {
        path: 'history',
        component: ActivityHistoryComponent
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule { }
