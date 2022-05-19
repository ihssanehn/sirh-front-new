import { Injectable} from '@angular/core';
import {computed, observable, toJS} from 'mobx';
import {UserStore} from '@store/user.store';
import {$sidebarItems_users} from "@shared/Objects/sharedObjects";



interface Image {name: string; value: string;}

@Injectable()
export class MainStore {
  @observable sidebarOpened = true;
  @observable selectedLanguage;
  @observable current_academic_year;


  @observable images: Array<Image> = [];
  @observable sidebarOverMode;
  @observable  noPaddingPage: boolean;



  constructor(private userStore: UserStore) {
    console.log('MainStore', toJS(this.userStore.getAuthenticatedUser));
  }


  @computed
  get getItems() {
    return $sidebarItems_users;
  }



}
