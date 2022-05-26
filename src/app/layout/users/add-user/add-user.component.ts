import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorService, UserService } from '@services/index';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import {SharedClasses} from '@shared/Utils/SharedClasses';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  userFormGroup: FormGroup;
  errors : Array<any> = [];


  constructor(private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private userService : UserService) { }

  ngOnInit(){
    this.initFormBuilder();
  }

  initFormBuilder(){
    this.userFormGroup = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: [''],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submitUser(){
    this.errors = [];
    this.userService.addUser(this.userFormGroup.value).toPromise().then((val) => {
      this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }).catch( err => {
      this.errors = this.errorService.format(err);
    })
  }

  goback() {
    this.location.back();
  }

  isRequired(control) {
    return SharedClasses.isControlRequired(control);
  }
}
