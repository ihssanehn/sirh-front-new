// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { UserService } from '../services/user.service';
// import {UserStore} from '@store/user.store';
//
//
//
// @Injectable()
// export class AuthGuard implements CanActivate {
//
//   constructor(private router: Router,
//               private userService: UserService,
//               private userStore: UserStore,
//               ) {}
//
//   async canActivate() {
//     console.log('canActivate');
//     const data = await this.userService.populate();
//
//     if(data){
//       // if (!data.user.cgu_accepted) {
//         if(!this.userStore.getAuthenticatedUser.cgu_accepted){
//           this.router.navigate(['/auth/cgu']);
//         }
//       // }
//       else {
//         return true;
//       }
//     }
//     else{
//       this.router.navigate(['/auth']);
//     }
//
//   }
// }
