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
export class UserService {

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

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.

  async populate() {
    console.log('Populating');
    try {
      const res = await this.apiService.get('user/auth').toPromise();
      if (res?.result?.data) {
        this.setAuth({ user: res.result.data });
        return true;
      } else {
        this.purgeAuth();
        return false;
      }
    } catch (error) {
      console.log('purge auth', error);
      this.purgeAuth();
      return false;
    }
  }

  signin(credentials): any {
    return this.apiService.post('user/signin', credentials).pipe(
      map((res) => {
        console.log(res);
        this.setAuth({ user: res.result.data, token: res.result.data.token });
        return res.result;
      })
    );
  }

  setAuth({ user, token }: any) {
    console.log('setAuth', user, token);
    if(user) this.permissionsService.loadPermissions([user.role_name]);

    // Save JWT sent from server in localstorage
    if (token) {
      this.jwtStore.saveToken(token);
    }
    this.userStore.setAuthenticatedUser(user);

    if([$userRoles.GP, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.ADV].includes(this.userStore.getAuthenticatedUser.role_name) &&
      this.userStore.getAuthenticatedUser.profile_name === $userProfiles.ASSISTANT){
      this.userStore.getAuthenticatedUser.can_selectEntities = true;
    }else{
      this.mainStore.selectedEntities = [user.entity];
      console.log('localStorage.setItem(selectedEntities', this.mainStore.selectedEntities);
      localStorage.setItem('selectedEntities', JSON.stringify(this.mainStore.selectedEntities));
      this.userStore.getAuthenticatedUser.can_selectEntities = false;
    }
  }

  purgeAuth() {
    this.permissionsService.flushPermissions();
    // Remove JWT from localstorage
    this.jwtStore.destroyToken();
    this.userStore.setAuthenticatedUser(null);
  }


    getUsers(params): any {
      if(params?.type == 'entree') //temp condition before merging mouad and nawel stuff
        return this.apiService
        .post('personal_a/entrances/all', params)
        .pipe(map(result => result.result  || []));
      else if(params?.type == 'sortie') //temp condition before merging mouad and nawel stuff
        return this.apiService
        .post('personal_a/sorties/all', params)
        .pipe(map(result => result.result  || []));
      else if(params?.type == 'visite_medicale') //temp condition before merging mouad and nawel stuff
        return this.apiService
          .post('personal/medical_visit/all', params)
          .pipe(map(result => result.result  || []));
      else if(params?.type == 'entretien') //temp condition before merging mouad and nawel stuff
          return this.apiService
            .post('personal/interview/all', params)
            .pipe(map(result => result.result  || []));
      else if(params?.type == 'period_essai') //temp condition before merging mouad and nawel stuff
            return this.apiService
              .post('personal/personal_trial_period/all', params)
              .pipe(map(result => result.result  || []));
      else if(params?.type == 'formation')
            return this.apiService
              .post('personal/personal_formation/all', params)
              .pipe(map(result => result.result  || []));

      else
        return this.apiService
          .post('personal/getAllPersonalsPost', params)
          .pipe(map(result => result.result  || []));
    }


    addUser(info): any {
        return this.apiService
                    .post('user/user/add', info)
                    .pipe(map(resp => resp.result));
    }

    updateProfile(info): any {
        return this.apiService
                    .post('user/profile/update', info)
                    .pipe(map(resp => resp.result));
    }

  updateProfilePassword(payload): any {
    return this.apiService
      .post('user/profile/password/update', payload)
      .pipe(map((resp) => resp.result));
  }

  changePwdRequest(credentials): any {
    return this.apiService
      .post('user/password/create', credentials)
      .pipe(map((resp) => resp.result));
  }

  checkResetToken(token): any {
    return this.apiService
      .get('user/password/find/' + token)
      .pipe(map((resp) => resp.result.data));
  }

  resetPwd(credentials): any {
    return this.apiService
      .post('user/password/reset', credentials)
      .pipe(map((resp) => resp.result));
  }

  loggout() {
    return this.apiService.post('user/logout', {});
  }

  getPhoto(photoname: String): Observable<any> {
    const token = this.jwtStore.getToken;
    console.log('getPhoto', photoname);
    return this.http
      .get(`${photoname}`, {
        responseType: 'blob',
        params: null,
        observe: 'response',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'image/jpeg',
          'accept': '*',
          'responseType': 'blob',
        }
      });
  }

  async getImageSafeUrl(link, defaultImage, safeUrl = true) {
    if (link) {
      const image = this.mainStore.images.find((item) => item.name === link);
      // if(!image){
      console.log('getPhoto link', link)
      try {
        let res;
        if (!image) {
          res = await this.getPhoto(link).toPromise();
          console.log("anass res" , res);
          if(res?.return?.code !== 200 || res?.errors){
            throwError(() => {});
          }
        }else{
          res = image.value;
        }
        this.mainStore.images.push({name: link, value: res});
        const imageUrl = window.URL.createObjectURL(res.body);
        const imageLink = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
        return !safeUrl ? imageUrl : imageLink;
      } catch (error) {
        console.log(error);
        return defaultImage;
      }
    }
  }

    delete(params) {
        return this.apiService.post('user/users/delete', params);
    }

    update(params) {
        return this.apiService.post('user/personnel/'+params?.id+'/update', params);
    }

    getOnePersonal(params){
        return this.apiService.get('personal/getPersonal?personal_id='+ params.id);
    }

    getOneUser(id){
        return this.apiService.get('user/getUserDetails?id='+ id);
    }

    getDetailed(params){
      return this.apiService.get('personal_a/get/'+ params.id);
    }


  setProfilePicture(params: any) {
    return this.apiService.post('user/personnel/photo-profil', params);
  }

  getCategoriesFonctions(){
    return this.apiService.get('user/categories/all?model=Personnel');
  }

  getTypes(param){
    return this.apiService.get('user/types?model='+param);
  }

  getStatus(){
    return this.apiService.get('user/status?model=Personnel');
  }

  // Stepper
  submitUser(params) {
    return this.apiService.post('personal/addPersonal', params);
  }

  submitUpdateUser(params) {
    return this.apiService.post('personal/updatePersonal', params);
  }

  submitPerimeters(params) {
    return this.apiService.post('personal/addPersonalPerimeter', params);
  }

  submitAccess(params) {
    return this.apiService.post('permission/addUserPermissions', params);
  }

  submitParameters(params: any) {
    return this.apiService.post('parameter/addOrUpdateParameter', params);
  }

  getRHDocuments(params) {
    return this.apiService.post('personal/getAllDocuments', params);
  }

  addRHDocument(params, option = null) {
    return this.apiService.post('personal/addDocument', params, option);
  }

  updateRHDocument(params, option = null) {
    return this.apiService.post('personal/updateDocument', params, option);
  }

  downloadDocument(params) {
    return this.apiService.get(`personal/getAttachment`, params, true);
  }

  deleteDocument(params: { id: any }) {
    return this.apiService.post(`personal/deleteDocument`, params);
  }

  getDefaultProfilePermissionByProfileId(params) {
    return this.apiService.post(`permission/getDefaultProfilePermissionByProfileId`, params);
  }

  addOrUpdatePersonalCost(params) {
    return this.apiService.post('personal/addOrUpdatePersonalCost', params);
  }

  submitUserGroup(params) {
    return this.apiService.post('personal/addUserGroup', params);
  }

  addInterview(params) {
    return this.apiService.post('personal/interview/add', params);
  }

  addVM(params) {
    return this.apiService.post('personal/medical_visit/add', params);
  }

  listActions(params) {
    return this.apiService.post('action/list', params)
    .pipe(map(res => { return res?.result?.data || []}));
  }

  markActionAsDone(params) {
    return this.apiService.post('action/markAsDone', params)
    .pipe(map(res => { return res?.result?.data || []}));
  }

  addComment(params) {
    return this.apiService.post('action/addComment', params)
    .pipe(map(res => { return res?.result?.data || []}));
  }

  getTypesByModel(model) {
    return this.apiService.get('personal_a/types/'+ model)
    .pipe(map(res => { return res?.result?.data || []}));
  }


  addUserWithPermissions(params) {
    return this.apiService.post('user/addUserWithPermissions', params)
      .pipe(map(res => { return res?.result?.data || []}));
  }

  updateUserWithPermissions(params) {
    return this.apiService.post('user/updateUserWithPermissions ', params)
      .pipe(map(res => { return res?.result?.data || []}));
  }

  getListUsers(params){
    return this.apiService.post('user/getListUsers', params)
      .pipe(map(res => { return res?.result }));
  }
}
