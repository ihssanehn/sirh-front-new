
import { Pipe } from '@angular/core';
import * as moment from 'moment';


@Pipe({name: 'timeAgo'})
export class TimeAgoPipe {

  transform(value) {
    return ( value ? moment(value).fromNow() : '');
  }
}