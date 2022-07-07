import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {


  format(err): Array<any> {

    let arr = [];
    let code = err.status;

    switch (code) {
        case 422:
            Object.keys(err.error.errors).map((key: any) => {
                arr.push(key + ' : ' + err.error.errors[key]);
            });
            break;
        default:
            Object.keys(err.error.errors).map((key: any) => {
                arr.push(err.error.errors[key].message);
            });
            break;
    }

    return arr;
  }

}
