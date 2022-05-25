import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ErrorService, UserService } from '@app/core/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  returnUrl: string;
  resetToken: string;
  email: string;
  loading = false;
  myForm: FormGroup;
  errors = [];

  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      passwords: this.fb.group(
        {
          password: ['', Validators.compose([Validators.required])],
          confirm_password: ['', Validators.compose([Validators.required])],
        },
        { validator: this.passwordConfirming }
      ),
      resetToken: [null, Validators.compose([Validators.required])],
    });

    this.route.params.subscribe((params) => {
      this.resetToken = params['token'];
      this.email = params['email'];
      this.myForm = this.fb.group({
        passwords: this.fb.group(
          {
            password: ['', Validators.compose([Validators.required])],
            confirm_password: ['', Validators.compose([Validators.required])],
          },
          { validator: this.passwordConfirming }
        ),
        resetToken: [
          this.resetToken,
          Validators.compose([Validators.required]),
        ],
      });
    });
    console.log('this.myForm', this.myForm, this.password);

  }

  async onSubmit() {
    console.log('onSubmit', this.myForm);
    this.myForm.markAllAsTouched();
    if (!this.myForm.valid) {
      return;
    }
    this.loading = true;
    const submitted = {
      password: this.myForm.value.passwords.password,
      confirm_password: this.myForm.value.passwords.confirm_password,
      token: this.myForm.value.resetToken,
      email: this.email,
    };
    try {
      console.log('submitted', submitted);
      const data = await this.userService.resetPwd(submitted).toPromise();
      // this.messageService.add({severity:'success', summary: 'Succès',
      //   detail: 'Mot de passe réinitialisé avec succès', sticky: true});
      Swal.fire({
        title: 'Succès',
        text: 'Mot de passe réinitialisé avec succès',
        icon: 'success',
        heightAuto: false,
      });
      await this.router.navigate(['/auth/signin']);
    } catch (err) {
      Object.keys(err.error.errors).map((key: any) => {
        this.errors.push(key + ' : ' + err.error.errors[key]);
        this.messageService.add({
          severity: 'error',
          summary: 'Echec',
          detail: err.error.errors[key],
          sticky: true,
        });
      });
    } finally {
      this.loading = false;
    }
  }

  passwordConfirming(c: AbstractControl): { passwordMismatch: boolean } {
    if (
      c.get('password').value !== c.get('confirm_password').value &&
      c.get('confirm_password').value !== null
    ) {
      return { passwordMismatch: true };
    }
  }

  get confirm_password() {
    return this.myForm.get('passwords').get('confirm_password');
  }

  get password() {
    return this.myForm.get('passwords').get('password');
  }

  get passwords() {
    return this.myForm.get('passwords');
  }
}
