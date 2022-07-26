import { Injectable} from '@angular/core';
import {computed, observable, observe, toJS} from 'mobx';
import {UserStore} from '@store/user.store';
import {$headerSectionsMetaData, $sidebarItems_users} from "@shared/Objects/sharedObjects";
import {Observable} from "rxjs";
import Swal from "sweetalert2";



interface Image {name: string; value: string;}

@Injectable()
export class MainStore {
  @observable sidebarOpened = true;
  @observable selectedLanguage;
  @observable current_academic_year;
  @observable selectedEntities = [];
  @observable multipleEntities = false;


  @observable images: Array<Image> = [];
  @observable sidebarOverMode;
  @observable noPaddingPage: boolean;
  @observable currentHeaderSection = null;


  constructor(private userStore: UserStore) {
    console.log('MainStore', toJS(this.userStore.getAuthenticatedUser));
  }


  @computed
  get getItems() {
    switch (this.currentHeaderSection?.name){
      case 'utilisateur': {
        return $sidebarItems_users;
      }
      case 'accueil': {
        break;
      }
    }

  }

  toRx(obj, prop) {
    return Observable.create(observer =>
      observe(obj, prop, (change) => observer.next(change.newValue), true)
    );
  }


  showMessage(title='', message, type){
    return Swal.fire({
      title: title,
      text: message,
      icon: type,
      confirmButtonColor: '#078aff',
    });
  }
}
