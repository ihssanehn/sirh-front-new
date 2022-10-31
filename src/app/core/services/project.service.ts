import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators'

@Injectable()
export class ProjectService {


  constructor(private apiService: ApiService) {}

  addOrUpdateMission(params) {
    return this.apiService
      .post('mission/addOrUpdateMission', params)
      .pipe(map(res => res.result  || []));
  }

  getProjectById(params) {
    return this.apiService
      .get('mission/getMissionById', params)
      .pipe(map(res => res.result  || []));
  }
}
