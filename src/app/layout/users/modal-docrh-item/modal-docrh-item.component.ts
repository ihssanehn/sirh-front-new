import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddUserComponent} from "@layout/users/add-user/add-user.component";
import {UserInfoFormComponent} from "@layout/users/user-info-form/user-info-form.component";
import {ListsService} from "@services/lists.service";
import {ModalPeriodeEssaiComponent} from "@layout/users/modal-periode-essai/modal-periode-essai.component";
import * as moment from "moment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedClasses} from "@shared/Utils/SharedClasses";
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import Swal from "sweetalert2";
import {UserService} from "@app/core/services";
import {HttpEventType} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-modal-docrh-item',
  templateUrl: './modal-docrh-item.component.html',
  styleUrls: ['./modal-docrh-item.component.scss']
})
export class ModalDocrhItemComponent implements OnInit {
  myForm: FormGroup;

  formInputs = {
    id: 'id',
    user_id: 'user_id',
    type: 'type',
    validation_start_date: 'validation_start_date',
    validation_end_date: 'validation_end_date',
    alert_time_limit: 'alert_time_limit',
    processed_alert: 'processed_alert',
    title: 'title',
    action_to_do: 'action_to_do',
    files: 'files',
  }
  formMetaData = {
    id: {
      label: 'id',
      required: false
    },
    user_id:  {
      label: 'Utilisateur',
      required: false,
      placeholder: 'Sélectionner un utilisateur'
    },
    type:  {
      label: 'Type de document',
      required: false,
      placeholder: 'Sélectionner le type du document'
    },
    validation_start_date:  {
      label: 'Date début validité',
      required: false,
      placeholder: 'Sélectionner la date début validé du document'
    },
    validation_end_date:  {
      label: 'Date fin validité',
      required: false,
      placeholder: 'Sélectionner la date fin validé du document'
    },
    alert_time_limit:  {
      label: 'Délais alerte',
      required: false,
      placeholder: 'Sélectionner le dalais d\'alerte'
    },
    processed_alert:  {
      label: 'Alerte traité',
      required: false,
      placeholder: null
    },
    title:  {
      label: 'Titre du document',
      required: false,
      placeholder: 'Saisir le titre du document'
    },
    action_to_do:  {
      label: 'Action à mener',
      required: false,
      placeholder: 'Saisir l\'action à mener'
    },
    files:  {
      label: 'id',
      required: false
    },
  }
  users = [];
  types = [];
  edittingMode: Boolean;
  forbiddenExtesionsErrorMessage: string;
  filesSizeErrorMessage: string;
  blackListesExtensions = ['exe', 'com', 'dll', 'bat', 'sh'];
  ALL_FILES_SIZE_LIMIT = 10000; // Mb
  progress: number;
  @ViewChild('upload') inputFile: ElementRef;
  files = [];
  show_loader: boolean;
  dropping: boolean;
  constructor(
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    public userService: UserService,
    private fb: FormBuilder,
    private listService: ListsService,
  ) {
    this.myForm = this.fb.group({
      id: [null],
      user_id:[null, Validators.required],
      type: [null, Validators.required],
      validation_start_date: [null],
      validation_end_date: [null, Validators.required],
      alert_time_limit: [null],
      processed_alert: [null],
      title: [null],
      action_to_do: [null],
      files: [null],
    });
  }

  ngOnInit() {
  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.myForm.controls[control]) ? '(*)': '';
  }

  clearDateInput(birth_date: any) {

  }


  // For upload
  uploadFile(e){

    console.log('uploadFile', e);
    this.show_loader = true;
    // this.component.files = [];
    if(e.target.files && e.target.files.length>0){
      if(!this.edittingMode){
        Array.prototype.forEach.call(e.target.files, file=>{
          if(!this.findFile(file)){
            this.files.push(file);
          }
        });
      }else{
        this.files = [e.target.files[0]];
      }
    }
    this.show_loader = false;
    this.inputFile.nativeElement.value='';
    console.log('this.component.files', this.files);
    if(this.files.length>0){
      // this.error.files = '';
    }else{
      // this.error.files = 'Vous devez charger un docuemnt';
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
    this.files = [];
    if(!this.edittingMode){
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
    }

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
    this.files = this.files.filter(file => !(
      fileToRemove.name         === file.name &&
      fileToRemove.lastModified === file.lastModified &&
      fileToRemove.size         === file.size &&
      fileToRemove.type         === file.type
    ));
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

  async submit(){
    this.progress = null;
    Object.keys(this.myForm.controls).forEach(key => {
      this.myForm.get(key).markAsDirty();
    });
    if(!this.myForm.valid ){
      return;
    }
    this.progress = 1;
    const fd = new FormData();
    fd.append('user_id', this.myForm.value.user_id);
    fd.append('type', this.myForm.value.type);
    fd.append('validation_start_date', this.myForm.value.validation_start_date);
    fd.append('validation_end_date', this.myForm.value.validation_end_date);
    fd.append('alert_time_limit', this.myForm.value.alert_time_limit);
    fd.append('processed_alert', this.myForm.value.processed_alert);
    fd.append('title', this.myForm.value.title);
    fd.append('action_to_do', this.myForm.value.action_to_do);



    try{
      let res: any;
      for(let i=0; i < this.files?.length; i++){
        fd.append('files['+i+']', this.files[i]);
      }
      if(!this.edittingMode){
        res = await this.userService.addRHDocument(fd, {
          reportProgress: true,
          observe: 'events'
        }).pipe(
          map((event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 / event.total) * event.loaded);
            } else if (event.type === HttpEventType.Response) {
              this.progress = null;
            }
          }),
          catchError((err: any) => {
            this.progress = null;
            return throwError(err);
          })
        ).toPromise();
      }else{
        fd.append('id', this.myForm.value.id);
        res = await this.userService.updateRHDocument(fd).toPromise();
      }

      this.progress = null;
      console.log('res addStorage', res);
      Swal.fire({
        title: this.files?.length>1 ? 'Documents partagés avec succès': 'Document partagé avec succès',
        icon: 'success',
        confirmButtonColor: '#078aff'
      }).then(() => {

      });
    }catch(e){
      console.log('err addStorage', e);
      let messageTest = '';
      Object.keys(e.error).forEach(error_attr => messageTest = e.error[error_attr] + "<br>");
      Swal.fire({
        title: 'Echec de l\'opération',
        html: e?.status == 422 ? messageTest : e?.error?.message,
        icon: 'error',
        confirmButtonColor: '#078aff'
      });
    }finally {
      this.show_loader = false;
    }
  }

  getIcon(filename) {
    const file_ex = filename.split('.').pop();
    console.log('getIcon', filename, file_ex);
    return 'icon-file-' + SharedClasses.getFileType(file_ex);
  }
}
