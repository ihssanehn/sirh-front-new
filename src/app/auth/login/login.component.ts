import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxPermissionsService } from 'ngx-permissions';
import {MessageService} from 'primeng/api';
import {markFormAsDirty} from '@shared/Utils/SharedClasses';
import {ErrorService, UserService} from "@app/core/services";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  myForm: FormGroup;
  loading: boolean = false;
  errors : Array<any> = [];

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router,
              private errorService: ErrorService,
              private messageService: MessageService,
              private permissionsService : NgxPermissionsService) {}

  ngOnInit(){
    this.initFormBuilder();
  }

  initFormBuilder(){
    this.myForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          // Validators.minLength(6),

          // Validators.maxLength(32)
        ])
      ]
    });
  }

  onSubmit(){
    markFormAsDirty(this.myForm);
    if(!this.myForm.valid) return;
    this.loading = true;
    const credentials = this.myForm.value;
    this.userService.signin(credentials).toPromise().then( user => {
      this.permissionsService.loadPermissions([user.role]);
      this.router.navigate(['/']);
      this.loading = false;
    }).catch( err => {
      this.loading = false;
      this.errors = this.errorService.format(err);
      Object.keys(err.error.errors).map((key: any) => {
        this.messageService.add({severity:'error', summary: 'Erreur d\'authentification', detail:  'Utilisateur non reconnu. Veuillez vérifier votre adresse mail et mot de passe et prendre contact avec le support technique si besoin.', sticky: true});
      });
    })
  }


}
