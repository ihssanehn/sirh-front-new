import { Injectable } from '@angular/core';
import {action, computed, observable} from 'mobx';

@Injectable()
export class JwtStore {
  @observable token;

  @computed
  get getToken(): string {
    this.token = localStorage.getItem('token');
    return this.token;
  }

  @action
  saveToken(token: string) {
    console.log('saveToken', token);
    localStorage.setItem('token', token);
    this.token = token;
  }

  @action
  destroyToken() {
    localStorage.removeItem('token');
    this.token = '';
  }

}
