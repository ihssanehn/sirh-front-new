import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {SharedClasses} from "@shared/Utils/SharedClasses";
import {ListsService} from "@services/lists.service";
import {ActivitiesService} from "@services/activities.service";
import * as _moment from "moment";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import Swal from "sweetalert2";
import * as FileSaver from 'file-saver';
import {MainStore} from "@store/mainStore.store";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-import-solds-abs',
  templateUrl: './import-solds-abs.component.html',
  styleUrls: ['./import-solds-abs.component.scss']
})
export class ImportSoldsAbsComponent implements OnInit {

  forbiddenExtesionsErrorMessage: string;
  filesSizeErrorMessage: string;
  emptyFilesErrorMessage: any;
  blackListesExtensions = ['exe', 'com', 'dll', 'bat', 'sh'];
  ALL_FILES_SIZE_LIMIT = 10000; // Mb
  progress: number;
  @ViewChild('upload') inputFile: ElementRef;
  @Input() document;
  files = [];
  show_loader: boolean;
  edittingMode: Boolean;
  dropping: boolean;
  submittingFile: boolean;
  submittingImport: boolean;

  constructor(private listService: ListsService,
              private activitiesService: ActivitiesService,
              private mainStore: MainStore,
  ) { }

  ngOnInit(): void {
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
    if( this.inputFile ){
      this.inputFile.nativeElement.value='';
    }
    console.log('this.component.files', this.files);
    if(this.files.length>0){
      // this.error.files = '';
      this.emptyFilesErrorMessage = '';
    }else{
      // this.error.files = 'Vous devez charger un docuemnt';
      this.emptyFilesErrorMessage = 'Vous devez charger un docuemnt';
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
      this.emptyFilesErrorMessage = 'Vous devez charger un docuemnt';
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

    try{
      // let res: any;
      // if(!this.document){
      //   res = await this.userService.addRHDocument(fd, {
      //     reportProgress: true,
      //     observe: 'events'
      //   }).pipe(
      //     map((event: any) => {
      //       if (event.type === HttpEventType.UploadProgress) {
      //         this.progress = Math.round((100 / event.total) * event.loaded);
      //       } else if (event.type === HttpEventType.Response) {
      //         this.progress = null;
      //       }
      //     }),
      //     catchError((err: any) => {
      //       this.progress = null;
      //       return throwError(err);
      //     })
      //   ).toPromise();


      this.progress = null;
      // console.log('res addStorage', res);
      Swal.fire({
        title: 'Document créé avec succès',
        icon: 'success',
        confirmButtonColor: '#078aff'
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


}
