import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService, ErrorService } from '@app/core/services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  loading: boolean = false;
  errors: Array<any> = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private errorService: ErrorService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initFormBuilder();
  }

  initFormBuilder() {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
    });
  }

  async onSubmit() {
    this.myForm.markAllAsTouched();
    if(!this.myForm.valid) return;

    const credentials = this.myForm.value;
    try{
      this.loading = true;
      const res = await this.userService.signin(credentials).toPromise();
      console.log('user', res);
      this.router.navigate(['/users/suivi/entree']);
    }catch (err){
      console.log('err login', err);
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: "Erreur d'authentification",
        detail:
          'Utilisateur non reconnu. Veuillez vérifier votre adresse mail et mot de passe et prendre contact avec le support technique si besoin.',
        sticky: false,
      });
    }finally {
      this.loading = false;
    }

  }

  get email() {
    return this.myForm.get('email');
  }

  get password() {
    return this.myForm.get('password');
  }
}
