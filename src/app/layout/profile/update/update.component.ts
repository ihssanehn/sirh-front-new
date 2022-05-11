import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService, ErrorService } from '@services/index';
import {UserStore} from '@store/user.store';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  profileFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  profile_errors : Array<any> = [];
  pwd_errors : Array<any> = [];

  constructor(private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private userService : UserService,
              public userStore : UserStore,
              private messageService : MessageService
              ) { }

  ngOnInit(){
    // this.loggedUser = this.userService.getCurrentUser();
    this.initFormBuilder();
  }

  initFormBuilder(){
    this.profileFormGroup = this.formBuilder.group({
      firstname: [this.userStore.getAuthenticatedUser?.firstname, Validators.required],
      lastname: [this.userStore.getAuthenticatedUser?.lastname, Validators.required],
      phone: [this.userStore.getAuthenticatedUser?.phone],
    });
    this.passwordFormGroup = this.formBuilder.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
  }

  submitProfile(){
    this.profile_errors = [];
    this.userService.updateProfile(this.profileFormGroup.value).toPromise().then((val) => {
      this.messageService.add({severity:'success', summary: 'Succès',
        detail: 'Profil mis à jour avec succès', sticky: false});

    }).catch( err => {
      this.profile_errors = this.errorService.format(err);
      this.messageService.add({severity:'error', summary: 'Echec', detail: 'Echec de mise à jour du profil', sticky: false});
    })
  }

  submitPassword(){
    this.pwd_errors = [];
    this.userService.updateProfilePassword(this.passwordFormGroup.value).toPromise().then((val) => {
      window.location.reload();
      this.messageService.add({severity:'success', summary: 'Succès',
        detail: 'Mot de passe mis à jour avec succès', sticky: false});

    }).catch( err => {
      this.pwd_errors = this.errorService.format(err);
      this.messageService.add({severity:'error', summary: 'Echec', detail: 'Echec de mise à jour du mot de passe', sticky: false});

    })
  }

}
