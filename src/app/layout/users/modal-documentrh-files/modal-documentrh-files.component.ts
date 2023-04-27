import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListsService} from "@services/lists.service";
import {isMoment} from "moment";
import * as moment from "moment";
import {MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";
import {map} from "rxjs/operators";
import {HttpEventType} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import Swal from "sweetalert2";
import {SharedClasses} from "@shared/Utils/SharedClasses";
import {UserService} from "@app/core/services";
import * as FileSaver from 'file-saver';
import {MainStore} from "@store/mainStore.store";
import { DomSanitizer} from '@angular/platform-browser';
import { JwtStore } from '@app/store/jwt.store';
@Component({
  selector: 'app-modal-documentrh-files',
  templateUrl: './modal-documentrd-files.component.html',
  styleUrls: ['./modal-documentrh-files.component.scss']
})
export class ModalDocumentrhFilesComponent implements OnInit {
  @Input() files = [];
  @Input() title = null;
  show_file = null;
  constructor(
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private jwtStore: JwtStore,
    private userService: UserService,
    private mainStore: MainStore,
    private domSanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
  }


  getFileName (name) {
    let file_name = name;
    const arr_filename = file_name.split('.');
    const file_ex = arr_filename.pop();
    file_name = arr_filename.join('.');
    if ( file_name.length > 40 ) {
      file_name = file_name.substr(0,40) + '...';
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
      const res: any = await this.userService.downloadDocument(params).toPromise();
      console.log('res blob', res);
      const blob = new Blob([res.body]);
      FileSaver.saveAs(blob, file.original_name);
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

  async previewFile(document){
    const res: any = await this.userService.getDocumentUrl(document).toPromise();
    const _path = res?.result?.data?.path;
    if(_path){
      this.show_file = { ...document,
            safe_url:this.domSanitizer.bypassSecurityTrustResourceUrl(_path)
      };
    }
  }
}
