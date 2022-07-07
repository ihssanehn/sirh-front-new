import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '@services/user.service';



@Injectable()
export class PwdChangedGuard implements CanActivate {

  constructor(private router: Router,
              private userService: UserService) {}

  async canActivate() {

    // if(!this.userService.getCurrentUser().pwd_changed){
    //   console.log('%c-----------------', 'font-size:30px;color:green');
    //   console.log('PwdChangedGuard', this.userService.getCurrentUser())
    //   console.log('%c-----------------', 'font-size:30px;color:green');
    // }

    return true;

  }
}
