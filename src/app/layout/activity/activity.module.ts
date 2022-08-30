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
import {NgSelectModule} from "@ng-select/ng-select";
import {OwlDateTimeModule} from "ng-pick-datetime";
import {SharedModule} from "@shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MatTooltipModule} from "@angular/material/tooltip";
import { DatepickerModule } from 'ng2-datepicker';
import {DpDatePickerModule} from 'ng2-date-picker';
import {ActivityAnnulationDiffusionComponent} from "@layout/activity/activity-annulation_diffusion/activity-annulation-diffusion.component";
import {ActivityImpressionComponent} from "@layout/activity/activity-impression/activity-impression.component";
import {FraisListComponent} from "@layout/activity/frais-list/frais-list.component";
import {FraisTicketRestaurantComponent} from "@layout/activity/frais-ticket-restaurant/frais-ticket-restaurant.component";
import {AbsenceDemandeComponent} from "@layout/activity/absence-demande/absence-demande.component";
import {AbsenceListVisualisationComponent} from "@layout/activity/absence-list-visualisation/absence-list-visualisation.component";
import {AbsenceListValidationComponent} from "@layout/activity/absence-list-validation/absence-list-validation.component";
import {ImportSoldsAbsComponent} from "@layout/activity/import-solds-abs/import-solds-abs.component";
import {AdminSoldsAbsComponent} from "@layout/activity/admin-solds-abs/admin-solds-abs.component";



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
    FraisHistoryComponent,
    ActivityAnnulationDiffusionComponent,
    ActivityImpressionComponent,
    FraisListComponent,
    FraisTicketRestaurantComponent,
    AbsenceDemandeComponent,
    AbsenceListVisualisationComponent,
    AbsenceListValidationComponent,
    ImportSoldsAbsComponent,
    AdminSoldsAbsComponent,
  ],
  imports: [
    CommonModule,
    ActivityRoutingModule,
    NgSelectModule,
    OwlDateTimeModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    MatTooltipModule,
    DatepickerModule,
    DpDatePickerModule
  ]
})
export class ActivityModule { }
