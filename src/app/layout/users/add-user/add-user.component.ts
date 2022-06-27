import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatStepper} from "@angular/material/stepper";
import {timeout} from "rxjs";



@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') private myStepper: MatStepper;
  isEditable = true;
  profile_id: number;
  constructor(
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private userService : UserService
  ) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.activatedRoute?.queryParams?.subscribe(params => {
      console.log(' this.activatedRoute', params, this.myStepper);
      if(typeof params.step !== 'undefined'  && this.myStepper){
        this.move(Number(params.step));
      }
    })
  }

  move(index: number) {
    // if(this.myStepper){
    // setTimeout(() => {
    //   console.log('move', index);
    //   this.myStepper.selectedIndex = index;
    //   console.log('moving to', this.myStepper.selectedIndex, index);
    // });
    // while(this.myStepper.selectedIndex < index){
    //   setTimeout(() => {
    //     this.myStepper.next();
    //   }, 10)
    // }
    console.log('this.myStepper.selectedIndex', this.myStepper.selectedIndex);
    // }
  }


  moveForward() {
    if(this.myStepper){
      console.log('moveForward');
      this.myStepper.next();
    }
  }

  moveBackward( ) {
    if(this.myStepper) {
      console.log('moveBackward');
      this.myStepper.previous();
    }
  }

  async submitUser($event: any) {
    try{
      const res = await this.userService.submitUser($event).toPromise();
      this.moveForward();
    }catch (e){

    }finally {

    }
  }

  async submitPerimeters($event: any) {
    try{
      const res = await this.userService.submitPerimeters($event).toPromise();
      this.moveForward();
    }catch (e){

    }finally {

    }
  }

  async submitAccess($event: any) {
    try{
      const res = await this.userService.submitAccess($event).toPromise();
      this.moveForward();
    }catch (e){

    }finally {

    }
  }

  submitRole($event: any) {
    this.profile_id = $event;
    this.moveForward();
  }
}

