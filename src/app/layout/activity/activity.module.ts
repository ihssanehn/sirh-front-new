import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityRoutingModule } from './activity-routing.module';
import { ActivityHistoryComponent } from './activity-history/activity-history.component';
import { ActivityUpdateComponent } from './activity-update/activity-update.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { AvanceListComponent } from './avance-list/avance-list.component';
import { AvanceCreationComponent } from './avance-creation/avance-creation.component';
import { CongeDemandeComponent } from './conge-demande/conge-demande.component';
import { CongeHistoryComponent } from './conge-history/conge-history.component';
import { FraisSaisieComponent } from './frais-saisie/frais-saisie.component';
import { FraisHistoryComponent } from './frais-history/frais-history.component';


@NgModule({
  declarations: [
    ActivityHistoryComponent,
    ActivityUpdateComponent,
    ActivityListComponent,
    AvanceListComponent,
    AvanceCreationComponent,
    CongeDemandeComponent,
    CongeHistoryComponent,
    FraisSaisieComponent,
    FraisHistoryComponent
  ],
  imports: [
    CommonModule,
    ActivityRoutingModule
  ]
})
export class ActivityModule { }
