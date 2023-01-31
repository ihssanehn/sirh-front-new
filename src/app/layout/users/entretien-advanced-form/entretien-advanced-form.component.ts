import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {
  formatDateForBackend,
  getFormValidationErrors,
  markFormAsDirty,
  SharedClasses,
  paramsToFormData
} from '@shared/Utils/SharedClasses';
import {Location} from '@angular/common';
import {$userRoles} from '@shared/Objects/sharedObjects';
import {User} from "@app/core/entities";
import { NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {isMoment} from "moment/moment";
import * as moment from "moment/moment";
import {MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";
import { PersonalService } from '@app/core/services/personal.service';
import {ModalDocumentrhFilesComponent} from "@layout/users/modal-documentrh-files/modal-documentrh-files.component";



@Component({
  selector: 'app-entretien-advanced-form',
  templateUrl: './entretien-advanced-form.component.html',
  styleUrls: ['./entretien-advanced-form.component.scss'],
})
export class EntretienAdvancedFormComponent implements OnInit, AfterViewInit {
  formGroup: FormGroup;
  errors : Array<any> = [];
  $userRoles = $userRoles;
  allRoles = [
      'manager', 'superadmin', 'user'
  ];
  error = '';
  warning = '';
  @Input() submitting: boolean;

  formInputs = {
    personal_id: 'personal_id',
    type_id: 'type_id',
    effective_date: 'effective_date',
    theoretical_date: 'theoretical_date',
  }

  formLabels =  {
    personal_id: 'personal_id',
    type_id: 'Type entretien',
    effective_date: 'Date de réalisation',
    theoretical_date: 'Date théorique',
  }

  entretien_types = [];
  errorLoadData: boolean;
  loadingData: boolean;
  loadingLists: boolean;
  @Input() title = '';
  @Input() type = '';
  // @Input()  idUser: any;
  @Input()  profile_id: any;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Output() submitEntretien: EventEmitter<any> = new EventEmitter();
  showHistory = false;
  loadingSelect = {};
  id_entite = null;
  idUser:number;
  @Input()
  public set user(val: User) {
    if(val){
      this.initFormBuilder(val);
      this.idUser = val.id;
    }
  }
  @Input() interviews: any;


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


  constructor(private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private router: Router,
              private location: Location,
              private modalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private translate: TranslateService,
              private changeDetectorRef: ChangeDetectorRef,
              public listService: ListsService,
              private mainStore: MainStore,
              private personalService: PersonalService,
              private userService : UserService) {

    this.noWhitespaceValidator.bind(this);
    this.formGroup = this.formBuilder.group({
      personal_id: [null, Validators.compose([Validators.required])],
      type_id: [null, Validators.compose([Validators.required])],
      effective_date: [null],
      theoretical_date: [null, Validators.compose([Validators.required])],
      id:[null]
    });

    this.modalService.dismissAll();
  }

  mockupData(){
    const data = {
      personal_id: 11,
      type_id: null,
      effective_date: null,
      theoretical_date: null,
    };
    this.formGroup.patchValue(data);
  }

  ngAfterViewInit(): void {

  }

  async ngOnInit(){
    if(this.activatedRoute.snapshot.params.id){
      // this.getUser(this.activatedRoute.snapshot.params.id);
    }
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
    this.getParametersLists();
    // this.mockupData();
    this.changeDetectorRef.detectChanges();
  }

  async getFilterList(items, list_name, list_param?){
    if(items === 'personals'){
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.listService.getPersonalsByCpId({entity_id: this.id_entite}).toPromise();
      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }else{
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.listService.getAll(list_name, list_param).toPromise();

      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }
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
      });
    }
  }

  editInterview(item){
    if(item){
      this.getFilterList('entretien_types', this.listService.list.INTERVIEW_TYPE)
      this.formGroup.patchValue({
        type_id: item.type_id,
        theoretical_date: item.theoretical_date,
        effective_date: item.effective_date,
        id:item.id
      });
      this.files = item.document_files?.attachments || [];
      this.projectToEditFiles = item.document_files?.attachments || [];
    }
  }

  reset(){
    this.formGroup.reset()
    this.formGroup.patchValue({
      personal_id: this.idUser,
      type_id:null,
      effective_date:null,
      theoretical_date:null
    });
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

  async save() {
    this.error = '';
    this.submitting = true;
    markFormAsDirty(this.formGroup);
    if(!this.formGroup.valid ){
      this.error = 'Des éléments bloquants nécessitent votre attention';
      getFormValidationErrors(this.formGroup);
      return;
    }

    Object.keys(this.formGroup.value).forEach(key => {
      if(this.formGroup.value[key] === 'false'){
        this.formGroup.value[key] = false;
      }
    });

    const dates = ['effective_date', 'theoretical_date'];
    const saveData = {
      ...this.formGroup.value,
      document_files: this.files,
    }
    dates.forEach(date => {
      saveData[date] = formatDateForBackend(saveData[date]);
    });


    if(this.projectToEditFiles?.length > 0){ // Edit state
      const document_files_to_delete = [];
      const document_files_to_add = [];
      this.projectToEditFiles.forEach(att => {
        if(!this.files.find(file => file.id === att.id)){
          document_files_to_delete.push(att.id);
        }
      });
      this.files.forEach(file => {
        if(file instanceof File){
          document_files_to_add.push(file);
        }
      });
      saveData['document_files_to_delete'] = document_files_to_delete;
      saveData['document_files'] = document_files_to_add;
    }else{ // add state
      saveData['document_files'] = this.files;
    }

    const fd = paramsToFormData(saveData, ['document_files'],[]);
    

    // this.submitEntretien.emit(fd);
    console.log(saveData)
    let res = null;
    if(saveData?.id){
      fd.append('id', saveData.id);
      res = await this.personalService.updateEntretien(fd).toPromise();
      if(res.result && res.result.data){
        let index = this.interviews.findIndex((_item) => _item["id"] == saveData.id);
        this.interviews.splice(index,1, res.result.data);
        this.submitting = false;
        this.reset()
      }
      this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Entretien modifié avec succès'});
    }else{
      res = await this.personalService.addEntretien(fd).toPromise();
      if(res.result && res.result.data){
        this.interviews.unshift(res.result.data)
        this.submitting = false;
        this.reset()
      }
      this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Entretien ajouté avec succès'});
    }

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

  openDocumentRHFilesModal(document?){
    const modalRef = this.modalService.open(ModalDocumentrhFilesComponent, { size: 'lg' , centered: true, windowClass: 'myModal'});
    modalRef.result.then(result=>{
      console.log('closed result', result);
    }, reason => {
      console.log('closed reason', reason);
    });
    if(document){
      modalRef.componentInstance.files = document.attachments;
      modalRef.componentInstance.title = 'Télécharger les documents';
    }
  }

}

