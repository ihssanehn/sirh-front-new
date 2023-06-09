import { Pipe, PipeTransform } from '@angular/core';
import {MY_CUSTOM_DATETIME_FORMATS} from '@shared/classes/CustomDateTimeFormat';
import * as moment from "moment";
@Pipe({
  name: 'dateMessage'
})
export class DateMessagePipe implements PipeTransform {
  transform(timestamp: any, args?: any): string {
    let format;
    moment.locale( 'fr');
    if(args){
      format = args;
    }else{
      const FR = 'DD MMM YYYY';
      const EN = 'MMM DD ,YYYY';
      format = FR;


      // const localLang: string = localStorage.getItem('lang');
      // if(localLang === 'en'){
      //   format = EN;
      // }
      // if (localLang) {
      //   moment.locale(localLang);
      // }

    }

    // console.log('mouad', timestamp, moment(timestamp).format(format));
    return  timestamp && moment(timestamp).locale('fr').format(format) !== 'Invalid date' ?  moment(timestamp).locale('fr').format(format): '';
  // , MY_CUSTOM_DATETIME_FORMATS.backend_format
  }
}
