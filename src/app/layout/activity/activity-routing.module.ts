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
import {ActivityAnnulationDiffusionComponent} from "@layout/activity/activity-annulation_diffusion/activity-annulation-diffusion.component";
import {ActivityImpressionComponent} from "@layout/activity/activity-impression/activity-impression.component";
import {FraisListComponent} from "@layout/activity/frais-list/frais-list.component";
import {FraisTicketRestaurantComponent} from "@layout/activity/frais-ticket-restaurant/frais-ticket-restaurant.component";
import {AbsenceDemandeComponent} from "@layout/activity/absence-demande/absence-demande.component";
import {AbsenceListVisualisationComponent} from "@layout/activity/absence-list-visualisation/absence-list-visualisation.component";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'my_activities' //list for admin
  },
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'my_activities'  //list for admin
      },
      {
        path: 'list',
        component: ActivityListComponent
      },
      {
        path: 'annulation_diffusion',
        component: ActivityAnnulationDiffusionComponent
      },
      {
        path: 'impression',
        component: ActivityImpressionComponent
      },
      {
        path: 'update/:id',
        component: ActivityUpdateComponent
      },
      {
        path: 'my_activities',
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
    path: 'mes_frais',
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
  },
  {
    path: 'absence',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'creation',
        component: AbsenceDemandeComponent
      },
      {
        path: 'list_visualisation',
        component: AbsenceListVisualisationComponent
      },
      {
        path: 'List_validation',
        component: FraisTicketRestaurantComponent
      },
      {
        path: 'list_visualisation',
        component: FraisTicketRestaurantComponent
      },
      {
        path: 'ticket_restaurant',
        component: FraisTicketRestaurantComponent
      },
      {
        path: 'import_soldes_abs',
        component: FraisTicketRestaurantComponent
      },
      {
        path: 'admin_soldes_abs',
        component: FraisTicketRestaurantComponent
      },
      {
        path: 'import_absences',
        component: FraisTicketRestaurantComponent
      },
    ],
  },
  {
    path: 'frais',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: FraisListComponent
      },
      {
        path: 'ticket_restaurant',
        component: FraisTicketRestaurantComponent
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule { }
