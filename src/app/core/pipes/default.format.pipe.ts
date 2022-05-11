
import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Pipe({name: 'defaultFormat'})
export class DefaultDateFormatPipe {

  constructor(private datePipe: DatePipe){}

  transform(value) {
    return ( value ? this.datePipe.transform(value, 'dd/MM/yyyy à HH:mm') : '--');
  }
}