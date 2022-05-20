import { Component, OnInit } from '@angular/core';
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
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ImageCropperComponent} from "@shared/components/image-cropper/image-cropper.component";



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
  formInputs = {
    id: 'id',
    civilite: 'civilite',
    nom: 'nom',
    prenom: 'prenom',
    tel_perso: 'tel_perso',
    email_perso: 'email_perso',
    adresse: 'adresse',
    code_postal: 'code_postal',
    date_naissance: 'date_naissance',
    lieu_naissance: 'lieu_naissance',
    nationalite: 'nationalite',
    num_securite_sociale: 'num_securite_sociale',
    situation_famille_id: 'situation_famille_id',

    matricule: 'matricule',
    date_entree: 'date_entree',
    date_sortie: 'date_sortie',
    telephone: 'telephone',
    fonction_id: 'fonction_id',
    status_id: 'status_id',
    email: 'email',
    nom_urgence: 'nom_urgence',
    telephone_urgence: 'telephone_urgence',
    lien_parente_urgence: 'lien_parente_urgence',
    categorie_id: 'categorie_id',

    // ville: 'ville',
    // manager_id: 'manager_id',
    // cp_id: 'cp_id',
    // creator_id: 'creator_id',
    // archive: 'archive',
    // profil_conges_id: 'profil_conges_id',
    // profil_conges_custom: 'profil_conges_custom',
    // profil_conges_customs_id: 'profil_conges_customs_id',
    // cout_revient: 'cout_revient',
    // cout_vente: 'cout_vente',
    // remember_token: 'remember_token',
    // is_temps_partiel: 'is_temps_partiel',
    // is_hors_siege: 'is_hors_siege',
    // categorie_id: 'categorie_id',
    // validite_titre_sejour: 'validite_titre_sejour',
    // is_virtual: 'is_virtual',
    // validateur_absence_id: 'validateur_absence_id',
    // nom_urgence_2: 'nom_urgence_2',
    // telephone_urgence_2: 'telephone_urgence_2',
    // lien_parente_urgence_2: 'lien_parente_urgence_2',
    // is_fr: 'is_fr',
    // titre_sejour_id: 'titre_sejour_id',
    // date_fin_periode_essais: 'date_fin_periode_essais',
    // has_done_periode_essais: 'has_done_periode_essais',
    // periode_essais_comment: 'periode_essais_comment',
    // type_titre_sejour: 'type_titre_sejour',
    // num_titre_sejour: 'num_titre_sejour',
    // status_pe_id: 'status_pe_id',
    // photo_profil_id: 'photo_profil_id',
    // duree_mission: 'duree_mission',
    //
    //
    // nombre_enfants: 'nombre_enfants',
    // salaire_brut: 'salaire_brut',
    // compte_salarie: 'compte_salarie',
    // avantage_nature: 'avantage_nature',
    // has_tjm_fixed: 'has_tjm_fixed',
    // is_travailleur_handicape: 'is_travailleur_handicape',
    // cp_cp_id: 'cp_cp_id',
  }
  user: User;
  situationsfamilles: any;
  status: any;
  fonctionsPersonnels: any;
  categoriesFonctions: any;
  constructor(private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private router: Router,
              private location: Location,
              private modalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private translate: TranslateService,
              private userService : UserService) {

    this.noWhitespaceValidator.bind(this);
    this.userFormGroup = this.formBuilder.group({
      id: [null, Validators.required],
      civilite: [null, Validators.required],
      nom: [null, Validators.required],
      prenom: [null, Validators.required],
      tel_perso: [null, Validators.required],
      email_perso: [null],
      adresse: [null],
      code_postal: [null],
      date_naissance: [null, Validators.required],
      lieu_naissance: [null, Validators.required],
      nationalite: [null, Validators.required],
      num_securite_sociale: [null],
      situation_famille_id: [null],

      matricule: [null],
      date_entree: [null, Validators.required],
      date_sortie: [null],
      telephone: [null],
      fonction_id: [null, Validators.required],
      status_id: [null, Validators.required],
      email: [null, Validators.required],

      nom_urgence: [null],
      telephone_urgence: [null],
      lien_parente_urgence: [null],
      categorie_id: [null, Validators.required],

      // ville: [null, Validators.required],

      // manager_id: [null, Validators.required],
      // cp_id: [null, Validators.required],
      // creator_id: [null, Validators.required],
      // archive: [null, Validators.required],
      // profil_conges_id: [null, Validators.required],
      // profil_conges_custom: [null, Validators.required],
      // profil_conges_customs_id: [null, Validators.required],
      // cout_revient: [null, Validators.required],
      // cout_vente: [null, Validators.required],
      // remember_token: [null, Validators.required],
      // is_temps_partiel: [null, Validators.required],
      // is_hors_siege: [null, Validators.required],

      // validite_titre_sejour: [null, Validators.required],
      // is_virtual: [null, Validators.required],
      // validateur_absence_id: [null, Validators.required],
      // nom_urgence_2: [null, Validators.required],
      // telephone_urgence_2: [null, Validators.required],
      // lien_parente_urgence_2: [null, Validators.required],
      // is_fr: [null, Validators.required],
      // titre_sejour_id: [null, Validators.required],
      // date_fin_periode_essais: [null, Validators.required],
      // has_done_periode_essais: [null, Validators.required],
      // periode_essais_comment: [null, Validators.required],
      // type_titre_sejour: [null, Validators.required],
      // num_titre_sejour: [null, Validators.required],
      // status_pe_id: [null, Validators.required],
      // photo_profil_id: [null, Validators.required],
      // duree_mission: [null, Validators.required],
      //
      //
      // nombre_enfants: [null, Validators.required],
      // salaire_brut: [null, Validators.required],
      // compte_salarie: [null, Validators.required],
      // avantage_nature: [null, Validators.required],
      // has_tjm_fixed: [null, Validators.required],
      // is_travailleur_handicape: [null, Validators.required],
      // cp_cp_id: [null, Validators.required],
    });

    this.passwordFormGroup = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirm_password: [null, [Validators.required, Validators.minLength(6)]],
    }, {validator: this.passwordConfirming});
  }

  ngOnInit(){
    this.getUser(this.activatedRoute.snapshot.params.id);
    this.getSituationsfamilles();
    this.getFonctionPersonnel();
    this.getStatus();
    this.getCategoriesFonctions();
    this.categoriesFonctions();
  }

  async getUser(id, initForm=true) {
    this.loading = true;
    this.errorLoading = false;
    // const params = {
    //   id: id,
    // };

    try {
      const res = await this.userService.getOne(id).toPromise();
      console.log('getUser', res);
      this.user = res.result;
      try{
        if(initForm){
          this.initFormBuilder(this.user);
        }
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
    console.log('initFormBuilder', user);
     this.userFormGroup.patchValue({
       ...user
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

    // this.component.files = [];
    // if(e.target.files && e.target.files.length>0){
    //     Array.prototype.forEach.call(e.target.files, file=>{
    //       if(!this.findFile(file)){
    //         this.files.push(file);
    //       }
    //     });
    // }

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
      if (file instanceof File) {
        this.userFormGroup.patchValue({
          photo_de_profil: file
        });
        this.onSubmitProfilePicture(file);
      }
    });
  }

  private async onSubmitProfilePicture(file) {
    const params = {
      file,
      id: this.userFormGroup.value.id
    }
    try{
      const res = await this.userService.setProfilePicture(params).toPromise();
      this.getUser(this.userFormGroup.value.id, false);
    }catch (e){

    }finally {

    }
  }

  cancelEditting() {

  }

  isDisabled() {
    markFormAsDirty(this.userFormGroup)
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
      ...this.userFormGroup.value
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

