import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '@entities/user';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {SharedClasses} from '@shared/Utils/SharedClasses';
import {Location} from '@angular/common';
import {$userRoles} from '@shared/Objects/sharedObjects';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  userFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  errors : Array<any> = [];
  $userRoles = $userRoles;
  allRoles = [
      'manager', 'superadmin', 'user'
  ];
   loading: boolean;
   errorLoading: boolean;
   submitting: boolean;
  submittingPassword: boolean;

  constructor(private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private router: Router,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private translate: TranslateService,
              private userService : UserService) {

    this.noWhitespaceValidator.bind(this);
    this.userFormGroup = this.formBuilder.group({
      id: [null, Validators.required],
      firstname: [null, [Validators.required, this.noWhitespaceValidator]],
      lastname: [null, [Validators.required, , this.noWhitespaceValidator]],
      phone: [null],
      email: [null, [Validators.required, this.noWhitespaceValidator]],
      role: [null, [Validators.required, , this.noWhitespaceValidator]]
    });

    this.passwordFormGroup = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirm_password: [null, [Validators.required, Validators.minLength(6)]],
    }, {validator: this.passwordConfirming});
  }

  ngOnInit(){
    this.getUser(this.activatedRoute.snapshot.params.id);
  }

  async getUser(id) {
    this.loading = true;
    this.errorLoading = false;
    const params = {
      id: id,
    };

    try {
      const res = await this.userService.getOne(params).toPromise();
      console.log('getUser', res);
      const user = res.result.data;
      try{
        this.initFormBuilder(user);
      }catch(err1){
        console.log('err1', err1);
        this.messageService.add({severity: 'error', summary: this.translate.instant('FAILURE!'), detail: 'Erreur de récupération de données'});
      }
    } catch (error) {
      console.log('e', error);
      this.errorLoading = true;
      this.messageService.add({severity: 'error', summary: this.translate.instant('FAILURE!'), detail: 'Une erreur est survenue lors de la réccupération des donnnées de ccet utilisateur',  sticky: false});
    } finally {
      this.loading = false;
    }
  }

  initFormBuilder(user: User){
     this.userFormGroup.patchValue({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      role: user.role
    });
  }

  // submit(){
  //   this.errors = [];
  //   this.userService.update(this.userFormGroup.value).toPromise().then((val) => {
  //     this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  //   }).catch( err => {
  //     this.errors = this.errorService.format(err);
  //   })
  // }


  async submit() {
    Object.keys(this.userFormGroup.controls).forEach(key => {
      this.userFormGroup.get(key).markAsDirty();
    });
    if(!this.userFormGroup.valid ){
      return;
    }
    let toSubmit = this.userFormGroup.value;

    this.submitting = true;
    try {
      const result = await this.userService.update(toSubmit).toPromise();
      if (result) {
        this.getUser(this.userFormGroup.value.id);
        this.messageService.add({severity: 'success', summary: 'Succès',
          detail: 'Utilisateur mis à jour avec succès', sticky: false});
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log('e', error);
      this.messageService.add({severity: 'error', summary: this.translate.instant('FAILURE!'), detail: 'Erreur de mise à jour des informations de cet utilisateur',  sticky: false});
    } finally {
      this.submitting = false;
    }
  }


  async submitChangePassword() {
    Object.keys(this.passwordFormGroup.controls).forEach(key => {
      this.passwordFormGroup.get(key).markAsDirty();
    });
    if(!this.passwordFormGroup.valid ){
      return;
    }
    let toSubmit = this.passwordFormGroup.value;
    toSubmit.id = this.userFormGroup.value.id;

    this.submittingPassword = true;
    try {
      const result = await this.userService.update(toSubmit).toPromise();
      if (result) {
        this.getUser(this.userFormGroup.value.id);
        this.messageService.add({severity: 'success', summary: 'Succès',
          detail: 'Mot de passe mis à jour avec succès', sticky: false});
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log('e', error);
      this.messageService.add({severity: 'error', summary: this.translate.instant('FAILURE!'), detail: 'Erreur de mise à jour du mot de passe de cet utilisateur',  sticky: false});
    } finally {
      this.submittingPassword = false;
      this.passwordFormGroup.reset();
    }
  }


  isRequired(control) {
    return SharedClasses.isControlRequired(control);
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
  }

  goback() {
    this.location.back();
  }

  passwordConfirming(c: AbstractControl): { passwordMismatch: boolean } {
    if (c.get('password').value !== c.get('confirm_password').value
        && c.get('confirm_password').value !== null) {
      console.log('passwordMismatch');
      return {passwordMismatch: true};
    }
  }
}
