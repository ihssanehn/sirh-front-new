import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import {CreationStepperComponent} from "@layout/project/creation-stepper/creation-stepper.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "@shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {OwlDateTimeModule} from "ng-pick-datetime";
import {MatStepperModule} from "@angular/material/stepper";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {MatTooltipModule} from "@angular/material/tooltip";
import { CreationGeneralComponent } from './creation-general/creation-general.component';
import { CreationClientComponent } from './creation-client/creation-client.component';
import { CreationLieuInterventionComponent } from './creation-lieu-intervention/creation-lieu-intervention.component';
import { CreationPointageComponent } from './creation-pointage/creation-pointage.component';
import { CreationFraisComponent } from './creation-frais/creation-frais.component';
import { CreationStatsComponent } from './creation-stats/creation-stats.component';
import { CreationSecuriteComponent } from './creation-securite/creation-securite.component';
import { CreationPiecesJointesComponent } from './creation-pieces-jointes/creation-pieces-jointes.component';
import {ProjectListComponent} from "@layout/project/project-list/project-list.component";
import {DpDatePickerModule} from "ng2-date-picker";
import {NgxFileDropModule} from "ngx-file-drop";
import {FinMissionListComponent} from "@layout/project/fin-mission-list/fin-mission-list.component";


@NgModule({
  declarations: [
    CreationStepperComponent,
    CreationGeneralComponent,
    CreationClientComponent,
    CreationLieuInterventionComponent,
    CreationPointageComponent,
    CreationFraisComponent,
    CreationStatsComponent,
    CreationSecuriteComponent,
    CreationPiecesJointesComponent,
    ProjectListComponent,
    FinMissionListComponent,
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    OwlDateTimeModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    InfiniteScrollModule,
    MatTooltipModule,
    DpDatePickerModule,
    NgxFileDropModule
  ]
})
export class ProjectModule { }
