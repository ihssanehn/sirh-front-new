import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PasswordBannerComponent } from './password-banner/password-banner.component';
import { SafePipe, DefaultDateFormatPipe, TimeAgoPipe } from '@app/core/pipes';
import { FloatingComponent } from './floating/floating.component';
import {SidebareMenuComponent} from '@shared/components/sidebaremenu/sidebareMenu.component';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {GetPhotoPipe} from '@shared/pipes/getPhoto.pipe';
import {CentredMessageComponent} from '@shared/components/centred-message/centred-message.component';
import {ButtonComponent} from '@shared/components/button/button.component';
import {ImageCropperComponent} from "@shared/components/image-cropper/image-cropper.component";
import {ImageCropperModule} from "ngx-image-cropper";
import { LaddaModule } from 'angular2-ladda';
import {PaginationComponent} from "@shared/components/pagination/pagination.component";
import {PaginatePipe} from "@shared/pipes/paginate.pipe";

@NgModule({
  imports: [
    CommonModule,
    NgxPermissionsModule,
    RouterModule,
    TranslateModule,
    LaddaModule.forRoot({
      style: 'zoom-out',
    }),
    ImageCropperModule,
  ],
  declarations: [
    PasswordBannerComponent,
    SafePipe,
    DefaultDateFormatPipe,
    TimeAgoPipe,
    FloatingComponent,
    SidebareMenuComponent,
    GetPhotoPipe,
    CentredMessageComponent,
    ButtonComponent,
    ImageCropperComponent,
    PaginationComponent,
    PaginatePipe
  ],
  exports: [
    NgxPermissionsModule,
    PasswordBannerComponent,
    SafePipe,
    DefaultDateFormatPipe,
    TimeAgoPipe,
    FloatingComponent,
    SidebareMenuComponent,
    GetPhotoPipe,
    CentredMessageComponent,
    ButtonComponent,
    LaddaModule,
    ImageCropperComponent,
    PaginationComponent,
    PaginatePipe
  ],
})
export class SharedModule {}
