import { Pipe, PipeTransform } from '@angular/core';
import {MY_CUSTOM_DATETIME_FORMATS} from '@shared/classes/CustomDateTimeFormat';
import * as moment from "moment";
@Pipe({
  name: 'dateTimeMessage'
})
export class DateTimeMessagePipe implements PipeTransform {
  transform(timestamp: any): string {
    const FR = 'DD MMM YYYY, h:mm:ss a';
    const EN = 'MMM DD YYYY, h:mm:ss a';
    let format = FR;

    // moment.locale('fr');
    //
    // const localLang: string = localStorage.getItem('lang');
    // if(localLang === 'en'){
    //   format = EN;
    // }
    // if (localLang) {
    //   moment.locale(localLang);
    // }

    // return (timestamp) ? moment.unix(timestamp).format(format) : '';
    return (timestamp) ? moment(timestamp, MY_CUSTOM_DATETIME_FORMATS.fullPickerInput).format(format)  : '';
  }
}
