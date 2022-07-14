import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import {ToastModule} from 'primeng/toast';
import {SharedModule} from '@shared/shared.module';
import {LayoutComponent} from '@layout/layout.component';
import {SidebarModule} from 'ng-sidebar';
import {MatMenuModule} from '@angular/material/menu';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import { AcceilComponent } from './acceil/acceil.component';


@NgModule({
    declarations: [HeaderComponent,
        SidebarComponent,
        HomeComponent,
        LayoutComponent,
        AcceilComponent],
    exports: [
        HeaderComponent,
        SidebarComponent
    ],
    imports: [
        CommonModule,
        ToastModule,
        LayoutRoutingModule,
        SharedModule,
        SidebarModule,
        MatMenuModule,
        TranslateModule,
        MatButtonModule,
        ReactiveFormsModule
    ]
})
export class LayoutModule { }
