import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ErrorService} from "@app/core/services";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {getFormValidationErrors, markFormAsDirty, SharedClasses} from "@shared/Utils/SharedClasses";
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-creation-pieces-jointes',
  templateUrl: './creation-pieces-jointes.component.html',
  styleUrls: ['./creation-pieces-jointes.component.scss']
})
export class CreationPiecesJointesComponent implements OnInit {

  //TODO:
  // check edit files
  // check deleting files
  // check frais array in edit state
  // check securities in edit state
  formGroup: FormGroup;
  error = '';
  warning = '';
  errorLoadData = false;
  loadingData = false;
  formInputs = {
    is_pj_visible: 'is_pj_visible'
  }
  @Input() title = '';
  @Input() type = '';
  @Input()  idProject: any;
  @Input()  submitting: boolean;
  @Output() refreshGlobalData: EventEmitter<any> = new EventEmitter();
  @Output() submitStep: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();

  files = [];
  projectToEditFiles = [];
  edittingMode;
  errors = [];
  show_loader: boolean;
  forbiddenExtesionsErrorMessage: string;
  filesSizeErrorMessage: string;
  emptyFilesErrorMessage: string;
  inputFile: any;
  dropping: boolean;
  blackListesExtensions = ['exe', 'com', 'dll', 'bat', 'sh'];
  ALL_FILES_SIZE_LIMIT = 10000; // Mb
  progress: any;
  @Input()
  public set data(obj){
    if(obj){
      this.fillForm(obj);
    }
  }
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
              private mainStore: MainStore) {
    this.formGroup = this.formBuilder.group({
      is_pj_visible: [null]
    });
  }

  ngOnInit(): void {
  }

  fillForm(data){
    this.formGroup.patchValue({
      is_pj_visible: data?.is_pj_visible
    });
    this.projectToEditFiles = data.mission_files;
    this.files = data.mission_files?.map(el => {
      if(el.original_name){
        el.name = el.original_name;
      }
      return el;
    });
    this.edittingMode = data?.id;
  }

  save() {
    console.log('save pieces jointes', this.formGroup.value, this.files);
    this.error = '';
    const saveData = {
      ...this.formGroup.value
    }
    markFormAsDirty(this.formGroup);
    if(!this.formGroup.valid ){
      this.error = 'Il y a des éléments qui nécessitent votre attention';
      // console.log('getFormValidationErrors', );
      getFormValidationErrors(this.formGroup);
      return;
    }


    if(this.projectToEditFiles.length > 0){
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
      saveData['mission_to_delete_files'] = document_files_to_delete;
      saveData['mission_files'] = document_files_to_add;
    }else{
      saveData['mission_files'] = this.files;
    }

    console.log('saveData', saveData);

    this.submitStep.emit(saveData);
  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }



  // ABOUT FILE UPLOAD
  uploadFile(e){
    console.log('uploadFile', e);
    this.show_loader = true;
    // this.component.files = [];
    if(e.target.files && e.target.files.length>0){
      if(this.edittingMode){
        Array.prototype.forEach.call(e.target.files, file=>{
          if(!this.findFile(file)){
            this.files.push(file);
          }
        });
      }else{
        console.log('pushiiing', this.files);
        this.files = [e.target.files[0]];
      }
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

  onCheckChange(input, $event) {
    console.log('event', input, $event?.target?.checked);
    this.formGroup.patchValue({
      [input]: $event?.target?.checked
    });
  }

  inputChanged() {
    this.refreshGlobalData.emit(this.formGroup.value);
  }
}
