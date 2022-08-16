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
}
