import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators'

@Injectable()
export class ActivitiesService {


  constructor(private apiService: ApiService) {}

  getAll(params): any {
    return this.apiService
      .post('activity/getAllActivities', params)
      .pipe(map(res => res.result  || []));
  }

  getHistoryOfActivity(params) {
    return this.apiService
      .post('activity/getHistoryOfActivity', params)
      .pipe(map(res => res.result  || []));
  }

  getStatsActivity(params) {
    return this.apiService
      .post('activity/getStatsActivity', params)
      .pipe(map(res => res.result  || []));
  }

  getActivityByMonth(params) {
    return this.apiService
      .get('activity/getActivityByMonth', params)
      .pipe(map(res => res.result  || []));
  }

  getActivityById(params) {
    return this.apiService
      .get('activity/getActivityById', params)
      .pipe(map(res => res.result  || []));
  }

  getInformationForActivity(params) {
    return this.apiService
      .post('activity/getInformationForActivity', params)
      .pipe(map(res => res.result  || []));
  }

  addOrUpdateActivity(params) {
    return this.apiService
      .post('activity/addOrUpdateActivity', params)
      .pipe(map(res => res.result  || []));
  }

  diffuseActivity(params) {
    return this.apiService
      .post('activity/diffuseActivity', params)
      .pipe(map(res => res.result  || []));
  }

  addOrUpdateAdvanceCost(params) {
    return this.apiService
      .post('advance_cost/addOrUpdateAdvanceCost', params)
      .pipe(map(res => res.result  || []));
  }

  addPayment(params) {
    return this.apiService
      .post('advance_cost/addPayment', params)
      .pipe(map(res => res.result  || []));
  }

  getAdvanceCost(params) {
    return this.apiService
      .get('advance_cost/getAdvanceCost', params)
      .pipe(map(res => res.result  || []));
  }


  getSummaryAdvanceCosts(params) {
    return this.apiService
      .post('advance_cost/getSummaryAdvanceCosts', params)
      .pipe(map(res => res.result  || []));
  }

  getAllAdvanceCosts(params) {
    return this.apiService
      .post('advance_cost/getAllAdvanceCosts', params)
      .pipe(map(res => res.result  || []));
  }

  validateOrRefuseAdvanceCost(params) {
    return this.apiService
      .post('advance_cost/validateOrRefuseAdvanceCost', params)
      .pipe(map(res => res.result  || []));
  }

  exportAdvanceCost(params) {
    return this.apiService
      .post('advance_cost/exportAdvanceCost', params, true);
  }

  deleteAvanceFrais(params) {
    return this.apiService
      .post('advance_cost/deleteAdvanceCost ', params);
  }

  cancelDiffusion(params: any) {
    return this.apiService
      .post('activity/cancelDiffusedActivity', params);
  }

  getDuration(params: any) {
    return this.apiService
      .post('absence_request/getDuration', params);
  }

  addOrUpdateAbsenceRequest(params: any) {
    return this.apiService
      .post('absence_request/addOrUpdateAbsenceRequest', params);
  }

  getAbsenceRequestById(params) {
    return this.apiService
      .get('absence_request/getAbsenceRequestById', params)
      .pipe(map(res => res.result  || []));
  }

  getAllAbsenceRequest(params) {
    return this.apiService
      .post('absence_request/getAllAbsenceRequest', params)
      .pipe(map(res => res.result  || []));
  }

  getSummaryAbsenceRequest(params) {
    return this.apiService
      .post('absence_request/getSummaryAbsenceRequest', params)
      .pipe(map(res => res.result  || []));
  }

  validateOrRefuseOrDemandChangeAbsenceRequest(params) {
    return this.apiService
      .post('absence_request/validateOrRefuseOrDemandChangeAbsenceRequest', params)
      .pipe(map(res => res.result  || []));
  }

  getAllDelegation(params) {
    return this.apiService
      .post('delegation/getAllDelegation', params)
      .pipe(map(res => res.result  || []));
  }

  addOrUpdateDelegation(params) {
    return this.apiService
      .post('delegation/addOrUpdateDelegation', params)
      .pipe(map(res => res.result  || []));
  }

  getDelegationById(params) {
    return this.apiService
      .get('delegation/getDelegationById', params)
      .pipe(map(res => res.result  || []));
  }
}
