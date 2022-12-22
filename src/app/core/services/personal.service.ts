import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {NgxPermissionsService} from 'ngx-permissions';
import {UserStore} from '@store/user.store';
import {JwtStore} from '@store/jwt.store';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MainStore} from '@store/mainStore.store';
import {DomSanitizer} from '@angular/platform-browser';
import {map} from 'rxjs/operators';
import {$userProfiles, $userRoles} from "@shared/Objects/sharedObjects";

@Injectable()
export class PersonalService {

  $userRoles = $userRoles;
  $userProfiles = $userProfiles;
  constructor(
    private apiService: ApiService,
    // private jwtService: JwtService,
    private http: HttpClient,
    private userStore: UserStore,
    private sanitizer: DomSanitizer,
    private jwtStore: JwtStore,
    private mainStore: MainStore,
    private permissionsService: NgxPermissionsService
  ) {}

  submitEntree(params) {
    return this.apiService.post('personal_a/create', params);
  }

  getTheoricalDateCalulation(param) {
    return this.apiService.post('personal_a/getTheoricalDateCalulation', param);
  }

  addEntretien(params: any) {
    return this.apiService.post('personal_a/interview/add', params);
  }

  updateEntretien(params) {
    return this.apiService.post('personal_a/interview/update', params);
  }
}
