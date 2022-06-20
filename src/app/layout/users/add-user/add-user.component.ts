import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatStepper} from "@angular/material/stepper";



@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') private myStepper: MatStepper;
  firstFormGroup = this.formBuilder.group({
    firstCtrl: [''],
  });
  secondFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = true;
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
    this.move(2);
  }

  move(index: number) {
    if(this.myStepper){
      this.myStepper.selectedIndex = index;
    }
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
}

