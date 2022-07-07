import { Injectable } from '@angular/core';
import {action, computed, observable} from "mobx";
// import 'rxjs/add/operator/map';



@Injectable()
export class UserStore {

  @observable authenticatedUser;

  constructor(

  ) {}


  @computed
  get getAuthenticatedUser(){
    return this.authenticatedUser;
  }

  @action
  setAuthenticatedUser(user) {
    // try {
      console.log('setAuthenticatedUser', user);
      this.authenticatedUser = user;
    // }catch (e) {
    //   console.log(e);
    // }
  }

}
