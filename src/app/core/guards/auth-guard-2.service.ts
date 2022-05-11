import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {JwtStore} from '@store/jwt.store';
import {UserService} from '@app/core/services';

@Injectable()
export class AuthGuard2 implements CanActivate {
  constructor(private router: Router,
              private userService: UserService,
              private jwtStore:JwtStore) {}

  async canActivate() {
    console.log('AuthGuard2');
    // if(!)state
    if (this.jwtStore.getToken) {
      const result = await this.userService.populate();
      if(result){
        this.router.navigate(['/']);
      }else{
        return true;
      }
    }else{
      console.log('there is no token');
      return true;
    }
  }
}
