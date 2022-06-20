import { Injectable } from '@angular/core';
import { ApiService } from './api.service';


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
    PROFIT_CENTER: 'PROFIT_CENTER'
  }
  constructor(private apiService: ApiService) {}

  getAll(entity, params = null) {
    if(entity === this.list.STATUS){
      return this.apiService.get( 'status/getStatusByModel?model='+params);
    } else{
      return this.apiService.get( '/filter/getFilter?model='+entity);
    }
  }
}
