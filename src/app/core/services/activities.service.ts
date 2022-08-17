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
}
