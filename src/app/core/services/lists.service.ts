import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators'

@Injectable()
export class ListsService {

  public list = {
    CONTRACT: 'contract',
    FUNCTION: 'function',
    FAMILY_SITUATION: 'family_sitution',
    ENTITY: 'entity',
    PROFILE: 'profile',
    STATUS: 'status',
    PERSONAL: 'personal',
    MANAGER: 'manager',
    PROFIT_CENTER: 'profit_center',
    SUPPLIER: 'supplier',
    PERMISSIONS_BY_ELEMENT: 'permission/getPermissionsByElement',
    MEMBER_SHIP: 'member_ship',
    CALENDAR: 'calendar',
    TEMPS: 'temps',
    TRAL_PERIOD: 'trial_period',
    FISCAL_POWER: 'fiscal_power',
    ROLE: 'role',
    COUNTRY: 'country',
    CITY: 'city',
    DOCUMENT_TYPE: 'document_type',
    SITUATION_ALERT: 'situation_alert',
    USERS: 'users'
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
      const getparams = {
        model: entity,
        ...params
      }
      return this.apiService.get( 'filter/getFilter', getparams)
        .pipe(map(res => { return res?.result?.data || []}));
    }

  }

  getFilter(entity) {
    return this.apiService.get( 'filter/getFilter?model='+entity)
      .pipe(map(res => { return res?.result?.data || []}));
  }

  getPersonalFilters(){
    return this.apiService.get( 'filter/getPersonalFilters')
      .pipe(map(res => { return res?.result?.data || []}));
  }

  getPermissionsByElement(){

  }

  getParameters() {
    return this.apiService.get( 'category/getParameters')
      .pipe(map(res => { return res?.result?.data || []}));

  }
}
