import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ErrorRoutes } from './error.routing';

import { Error4Component } from './error4/error4.component';
import { Error5Component } from './error5/error5.component';
import { Error503Component } from './error503/error503.component';
import { Error429Component } from './error429/error429.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(ErrorRoutes)
  ],
  declarations: [Error4Component, Error5Component, Error503Component, Error429Component]
})

export class ErrorModule {}
