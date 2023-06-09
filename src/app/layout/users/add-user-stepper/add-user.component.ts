import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatStepper} from "@angular/material/stepper";
import {debounceTime, timeout} from "rxjs";
import {User} from "@app/core/entities";
import {forEach} from "angular";



@Component({
  selector: 'app-add-user-stepper',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') private myStepper: MatStepper;
  isEditable = true;
  profile_id: number;
  user: User;
  constructor(
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private userService : UserService
  ) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.myStepper.selectedIndex = 0;
    this.activatedRoute?.queryParams?.subscribe(params => {
      const step = Number(params.step);
      const user_id = Number(params.user_id);
      console.log('moving', step);
      if(this.myStepper){
        if([0, 1, 2, 3].includes(step)){
          console.log('moved', step);
          // this.myStepper.selectedIndex = step;
          if(this.myStepper.selectedIndex < step){
            while (this.myStepper.selectedIndex < step){
              this.myStepper.selectedIndex = this.myStepper.selectedIndex + 1;
            }
          }else if(this.myStepper.selectedIndex > step){
            while (this.myStepper.selectedIndex > step){
              this.myStepper.selectedIndex = this.myStepper.selectedIndex - 1;
            }
          }
        }else{
          this.moveForward(0);
        }
      }
      if(user_id){
        this.getUser(user_id);
      }
      this.changeDetectorRef.detectChanges();
    })
  }

  async getUser(id){
    try{
      const res = await this.userService.getOnePersonal({id}).toPromise();
      this.user = res.result?.data;
    }catch (e) {
      console.log('getUser error', e);
    }finally {

    }
  }

  move(index: number) {
    console.log('this.myStepper.selectedIndex', this.myStepper.selectedIndex);
  }


  moveForward(step, other_params?) {
    if(this.myStepper){
      console.log('moveForward', step);

      const snapshot = this.activatedRoute.snapshot;
      let params = { ...snapshot.queryParams, step: step};

      if(other_params){
        params = {...params, ...other_params}
      }
      this.router.navigate(['/users/new'],
        { relativeTo: this.activatedRoute, queryParams: params, queryParamsHandling: 'merge'});
    }
  }


  async submitUser($event: any) {
    try{
      if(this.user?.id){
        this.moveForward(2, {user_id: this.user?.id}); //todo delete
        return;
        const res = await this.userService.submitUser($event).toPromise();
        if(res?.result?.data?.id){
          this.moveForward(2, {user_id: res?.result?.data?.id});
        }
      }
      const fd = new FormData();
      Object.keys($event).forEach(key => {
        if($event[key] != null){
          fd.append(key, $event[key]);
        }
      })
      const res = await this.userService.submitUser(fd).toPromise();
      if(res?.result?.data?.id){
        this.moveForward(2, {user_id: res?.result?.data?.id});
      }
    }catch (e){

    }finally {

    }
  }

  async submitPerimeters($event: any) {
    try{
      const params = {
        personal_id: this.user.id,
        personal_perimeter_ids: $event
      }
      const res = await this.userService.submitPerimeters(params).toPromise();
      this.moveForward(3);
    }catch (e){

    }finally {

    }
  }

  async submitAccess($event: any) {
    try{

      const params = {
        user_id: this.user?.id,
        permission_ids: $event.permissions
      }
      console.log('submitAccess', params);
      const res = await this.userService.submitAccess(params).toPromise();
      this.router.navigate(['/users']).then(()=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Parfait!',
          detail: 'Mise à jour réussie',
          sticky: false,
        });
      });
    }catch (e){

    }finally {

    }
  }

  submitRole($event: any) {
    this.profile_id = $event;
    if( this.profile_id) this.moveForward(1);
  }
}

