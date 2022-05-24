import {Injectable} from '@angular/core';
import { ApiService } from './api.service';
import { NgxPermissionsService } from 'ngx-permissions';
import {UserStore} from '@store/user.store';
import {JwtStore} from '@store/jwt.store';
import {catchError, Observable, throwError} from 'rxjs';
import {environment} from '@env/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MainStore} from '@store/mainStore.store';
import {DomSanitizer} from '@angular/platform-browser';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {

    constructor(private apiService: ApiService,
                // private jwtService: JwtService,
                private http: HttpClient,
                private userStore: UserStore,
                private sanitizer: DomSanitizer,
                private jwtStore: JwtStore,
                private mainStore: MainStore,
                private permissionsService: NgxPermissionsService) { }


    // Verify JWT in localstorage with server & load user's info.
    // This runs once on application startup.

// /api/public/api/categories/all?model=Personnel
    async populate() {
        console.log('Populating');
        try {
            const res = await this.apiService
                .get('auth/getAuthenticatedUser')
                .toPromise();
            if(res?.result?.data){
                this.setAuth({
                    ...res.result.data
                });
                return true;
            }else{
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
        return this.apiService.post('login', credentials).pipe(map(res => {
            console.log(res);

          this.setAuth(res.result.data);
          return res.result.data;
        }));
    }


    setAuth({ user, token }: any) {

        console.log('setAuth', user, token)
        if(user) this.permissionsService.loadPermissions([user.role]);

        // Save JWT sent from server in localstorage
        // this.jwtService.saveToken(token)
        this.jwtStore.saveToken(token);
        this.userStore.setAuthenticatedUser(user);
    }

    purgeAuth() {
      console.log('purge auth');
        this.permissionsService.flushPermissions();
        // Remove JWT from localstorage
        this.jwtStore.destroyToken();
        this.userStore.setAuthenticatedUser(null);
    }

    acceptCGU() {
        return this.apiService
                    .get('auth/accept/cgu')
                    .pipe(map(res => res.result.data));
    }


    getUsers(params): any {
        return this.apiService
          .post('personnels/search', params)
          .pipe(map(result => result.result  || []));
    }


    addUser(info): any {
        return this.apiService
                    .post('user/add', info)
                    .pipe(map(resp => resp.result));
    }

    updateProfile(info): any {
        return this.apiService
                    .post('profile/update', info)
                    .pipe(map(resp => resp.result));
    }

    updateProfilePassword(payload): any {
        return this.apiService
                    .post('profile/password/update', payload)
                    .pipe(map(resp => resp.result));
    }


    changePwdRequest(credentials): any {
        return this.apiService
                    .post('password/create', credentials)
                    .pipe(map(resp => resp.result));
    }

    checkResetToken(token): any {
        return this.apiService
                    .get('password/find/'+ token)
                    .pipe(map(resp => resp.result.data));
    }

    resetPwd(credentials): any {
        return this.apiService
                    .post('password/reset', credentials)
                    .pipe(map(resp => resp.result));
    }

    loggout(){
        return this.apiService.post('logout', {});
    }


    getPhoto(photoname: String): Observable<any>{
        return this.http.get(environment.photosBaseUrl+photoname+'?token='+this.jwtStore.token, {responseType: 'blob'})
            .pipe(catchError((error: HttpErrorResponse) => throwError(()=>error)));
    }

  async getImageSafeUrl(link, defaultImage, safeUrl = true) {
      console.log('getImageSafeUrl', link);
    if (link) {
      const image = this.mainStore.images.find(item => item.name === link);
      // if(!image){
      try {
        let res;
        if(!image){
          res = await this.getPhoto(link).toPromise();
          if(res?.return?.code !== 200 || res?.errors){
            throwError(() => {});
          }
        }else{
          res = image.value;
        }
        this.mainStore.images.push({name: link, value: res});
        const imageLink = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(res));
        const imageUrl = window.URL.createObjectURL(res);
        return !safeUrl ? imageUrl : imageLink;
      }catch (error) {
        console.log(error);
        return defaultImage;
        // if(isAvatar){
        //   return 'assets/images/'+'man.png';
        // }else{
        //   return '/assets/images/logo_placeholder_2.png';
        // }
      }
    }
  }

    delete(params) {
        return this.apiService.post('users/delete', params);
    }

    update(params) {
        return this.apiService.post('personnel/'+params?.id+'/update', params);
    }

    getOne(params){
        return this.apiService.get('personnel/'+ params);
    }

  setProfilePicture(params: any) {
    return this.apiService.post('personnel/photo-profil', params);
  }

  getCategoriesFonctions(){
    return this.apiService.get('categories/all?model=Personnel');
  }

  getTypes(param){
    return this.apiService.get('types?model='+param);
  }

  getStatus(){
    return this.apiService.get('status?model=Personnel');
  }
}
