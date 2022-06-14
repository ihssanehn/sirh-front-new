import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ImageCropperComponent} from "@shared/components/image-cropper/image-cropper.component";



@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  errors : Array<any> = [];
  $userRoles = $userRoles;
  allRoles = [
    'manager', 'superadmin', 'user'
  ];
  submitting: boolean;
  submittingPassword: boolean;
  formInputs = {
    id: 'id',
    nom: 'nom',
    prenom: 'prenom',
    email: 'email'
  }
  user: User;
  situationsfamilles: any;
  status: any;
  fonctionsPersonnels: any;
  categoriesFonctions: any;
  errorLoadData: boolean;
  loadingData: boolean;
  submittingPhoto: boolean;
  photoBase64 = null;
  constructor(private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private router: Router,
              private location: Location,
              private modalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private translate: TranslateService,
              public modal: NgbActiveModal,
              private changeDetectorRef: ChangeDetectorRef,
              private userService : UserService) {

    this.noWhitespaceValidator.bind(this);
    this.userFormGroup = this.formBuilder.group({
      id: [null, Validators.required],
      nom: [null, Validators.required],
      prenom: [null, Validators.required],
      email: [null, Validators.required],
    });

    this.modalService.dismissAll();

    this.passwordFormGroup = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirm_password: [null, [Validators.required, Validators.minLength(6)]],
    }, {validator: this.passwordConfirming});
    this.activatedRoute.params.subscribe(params => {
      console.log('params', params);
    })
  }

  ngOnInit(){
    if(this.activatedRoute.snapshot.params.id){
      this.getUser(this.activatedRoute.snapshot.params.id);
    }
    this.getSituationsfamilles();
    this.getFonctionPersonnel();
    this.getStatus();
    this.getCategoriesFonctions();
    this.changeDetectorRef.detectChanges();
  }

  async getUser(id, initForm=true) {
    try {
      this.loadingData = true;
      this.errorLoadData = false;
      const res = await this.userService.getOne(id).toPromise();
      console.log('getUser', res);
      this.user = res.result;
      if(initForm){
        this.initFormBuilder(this.user);
      }
      this.changeDetectorRef.detectChanges();
    } catch (error) {
      console.log('e', error);
      this.errorLoadData = false;
      this.messageService.add({severity: 'error', summary: this.translate.instant('FAILURE!'), detail: 'Une erreur est survenue lors de la réccupération des donnnées de ccet utilisateur',  sticky: false});
    } finally {
      this.loadingData = false;
    }
  }

  initFormBuilder(user: User){
    console.log('initFormBuilder', user);
    this.userFormGroup.patchValue({
      ...user
    });
  }


  async submit() {
    Object.keys(this.userFormGroup.controls).forEach(key => {
      this.userFormGroup.get(key).markAsDirty();
    });
    if(!this.userFormGroup.valid ){
      return;
    }
    let toSubmit = Object.assign({}, this.userFormGroup.value,
      {
        fonction: this.fonctionsPersonnels.find(el => el.id === this.userFormGroup.value.fonction_id),
        status: this.status.find(el => el.id === this.userFormGroup.value.status_id),
        category: this.categoriesFonctions.find(el => el.id === this.userFormGroup.value.categorie_id),
        situation_famille: this.situationsfamilles.find(el => el.id === this.userFormGroup.value.situation_famille_id)},
    );

    //Adapting it with backend

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
    return SharedClasses.isControlRequired(this.userFormGroup.controls[control]) ? '(*)': '';
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

  uploadFile(e: Event) {
    console.log('uploadFile', e);

  }

  getAnciente() {
    const info = this.userFormGroup?.value;
    if(info){

      const diff = moment().diff(moment(info.date_entree, 'YYYY-MM-DD'), 'months');
      let ans: any = Math.floor(diff/12);

      const month = diff % ans;
      ans = ans > 2 ? ans+' ans' : ans+' année';
      return ans + ' et '+month+ ' mois';
    }else {
      return '';
    }
  }

  filechanged(event) {
    if(this.modalService.hasOpenModals()){
      return;
    }
    const modalRef = this.modalService.open(ImageCropperComponent);
    modalRef.componentInstance.title = 'Photo de profil';
    modalRef.componentInstance.file = event.target.files[0];
    modalRef.componentInstance.submitImage.subscribe(({file, base64}) => {
      console.log('cropper result ', file);
      this.photoBase64 = base64;
      if (file instanceof File) {
        this.userFormGroup.patchValue({
          photo_de_profil: file
        });
        if(this.userFormGroup?.value?.id){
          this.onSubmitProfilePicture(file);
        }
      }
    });
  }

  private async onSubmitProfilePicture(file) {
    if(this.submittingPhoto){
      return;
    }
    try{
      this.submittingPhoto = true;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('id', this.userFormGroup.value.id);
      const res = await this.userService.setProfilePicture(fd).toPromise();
      this.getUser(this.userFormGroup.value.id, false);
    }catch (e){

    }finally {
      this.submittingPhoto = false;
    }
  }

  cancelEditting() {

  }

  isDisabled() {
    // markFormAsDirty(this.userFormGroup)
  }


  async getCategoriesFonctions(){
    try{
      const res = await this.userService.getCategoriesFonctions().toPromise();
      this.categoriesFonctions = res.result;
    }catch (e){

    }finally {

    }
  }

  async getSituationsfamilles(){
    try{
      const res = await this.userService.getTypes('Situationfamille').toPromise();
      this.situationsfamilles = res.result;
    }catch (e){

    }finally {

    }
  }

  async getFonctionPersonnel(){
    try{
      const res = await this.userService.getTypes('FonctionPersonnel').toPromise();
      this.fonctionsPersonnels = res.result;
    }catch (e){

    }finally {

    }
  }

  async getStatus(){
    try{
      const res = await this.userService.getStatus().toPromise();
      this.status = res.result;
    }catch (e){

    }finally {

    }
  }

  async onSubmit() {
    console.log('submit', this.userFormGroup.value);
    markFormAsDirty(this.userFormGroup);
    if(!this.userFormGroup.valid){
      return;
    }
    const params = {
      id: this.user?.id,
      ...this.userFormGroup.value,
      fonction: this.fonctionsPersonnels.find(el => el.id === this.userFormGroup.value.fonction_id),
      status: this.status.find(el => el.id === this.userFormGroup.value.status_id),
      category: this.categoriesFonctions.find(el => el.id === this.userFormGroup.value.categorie_id),
      situation_famille: this.situationsfamilles.find(el => el.id === this.userFormGroup.value.situation_famille_id)
    }

    this.submitting = true;
    try{
      const res = await this.userService.update(params).toPromise();
      console.log('res', res);
      this.getUser(this.user.id);
      this.messageService.add({severity: 'success', summary: 'Parfait!', detail: 'Informations Mis à jour avec succès'});
    }catch (e){
      this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Une erreur est survenue'});
    }finally {
      this.submitting = false;
    }
  }
}

