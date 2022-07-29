import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users/list-users.component';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AddUserComponent } from './add-user/add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import { NgbModule} from "@ng-bootstrap/ng-bootstrap";
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
    MatTooltipModule
  ],
  declarations: [
    ListUsersComponent,
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
    ParametreIndependantFormComponent
  ],
  entryComponents: [
    ModalPerimetreUsersComponent,
    ModalPeriodeEssaiComponent,
    ModalDocrhItemComponent,
    ModalDocumentrhFilesComponent,
    GeneralIndependantFormComponent,
    CoutIndependantFormComponent,
    ParametreIndependantFormComponent
  ]
})
export class UsersModule { }
