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
import {AbsenceListValidationComponent} from "@layout/activity/absence-list-validation/absence-list-validation.component";
import {ImportSoldsAbsComponent} from "@layout/activity/import-solds-abs/import-solds-abs.component";
import {AdminSoldsAbsComponent} from "@layout/activity/admin-solds-abs/admin-solds-abs.component";
import {ImportAbsenceComponent} from "@layout/activity/import-absence/import-absence.component";
import {ClotureMoisCourantComponent} from "@layout/activity/cloture-mois-courant/cloture-mois-courant.component";
import {DelegationListComponent} from "@layout/activity/delegation-list/delegation-list.component";
import {DelegationCreationComponent} from "@layout/activity/delegation-creation/delegation-creation.component";
import {AvanceModificationComponent} from "@layout/activity/avance-modification/avance-modification.component";
import {EntiteGuard} from "@app/core/guards/entite-guard.service";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'my_activities', //list for admin
    canActivate: [EntiteGuard]
  },
  {
    path: '',
    canActivate: [EntiteGuard],
    children: [
      {
        path: '',
        canActivate: [EntiteGuard],
        pathMatch: 'full',
        redirectTo: 'my_activities'  //list for admin
      },
      {
        path: 'list',
        canActivate: [EntiteGuard],
        component: ActivityListComponent
      },
      {
        path: 'annulation_diffusion',
        canActivate: [EntiteGuard],
        component: ActivityAnnulationDiffusionComponent
      },
      {
        path: 'impression',
        canActivate: [EntiteGuard],
        component: ActivityImpressionComponent
      },
      {
        path: 'update/:id',
        canActivate: [EntiteGuard],
        component: ActivityUpdateComponent
      },
      {
        path: 'my_activities',
        canActivate: [EntiteGuard],
        component: ActivityUpdateComponent
      },
      {
        path: 'history',
        canActivate: [EntiteGuard],
        component: ActivityHistoryComponent
      },
    ],
  },
  {
    path: 'avance',
    canActivate: [EntiteGuard],
    children: [
      {
        path: '',
        canActivate: [EntiteGuard],
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        canActivate: [EntiteGuard],
        component: AvanceListComponent
      },
      {
        path: 'creation',
        canActivate: [EntiteGuard],
        component: AvanceCreationComponent
      },
      {
        path: 'modification/:id',
        canActivate: [EntiteGuard],
        component: AvanceModificationComponent
      },
    ],
  },
  {
    path: 'conge',
    canActivate: [EntiteGuard],
    children: [
      {
        path: '',
        canActivate: [EntiteGuard],
        pathMatch: 'full',
        redirectTo: 'history',
      },
      {
        path: 'demande',
        canActivate: [EntiteGuard],
        component: CongeDemandeComponent
      },
      {
        path: 'history',
        canActivate: [EntiteGuard],
        component: CongeHistoryComponent
      },
    ],
  },
  {
    path: 'mes_frais',
    canActivate: [EntiteGuard],
    children: [
      {
        path: '',
        canActivate: [EntiteGuard],
        pathMatch: 'full',
        redirectTo: 'history',
      },
      {
        path: 'saisie',
        canActivate: [EntiteGuard],
        component: FraisSaisieComponent
      },
      {
        path: 'history',
        canActivate: [EntiteGuard],
        component: ActivityHistoryComponent
      },
    ],
  },
  {
    path: 'absence',
    canActivate: [EntiteGuard],
    children: [
      {
        path: '',
        canActivate: [EntiteGuard],
        pathMatch: 'full',
        redirectTo: 'list_visualisation',
      },
      {
        path: 'creation',
        canActivate: [EntiteGuard],
        component: AbsenceDemandeComponent
      },
      {
        path: 'list_visualisation',
        canActivate: [EntiteGuard],
        component: AbsenceListVisualisationComponent
      },
      {
        path: 'List_validation',
        canActivate: [EntiteGuard],
        component: AbsenceListValidationComponent
      },
      {
        path: 'import_soldes_abs',
        canActivate: [EntiteGuard],
        component: ImportSoldsAbsComponent
      },
      {
        path: 'admin_soldes_abs',
        canActivate: [EntiteGuard],
        component: AdminSoldsAbsComponent
      },
      {
        path: 'import_absences',
        canActivate: [EntiteGuard],
        component: ImportAbsenceComponent
      },
    ],
  },
  {
    path: 'cloture',
    canActivate: [EntiteGuard],
    children: [
      {
        path: '',
        canActivate: [EntiteGuard],
        pathMatch: 'full',
        redirectTo: 'courant'
      },
      {
        path: 'courant',
        canActivate: [EntiteGuard],
        component: ClotureMoisCourantComponent
      }
    ]
  },
  {
    path: 'delegation',
    canActivate: [EntiteGuard],
    children: [
      {
        path: '',
        canActivate: [EntiteGuard],
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        canActivate: [EntiteGuard],
        component: DelegationListComponent
      },
      {
        path: 'creation',
        canActivate: [EntiteGuard],
        component: DelegationCreationComponent
      }
    ]
  },
  {
    path: 'frais',
    canActivate: [EntiteGuard],
    children: [
      {
        path: '',
        canActivate: [EntiteGuard],
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        canActivate: [EntiteGuard],
        component: FraisListComponent
      },
      {
        path: 'ticket_restaurant',
        canActivate: [EntiteGuard],
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
