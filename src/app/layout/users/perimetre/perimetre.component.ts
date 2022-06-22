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
import {Subscription} from "rxjs";



@Component({
  selector: 'app-perimetre',
  templateUrl: './perimetre.component.html',
  styleUrls: ['./perimetre.component.scss']
})
export class PerimetreComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  users: User[] = [];
  keyword = '';
  searchSubscription: Subscription;
  pagesize = 10;

  pagination: {
    limit: number,
    page: number,
  }

  constructor(private userService : UserService,) {
    this.pagination = {
      limit: this.pagesize,
      page: 1
    }
  }



  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    this.searchSubscription = this.userService.getUsers({keywords: this.keyword, ...this.pagination}).subscribe((result) => {
      this.users = result.data.data;
      console.log('this.users', this.users);
    }, err =>{
      console.log('err getUsers', err);
    })
  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }

  onScroll() {
    console.log('scrooool');
    this.pagination.limit = this.pagination.limit + this.pagesize;
    this.getUsers();
  }
}

