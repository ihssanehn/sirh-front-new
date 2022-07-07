import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CompaniesService {

  constructor(private apiService: ApiService) {}


  getCompanies(params): Observable<any> {
    return this.apiService.post( 'companies/all', params)
        .map(result => result?.result?.data  || []);
  }


    createCComapny(params) {
      return this.apiService.post( 'companies/create', params)
          .map(result => result?.result?.data  || []);
    }
}
