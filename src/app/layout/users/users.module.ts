import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiviSalariesComponent } from './suivi-salaries/suivi-salaries.component';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AddUserComponent } from './add-user-stepper/add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {OwlDateTimeModule} from "ng-pick-datetime";
import {SelectRoleComponent} from "@layout/users/select-role/select-role.component";
import {PerimetreComponent} from "@layout/users/perimetre/perimetre.component";
import {AccessComponent} from "@layout/users/access/access.component";
import {MatStepperModule} from "@angular/material/stepper";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {UserInfoFormComponent} from "@layout/users/user-info-form/user-info-form.component";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {ModalPerimetreUsersComponent} from "@layout/users/modal-perimetre-users/modal-perimetre-users.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TrombiComponent} from "@layout/users/trombi/trombi.component";
import {GeneralSimpleFormComponent} from "@layout/users/general-simple-form/general-simple-form.component";
import {SimpleAddStepperComponent} from "@layout/users/simple-add-stepper/simple-add-stepper.component";
import {IndependentAddStepperComponent} from "@layout/users/independent-add-stepper/independent-add-stepper.component";
import {GroupAddStepperComponent} from "@layout/users/group-add-stepper/group-add-stepper.component";
import {ModalPeriodeEssaiComponent} from "@layout/users/modal-periode-essai/modal-periode-essai.component";
import {ParametreSimpleFormComponent} from "@layout/users/parametre-simple-form/parametre-simple-form.component";
import {DocrhSimpleFormComponent} from "@layout/users/docrh-simple-form/docrh-simple-form.component";
import {ModalDocrhItemComponent} from "@layout/users/modal-docrh-item/modal-docrh-item.component";
import {ModalDocumentrhFilesComponent} from "@layout/users/modal-documentrh-files/modal-documentrh-files.component";
import {GeneralIndependantFormComponent} from "@layout/users/general-independant-form/general-independant-form.component";
import {CoutIndependantFormComponent} from "@layout/users/cout-independant-form/cout-independant-form.component";
import {ParametreIndependantFormComponent} from "@layout/users/parametre-independant-form/parametre-independant-form.component";
import {AdvancedAddStepperComponent} from "@layout/users/advanced-add-stepper/advanced-add-stepper.component";
import {EntreAdvancedFormComponent} from "@layout/users/entre-advanced-form/entre-advanced-form.component";
import {
  PeriodEssaiAdvancedFormComponent
} from "@layout/users/period-essai-advanced-form/period-essai-advanced-form.component";
import {EntretienAdvancedFormComponent} from "@layout/users/entretien-advanced-form/entretien-advanced-form.component";
import {
  VisiteMedicalAdvancedFormComponent
} from "@layout/users/visite-medical-advanced-form/visite-medical-advanced-form.component";
import {SortieAdvancedFormComponent} from "@layout/users/sortie-advanced-form/sortie-advanced-form.component";
import {MatMenuModule} from "@angular/material/menu";
import { DateMessagePipe } from '@app/shared/pipes/dateMessage.pipe';
import { ModalAddSortieComponent } from './modal-add-sortie/modal-add-sortie.component';
import { ModalAddEntreeComponent } from './modal-add-entree/modal-add-entree.component';
import {ModalAddEntretienComponent} from "@layout/users/modal-add-entretien/modal-add-entretien.component";
import { ModalAddVisiteMedicalComponent } from "@layout/users/modal-add-visite-medical/modal-add-visite-medical.component";
import {DpDatePickerModule} from "ng2-date-picker";
import {UserBasicFormComponent} from "@layout/users/user-basic-form/user-basic-form.component";
import {ListUsersComponent} from "@layout/users/list-users/list-users.component";
import {ModalAddPeriodEssaiComponent} from "@layout/users/modal-add-period-essai/modal-add-period-essai.component";
import { ProfileAdvancedFormComponent } from './profile-advanced-form/profile-advanced-form.component';


@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
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
    MatMenuModule,
    DpDatePickerModule
   ],
  declarations: [
    SuiviSalariesComponent,
    AddUserComponent,
    UserInfoFormComponent,
    SelectRoleComponent,
    PerimetreComponent,
    AccessComponent,
    ModalPerimetreUsersComponent,
    ModalPeriodeEssaiComponent,
    TrombiComponent,
    SimpleAddStepperComponent,
    GroupAddStepperComponent,
    IndependentAddStepperComponent,
    GeneralSimpleFormComponent,
    ParametreSimpleFormComponent,
    DocrhSimpleFormComponent,
    ModalDocrhItemComponent,
    ModalDocumentrhFilesComponent,
    GeneralIndependantFormComponent,
    CoutIndependantFormComponent,
    ParametreIndependantFormComponent,
    AdvancedAddStepperComponent,
    EntreAdvancedFormComponent,
    PeriodEssaiAdvancedFormComponent,
    EntretienAdvancedFormComponent,
    VisiteMedicalAdvancedFormComponent,
    SortieAdvancedFormComponent,
    ModalAddSortieComponent,
    ModalAddEntreeComponent,
    ModalAddEntretienComponent,
    ModalAddVisiteMedicalComponent,
    UserBasicFormComponent,
    ListUsersComponent,
    ModalAddPeriodEssaiComponent,
    ProfileAdvancedFormComponent
  ],
  entryComponents: [
    ModalPerimetreUsersComponent,
    ModalPeriodeEssaiComponent,
    ModalDocrhItemComponent,
    ModalDocumentrhFilesComponent,
    GeneralIndependantFormComponent,
    CoutIndependantFormComponent,
    ParametreIndependantFormComponent,
    ModalAddEntreeComponent,
    ModalAddEntretienComponent,
    ModalAddVisiteMedicalComponent,
    ModalAddPeriodEssaiComponent
  ],
  providers: [
    DateMessagePipe,

  ]
})
export class UsersModule { }
