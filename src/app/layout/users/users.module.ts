import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users/list-users.component';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AddUserComponent } from './add-user/add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {UpdateUserComponent} from '@layout/users/update-user/update-user.component';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        UsersRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        NgSelectModule,
    ],
  declarations: [ListUsersComponent, AddUserComponent, UpdateUserComponent]
})
export class UsersModule { }
