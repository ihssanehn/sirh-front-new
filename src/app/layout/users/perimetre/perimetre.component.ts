import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {markFormAsDirty, SharedClasses} from '@shared/Utils/SharedClasses';
import {Location} from '@angular/common';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {User} from "@app/core/entities";
import * as moment from "moment";
import { NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ImageCropperComponent} from "@shared/components/image-cropper/image-cropper.component";



@Component({
  selector: 'app-perimetre',
  templateUrl: './perimetre.component.html',
  styleUrls: ['./perimetre.component.scss']
})
export class PerimetreComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }
}

