import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MainStore} from '@store/mainStore.store';
import {UserStore} from '@store/user.store';
import {$headerItems, $userRoles} from '@shared/Objects/sharedObjects';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from '@app/core/services';
import {ListsService} from "@services/lists.service";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  $userRoles = $userRoles;
  status = [];
  $headerItems = $headerItems.filter(item => item.display);
  myForm: FormGroup;
  constructor(
    public mainStore: MainStore,
    public userStore: UserStore,
    public userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private listService: ListsService,
  ) {
    this.mainStore.selectedEntities = JSON.parse(localStorage.getItem('selectedEntities'));

    this.myForm = this.fb.group({
      status: new FormArray([]),
    });

    if(this.mainStore.selectedEntities && this.mainStore.selectedEntities?.length>0){
      const fa = this.myForm.get('status') as FormArray;
      this.mainStore.selectedEntities.forEach(item => {
        fa.push(new FormControl(item.id));
      })
    }

    this.getEntites();
  }
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    console.log('header this.myForm.value', this.mainStore.currentHeaderSection);
    if(this.mainStore.selectedEntities && this.mainStore.selectedEntities?.length>0){
      if(this.mainStore.selectedEntities?.length>1){
        // Multiple items are already selected but section doees not support multiple select
        if(!this.mainStore.currentHeaderSection?.multipleEntities){
          this.clearEntities();
        }
      }
    }
  }

  clearEntities(){
    const fa = this.myForm.get('status') as FormArray;
    fa.reset();
    localStorage.removeItem('selectedEntities');
    this.mainStore.selectedEntities = [];
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
    return this.myForm?.value?.status?.includes(id);
  }

  onCheckChange(event, item) {
    const formArray: FormArray = this.myForm.get('status') as FormArray;

    console.log('event', event.target.checked, event);
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      if(!this.mainStore.currentHeaderSection?.multipleEntities){
        this.clearEntities();
      }
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

    this.mainStore.selectedEntities = this.status.filter(element => formArray.value.includes(element.id));
    localStorage.setItem('selectedEntities', JSON.stringify(this.mainStore.selectedEntities));
    this.checkEntities();
  }

  checkEntities(){
      if(!(this.mainStore.selectedEntities?.length>0)) {
        this.router.navigate(['/accueil']).then(() => {
          this.messageService.add({
            severity: 'warning',
            summary: 'Echec!',
            detail: 'Veillez sélectioner une entité',
            sticky: false
          });
        });
      }
  }

}
