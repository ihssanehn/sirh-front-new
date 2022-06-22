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
        InfiniteScrollModule
    ],
  declarations: [
    ListUsersComponent,
    AddUserComponent,
    UserInfoFormComponent,
    SelectRoleComponent,
    PerimetreComponent,
    AccessComponent
  ]
})
export class UsersModule { }
