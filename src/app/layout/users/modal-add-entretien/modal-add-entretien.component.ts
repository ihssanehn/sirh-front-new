import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ListsService } from '@app/core/services/lists.service';
import { PersonalService } from '@app/core/services/personal.service';
import {
  formatDateForBackend,
  getFormValidationErrors,
  markFormAsDirty,
  paramsToFormData,
  SharedClasses
} from '@app/shared/Utils/SharedClasses';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import {MainStore} from "@store/mainStore.store";
import * as moment from "moment";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";

@Component({
  selector: 'app-modal-add-entretien',
  templateUrl: './modal-add-entretien.component.html',
  styleUrls: ['./modal-add-entretien.component.scss']
})

export class ModalAddEntretienComponent implements OnInit {
  error = '';
  warning = '';
  submitting: boolean;
  errorLoadData: boolean;
  loadingData: boolean;
  validators_conge =  [];
  loadingLists: boolean;
  formGroup: FormGroup;

  formMetaData = {
    personal_id: {
      input: 'personal_id',
      label: 'Personnel',
      placeholder: 'Selectionner le personnel',
      errorRequired: 'Le personnel est obligatoire'
    },
    type_id: {
      input: 'type_id',
      label: 'Type d\'entretien',
      placeholder: 'Selectionner le type d\'entretien',
      errorRequired: 'Le type d\'entretien est obligatoire'
    },
    theoretical_date: {
      input: 'theoretical_date',
      label: 'Date théorique',
      placeholder: 'La date théorique',
      errorRequired: 'La date théorique est obligatoire'
    },
    effective_date: {
      input: 'effective_date',
      label: 'Date effective',
      placeholder: 'La date effective',
      errorRequired: 'La date effective est obligatoire'
    }
  }

  personals = [];
  entretien_types = [];
  loadingSelect = {};
  id_entite = null;
  item = null;
  @Input() set data(val){
    this.item = val;
    if(this.formGroup){
        this.formGroup.patchValue({
        ...val,
        theoretical_date: val.theoretical_date ? moment(val.theoretical_date).format('YYYY-MM-DD'): null,
        effective_date: val.effective_date ? moment(val.effective_date).format('YYYY-MM-DD'): null,
      });
    }
    this.projectToEditFiles = val.document_files;
    this.getFilterList('entretien_types', this.listService.list.INTERVIEW_TYPE);
    this.getFilterList('personals', this.listService.list.PERSONAL);
  }


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

  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbActiveModal,
    public listService: ListsService,
    public mainStore: MainStore,
    private personalService: PersonalService,
    private messageService: MessageService
  ) {

    this.formGroup = this.formBuilder.group({
      id: [this.item?.id || null],
      personal_id: [this.item?.personal_id || null, Validators.compose([Validators.required])],
      type_id: [this.item?.type_id || null, Validators.compose([Validators.required])],
      theoretical_date: [this.item ? moment(this.item.theoretical_date).format('YYYY-MM-DD') : null, Validators.compose([Validators.required])],
      effective_date: [this.item ? moment(this.item.effective_date).format('YYYY-MM-DD') : null],
    });
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
  }

  ngOnInit(): void {

  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.formGroup.controls[control]) ? '(*)': '';
  }

  async getFilterList(items, list_name, list_param?){
    if(items === 'personals'){
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.personalService.getPersonnelAnnex().toPromise();
        console.log('this.item this.personals', this.personals);
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

  async submit() {
    markFormAsDirty(this.formGroup);
    getFormValidationErrors(this.formGroup);
    if (!this.formGroup.valid) {
      return;
    }
    try{
      this.submitting = true;
      const params: any = {
        personal_id: this.formGroup.getRawValue().personal_id,
        type_id: this.formGroup.getRawValue().type_id,
        theoretical_date: this.formGroup.getRawValue().theoretical_date,
        effective_date: this.formGroup.getRawValue().effective_date
      }
      // if(this.formGroup.getRawValue().effective_date){
      //   params.effective_date = this.formGroup.getRawValue().effective_date
      // }

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
        params['document_files_to_delete'] = document_files_to_delete;
        params['document_files'] = document_files_to_add;
      }else{ // add state
        params['document_files'] = this.files;
      }

      const fd = paramsToFormData(params, ['document_files'], ['effective_date', 'theoretical_date']);

      let res;
      if(this.item?.id){
        fd.append('id', this.item.id);
        res = await this.personalService.updateEntretien(fd).toPromise();
        this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Entretien modifié avec succès'});
      }else{
        res = await this.personalService.addEntretien(fd).toPromise();
        this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Entretien ajouté avec succès'});
      }

      console.log('res add/update Entretien', res);
      this.modal.close(res);
    }catch (e){
      console.log('error add/update Entretien', e);
      if(this.item?.id){
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la modification de l\'entretien'});
      }else{
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'ajout de l\'entretien'});
      }
    }finally {
      this.submitting = false;
    }
  }

  async getTheoricalDateCalulation() {
    const {personal_id, type_id} = this.formGroup.getRawValue();
    if(!personal_id || !type_id){
      return;
    }
    try {
      const params = {
        personal_id,
        type_id,
      }
      const res = await this.personalService.getTheoricalDateCalulation(params).toPromise();
      console.log('res getTheoricalDateCalulation', res);
      if(moment(res.calculatedDate)?.isValid()) {
        this.formGroup.patchValue({theoretical_date: res.calculatedDate});
      }
    }catch (e) {
      console.log('error getTheoricalDateCalulation', e);
    }finally {

    }
  }

  clearDateInput(input: string) {
    this.formGroup.patchValue({
      [input]: null
    })
  }


  // ABOUT FILE UPLOAD
  showFiles(){
    console.log('this.files', this.files);

  }
  uploadFile(e){
    console.log('hello anass', e);
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
    console.log('uploadFile this.files', this.files);
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
