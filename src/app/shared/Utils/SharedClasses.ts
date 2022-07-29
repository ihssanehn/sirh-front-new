import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import * as moment from 'moment';


export class SharedClasses {

  static getModalDissmissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  static remove_duplicates(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
  }

  static isControlRequired(control: AbstractControl): boolean {
    if (!control) {
      return false;
    }

    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }

    return false;
  }

  static getFileType(extension){
    switch (extension){
      case 'aif': case 'cda': case 'mid': case 'midi': case 'mp3': case 'mpa':
      case 'ogg': case 'wav': case 'wma': case 'wpl':{
        return 'audio';
      }
      case '7z': case 'arj': case 'deb': case 'pkg': case 'rar':
      case 'rpm': case 'tar.gz': case 'z': case 'zip': {
        return 'zip';
      }
      case 'ai': case 'bmp': case 'gif': case 'ico': case 'svg':
      case 'jpeg': case 'jpg': case 'png': case 'ps': case 'psd': case 'tif':  case 'tiff': {
        return 'img';
      }
      case 'key': case 'odp':  case 'pps':  case 'ppt':  case 'pptx': {
        return 'ppt';
      }
      case 'ods': case 'xls':  case 'xlsm':  case 'xlsx': {
        return 'excel';
      }
      case '3g2': case '3gp': case 'avi': case 'flv': case 'h264':
      case 'm4v': case 'mkv': case 'mov': case 'mp4': case 'mpg':
      case 'mpeg': case 'rm': case 'swf': case 'vob': case 'wmv':
      {
        return 'video';
      }
      case 'doc': case 'docx': case 'odt': case 'tex': case 'wpd': {
        return 'word';
      }
      case 'pdf': {
        return 'pdf';
      }
      case 'txt': case 'rtf': {
        return 'text';
      }
      default: {
        return 'default';
      }
    }
  }

  static getMonthsForFilter(starts_at) {
    const dateStart = moment(starts_at);
    const dateEnd = moment();
    const timeValues = [];

    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
      timeValues.unshift(dateStart.format('MM/YYYY'));
      dateStart.add(1, 'month');
    }
    return timeValues;
  }
}

export function markFormAsDirty(control){
  Object.keys(control.controls).forEach(key => {
    control.get(key).markAsDirty();
  });
  control.markAsDirty();
}

export function getFormValidationErrors(form) {
  Object.keys(form.controls).forEach(key => {

    const controlErrors: ValidationErrors = form.get(key).errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach(keyError => {
        console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
      });
    }
  });
}
