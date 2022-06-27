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
