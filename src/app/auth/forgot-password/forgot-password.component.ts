import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import { Router } from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  myForm: FormGroup;
  loading: boolean = false;
  errors : Array<any> = [];
  message : string = null;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private messageService: MessageService,
              private errorsService: ErrorService,
              private translate: TranslateService,
              private router: Router) {}

  ngOnInit() {
    this.initFormBuilder();
  }

  initFormBuilder(){
    this.myForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required])
    });
  }
  
  onSubmit(){
    this.loading = true;
    const credentials = this.myForm.value;
    this.userService.changePwdRequest(credentials).toPromise().then( val => {
      this.message = val.message;
      this.loading = false;
      this.messageService.add({severity:'info', summary: 'Email envoyé',
        detail: this.translate.instant('CHECK YOUR EMAIL BOX TO RESET YOUR PASSWORD'), sticky: true});
    }).catch( err => {      
      this.loading = false;
      this.errors = [];
      Object.keys(err.error.errors).map((key: any) => {
          this.errors.push(key + ' : ' + err.error.errors[key]);
        this.messageService.add({severity:'error', summary: 'Echec', detail:  err.error.errors[key], sticky: true});
      });
    })      
  }
}
