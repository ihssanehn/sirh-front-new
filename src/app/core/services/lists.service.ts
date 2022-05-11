import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ListsService {

  public list = {
    tags: 'tags',
    companies: 'companies'
  }
  constructor(private apiService: ApiService) {}

  getAll(entity, params): Observable<any> {
    return this.apiService.post( entity+'/all', params)
        .map(result => result?.result?.data  || []);
  }
}
