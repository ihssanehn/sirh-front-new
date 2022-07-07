import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {

  private token = null;

  private tokenName = 'globalToken'

  getToken(): string {
    // If token has been removed by another app
    if( localStorage.getItem( this.tokenName ) == null ){
      this.saveToken(this.token)
      return this.token
    }
    else
      return localStorage.getItem( this.tokenName );
  }

  saveToken(token: string) {
    this.token = token;
    localStorage.setItem( this.tokenName , token);
  }

  destroyToken() {
    this.token = null;
    localStorage.removeItem( this.tokenName );
  }
}
