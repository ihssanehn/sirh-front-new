import { Component, OnInit } from '@angular/core';
import {MainStore} from '@store/mainStore.store';
import {UserStore} from '@store/user.store';
import {$headerItems, $userRoles} from '@shared/Objects/sharedObjects';
import {Router} from '@angular/router';
import {UserService} from '@app/core/services';
import {ListsService} from "@services/lists.service";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  $userRoles = $userRoles;
  status = [];
  $headerItems = $headerItems;
  myForm: FormGroup;
  constructor(
    public mainStore: MainStore,
    public userStore: UserStore,
    public userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private listService: ListsService,
  ) {
    this.myForm = this.fb.group({
      status: new FormArray([]),
    });
    this.getEntites();
  }
  ngOnInit(): void {
  }

  toggleSidebar(){
    this.mainStore.sidebarOpened = !this.mainStore.sidebarOpened;
  }

  searchIt() {

  }

  async getEntites(){
    console.log('header getStatus');
    try{
      const res = await this.listService.getAll(this.listService.list.ENTITY).toPromise();
      this.status = res;
      console.log('header getStatus', res);
    }catch (e){

    }finally {

    }
  }

  async logOut(){
    try {
      await   this.userService.purgeAuth();
      this.router.navigate(['/auth/signin']).then(async ()=>{

        // try {
        //    const res = await this.userService.loggout().toPromise();
        // }catch (e){
        //
        // }
      });
    } catch (error) {
      console.log('error', error);
    }
  }

  ischecked(id) {
    return this.myForm?.value?.statuts?.includes(id);
  }

  onCheckChange(event, item) {
    const formArray: FormArray = this.myForm.get('status') as FormArray;

    console.log('event', event.target.checked, event);
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(item.id));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == item.id) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
}
