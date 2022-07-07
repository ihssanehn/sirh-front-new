import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators'

@Injectable()
export class ListsService {

  public list = {
    CONTRACT: 'CONTRACT',
    FUNCTION: 'FUNCTION',
    FAMILY_SITUATION: 'FAMILY_SITUATION',
    ENTITY: 'ENTITY',
    PROFILE: 'PROFILE',
    STATUS: 'STATUS',
    PERSONAL: 'PERSONAL',
    MANAGER: 'MANAGER',
    PROFIT_CENTER: 'PROFIT_CENTER',
    PERMISSIONS_BY_ELEMENT: 'permission/getPermissionsByElement'
  }
  constructor(private apiService: ApiService) {}

  getAll(entity, params = null) {
    if(entity === this.list.STATUS){
      return this.apiService.get( 'status/getStatusByModel?model='+params)
        .pipe(map(res => { return res?.result?.data || []}))
    } else if(entity === this.list.PERMISSIONS_BY_ELEMENT){
      return this.apiService.get( this.list.PERMISSIONS_BY_ELEMENT)
        .pipe(map(res => { return res?.result?.data || []}));
    } else {
      return this.apiService.get( 'filter/getFilter?model='+entity)
        .pipe(map(res => { return res?.result?.data || []}));
    }

  }

  getFilter(entity) {
    return this.apiService.get( 'filter/getFilter?model='+entity)
      .pipe(map(res => { return res?.result?.data || []}));
  }

  getPermissionsByElement(){

  }
}
