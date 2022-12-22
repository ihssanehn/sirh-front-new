import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {getFormValidationErrors, markFormAsDirty, SharedClasses} from '@shared/Utils/SharedClasses';
import {Location} from '@angular/common';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {User} from "@app/core/entities";
import { NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";



@Component({
  selector: 'app-sortie-advanced-form',
  templateUrl: './sortie-advanced-form.component.html',
  styleUrls: ['./sortie-advanced-form.component.scss'],
})
export class SortieAdvancedFormComponent implements OnInit, AfterViewInit {
  formGroup: FormGroup;
  errors : Array<any> = [];
  $userRoles = $userRoles;
  allRoles = [
    'manager', 'superadmin', 'user'
  ];
  error = '';
  warning = '';
  @Input() submitting: boolean;
  loadingSelect = {};
  formInputs = {
    personal_id: 'personal_id',
    date_entree: 'date_entree',
    date_sortie: 'date_sortie',
    date_reception_courrier: 'date_reception_courrier',
    motif: 'motif',
    fin_normal_preavis: 'fin_normal_preavis',
    date_limit_reponse: 'date_limit_reponse',

    mail_direction_bm: 'mail_direction_bm',
    mail_admin: 'mail_admin',
    courrier_reponse: 'courrier_reponse',
    radiation_ats: 'radiation_ats',
    date_envoi_stc: 'date_envoi_stc',
    envoi_recommande_number: 'envoi_recommande_number',
    sortie_sirh: 'sortie_sirh',
    radiation_apicil: 'radiation_apicil',
    virement_amandine: 'virement_amandine',
  }
  formLabels =  {
    personal_id: 'personal_id',
    date_entree: 'Date d\'entrée',
    date_sortie: 'Date de sortie',
    date_reception_courrier: 'Date reception courrier',
    motif: 'Motif',
    fin_normal_preavis: 'Fin normal preavis',
    date_limit_reponse: 'Date limite de réponse',
    mail_direction_bm: 'Mail Direction + BM',
    mail_admin: 'Mail Admin',
    courrier_reponse: 'courrier réponse',
    radiation_ats: 'Radiation ATS',
    date_envoi_stc: 'Date d’envoi STC',
    envoi_recommande_number: 'Envoi recommandé N°',
    sortie_sirh: 'sortie SIRH',
    radiation_apicil: 'Radiation APICIL',
    virement_amandine: 'Virement Amandine',
  }
  etats = [];
  errorLoadData: boolean;
  loadingData: boolean;
  loadingLists: boolean;
  @Input() title = '';
  @Input() type = '';
  @Input()  idUser: any;
  @Input()  profile_id: any;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Output() submitSortie: EventEmitter<any> = new EventEmitter();
  showHistory = false;
  medicalCenters = [];
  @Input()
  public set user(val: User) {
    if(val){
      this.initFormBuilder(val);
    }
  }
  @Input() sortie: any;



  files = [];
  projectToEditFiles = [];
  edittingMode;
  show_loader: boolean;
  forbiddenExtesionsErrorMessage: string;
  filesSizeErrorMessage: string;
  emptyFilesErrorMessage: string;
  inputFile: any;
  dropping: boolean;
  blackListesExtensions = ['exe', 'com', 'dll', 'bat', 'sh'];
  ALL_FILES_SIZE_LIMIT = 10000; // Mb
  progress: any;
  motifs:any;

  constructor(private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private router: Router,
              private location: Location,
              private modalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private translate: TranslateService,
              private changeDetectorRef: ChangeDetectorRef,
              private listService: ListsService,
              private mainStore: MainStore,
              private userService : UserService) {

    this.noWhitespaceValidator.bind(this);
    this.formGroup = this.formBuilder.group({
      personal_id: [null],
      date_entree: [null],
      date_sortie: [null],
      date_reception_courrier: [null],
      motif: [null],
      fin_normal_preavis: [null],
      date_limit_reponse: [null],

      mail_direction_bm: [null],
      mail_admin: [null],
      courrier_reponse: [null],
      radiation_ats: [null],
      date_envoi_stc: [null],
      envoi_recommande_number: [null],
      sortie_sirh: [null],
      radiation_apicil: [null],
      virement_amandine: [null],
    });

    this.modalService.dismissAll();
  }

  mockupData(){
    const data = {
      personal_id: null,
      date_entree: null,
      date_sortie:  null,
      date_reception_courrier:  null,
      motif:  null,
      fin_normal_preavis:  null,
      date_limit_reponse:  null
    };
    this.formGroup.patchValue(data);
  }

  ngAfterViewInit(): void {

  }


  async ngOnInit(){
    if(this.activatedRoute.snapshot.params.id){
      // this.getUser(this.activatedRoute.snapshot.params.id);
    }
    const id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
    this.getParametersLists();
    // this.mockupData();
    this.changeDetectorRef.detectChanges();
    // this.getMotifs()
  }

  async getParametersLists(){
    try{
      this.loadingLists = true;
      const res = await this.listService.getParameters().toPromise();
      console.log('res getParametersLists', res);
      if(res){
        Object.keys(res).forEach(key => {
          this[key] = res[key];
        });
      }
    }catch (e){

    }finally {
      this.loadingLists = false;
    }
  }

  initFormBuilder(user: User){
    if(user){
      this.formGroup.patchValue({
        personal_id: user.id,
        ...user.parameter
      });
    }
  }

  async getFilterList(items, list_name, list_param?){
    
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.listService.getAll(list_name, list_param).toPromise();

      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    
  }

  async markActionAsDone(id, is_done){
    let marked = await this.userService.markActionAsDone({id:id}).toPromise();
    if(marked)
      this.messageService.add({
        severity: 'success',
        summary: 'Parfait!',
        detail: 'L\'action a bien été marquée comme réalisée',
        sticky: false,
      });
  }

  async getMotifs(){
   this.motifs = await this.userService.getTypesByModel('exit_type').toPromise();
  }

  


  isRequired(control) {
    return SharedClasses.isControlRequired(this.formGroup.controls[control]) ? '(*)': '';
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
  }

  goback() {
    this.location.back();
  }

  cancelEditting() {

  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }

  save() {
    this.error = '';
    markFormAsDirty(this.formGroup);
    if(!this.formGroup.valid ){
      this.error = 'Il y a des éléments qui nécessitent votre attention';
      getFormValidationErrors(this.formGroup);
      return;
    }
    Object.keys(this.formGroup.value).forEach(key => {
      if(this.formGroup.value[key] === 'false'){
        this.formGroup.value[key] = false;
      }
    });
    this.submitSortie.emit(this.formGroup.value);
  }

  clearDateInput(input: string) {
    this.formGroup.patchValue({
      [input]: null
    })
  }


  // ABOUT FILE UPLOAD
  uploadFile(e){
    console.log('uploadFile', e);
    this.show_loader = true;
    // this.component.files = [];
    if(e.target.files && e.target.files.length>0){
      // if(this.edittingMode){
        Array.prototype.forEach.call(e.target.files, file=>{
          if(!this.findFile(file)){
            this.files.push(file);
          }
        });
      // }
      // else{
      //   console.log('pushiiing', this.files);
      //   this.files = [e.target.files[0]];
      // }
    }
    this.show_loader = false;
    if( this.inputFile ){
      this.inputFile.nativeElement.value='';
    }
    console.log('this.component.files', this.files);
    if(this.files.length>0){
      // this.error.files = '';
      this.emptyFilesErrorMessage = '';
    }else{
      // this.error.files = 'Vous devez charger un docuemnt';
      this.emptyFilesErrorMessage = 'Aucun document';
    }

    if(this.getAllFilesSize() > this.ALL_FILES_SIZE_LIMIT){
      this.filesSizeErrorMessage = 'Vous avez dépassé la taille limite d\'importation de fichiers ('+this.ALL_FILES_SIZE_LIMIT+' Mb)';
    }else{
      this.filesSizeErrorMessage = '';
    }

    const forbiddenExtesions = this.checkExtensions();
    if(forbiddenExtesions && forbiddenExtesions.length > 0){
      this.forbiddenExtesionsErrorMessage = forbiddenExtesions.length === 1 ?
        'L\'extension '+forbiddenExtesions[0]+' n\'est pas prise en charge':
        'Les extensions ('+forbiddenExtesions.join(', ')+') ne sont pas prises en charge';
    }else{
      this.forbiddenExtesionsErrorMessage = '';
    }
  }

  async getFile(fileEntry) {
    try {
      return await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
    } catch (err) {
      console.log(err);
    }
  }

  async dropFile(files: NgxFileDropEntry[]){
    // this.files = [];
    // if(!this.edittingMode){
    this.dropping = false;
    this.show_loader = true;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = await droppedFile.fileEntry as FileSystemFileEntry;
        const file = await this.getFile(fileEntry);
        if(!this.findFile(file)){
          this.files.push(file);
        }
      }
    }
    this.show_loader = false;
    // }

    if(this.getAllFilesSize() > this.ALL_FILES_SIZE_LIMIT){
      this.filesSizeErrorMessage = 'Vous avez dépassé la taille limite d\'importation de fichiers ('+this.ALL_FILES_SIZE_LIMIT+' Mb)';
    }else{
      this.filesSizeErrorMessage = '';
    }

    console.log('befot checking extensions', this.files);
    const forbiddenExtesions = this.checkExtensions();
    if(forbiddenExtesions && forbiddenExtesions.length > 0){
      this.forbiddenExtesionsErrorMessage = forbiddenExtesions.length === 1 ?
        'L\'extension '+forbiddenExtesions[0]+' n\'est pas prise en charge':
        'Les extensions ('+forbiddenExtesions.join(', ')+') ne sont pas prises en charge';
    }else{
      this.forbiddenExtesionsErrorMessage = '';
    }
    console.log('forbiddenExtesions', forbiddenExtesions);
  }

  checkExtensions(){
    const foundedExtensions = [];
    console.log('checkExtensions', this.files);
    this.files.forEach(file => {
      const ext = file.name.split('.').pop();
      if(this.blackListesExtensions.includes(ext)){
        foundedExtensions.push(ext);
      }
    });
    return foundedExtensions;
  }

  getAllFilesSize(): number{
    let globalSize = 0;
    this.files.forEach(file => {
      globalSize += file.size / 1024 / 1024;
    });
    return globalSize;
  }

  findFile(file) {
    return this.files.find(function(existingFile) {
      return (
        existingFile.name         === file.name &&
        existingFile.lastModified === file.lastModified &&
        existingFile.size         === file.size &&
        existingFile.type         === file.type
      );
    });
  }

  removeFile(fileToRemove){
    // if(fileToRemove instanceof File){
    this.files = this.files.filter(file => !(
      fileToRemove.name         === file.name &&
      fileToRemove.lastModified === file.lastModified &&
      fileToRemove.size         === file.size &&
      fileToRemove.type         === file.type &&
      fileToRemove.id         === file.id
    ));
    // }

    if(this.files.length>0){
      // this.error.files = '';
      this.emptyFilesErrorMessage = '';
    }else{
      this.emptyFilesErrorMessage = 'Aucun document';
    }
  }

  getFileName (name) {
    let file_name = name;
    const arr_filename = file_name.split('.');
    const file_ex = arr_filename.pop();
    file_name = arr_filename.join('.');
    if ( file_name.length > 7 ) {
      file_name = file_name.substr(0,5) + '...';
    }
    return file_name+'.'+file_ex;
  }

  getIcon(filename) {
    const file_ex = filename.split('.').pop();
    return 'icon-file-' + SharedClasses.getFileType(file_ex);
  }

  async download(file){
    if(!file.id){
      return;
    }
    const params = {
      id: file.id
    };

    try{
      // const res: any = await this.userService.downloadDocument(params).toPromise();
      // console.log('res blob', res);
      // const blob = new Blob([res.body]);
      // FileSaver.saveAs(blob, file.name);
    }catch(error){
      console.log('e', error);
      this.mainStore.showMessage(`Echec de téléchargement!`, `le document n'a pas pu être téléchargé`, 'error');
    }

  }

  getFileSize(size){
    let fileSize = size.toString();

    if(fileSize.length < 7) return `${Math.round(+fileSize/1024).toFixed(2)} kb`
    return `${(Math.round(+fileSize/1024)/1000).toFixed(2)} MB`
  }
  // ABOUT FILE UPLOAD END
}


