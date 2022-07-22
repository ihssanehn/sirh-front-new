import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatStepper} from "@angular/material/stepper";
import {User} from "@app/core/entities";


@Component({
  selector: 'app-simple-add-stepper',
  templateUrl: './simple-add-stepper.component.html',
  styleUrls: ['./simple-add-stepper.component.scss']
})
export class SimpleAddStepperComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') private myStepper: MatStepper;
  isEditable = true;
  profile_id: number;
  user: User;

  @ViewChildren('stepperIcon') private matStepperIconViewChildren;
  matStepperIcons: any[];
  submittingUser: boolean;
  submittingPerimeters: boolean;
  submittingParameters: boolean;
  submittingAccess: boolean;
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

  async ngAfterViewInit() {
    this.matStepperIcons = this.matStepperIconViewChildren.toArray();
    this.myStepper.selectedIndex = 0;
    this.activatedRoute?.queryParams?.subscribe(async params => {
      const step = Number(params.step);
      const user_id = Number(params.user_id);
      if(this.myStepper){
        if([0, 1, 2, 3, 4].includes(step)){
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
        await this.getUser(user_id);
        if(!this.user){
          this.moveForward(0);
        }
      }else {
        this.moveForward(0);
      }
      this.changeDetectorRef.detectChanges();
    })
  }

  async getUser(id){
    try{
      const res = await this.userService.getOne({id}).toPromise();
      this.user = res.result?.data;
    }catch (e) {
      console.log('getUser error', e);
    }finally {

    }
  }

  move(index: number) {
    console.log('this.myStepper.selectedIndex', this.myStepper.selectedIndex);
  }

  submitRole($event: any) {
    this.profile_id = $event;
    if( this.profile_id) this.moveForward(1);
  }

  selectionChange($event) {
    const snapshot = this.activatedRoute.snapshot;
    let params = { ...snapshot.queryParams, step: $event.selectedIndex};
    this.router.navigate(['.'],
      { relativeTo: this.activatedRoute, queryParams: params, queryParamsHandling: 'merge'});
  }

  moveForward(step, other_params?) {
    if(this.myStepper){

      const snapshot = this.activatedRoute.snapshot;
      let params = { ...snapshot.queryParams, step: step};

      if(other_params){
        params = {...params, ...other_params}
      }
      this.router.navigate(['.'],
        { relativeTo: this.activatedRoute, queryParams: params, queryParamsHandling: 'merge'});
    }
  }

  async submitUser($event: any) {
    try{
      this.submittingUser = true;
      const fd = new FormData();
      Object.keys($event).forEach(key => {
        if(key === 'photo_profile'){
          if($event[key] instanceof File){// Cas de Ajout ou modification de photo
            fd.append(key, $event[key]);
          }else if(!($event[key]?.length>0)){ // Cas de suppression de photo
            fd.append('delete_photo_profile', 'true');
          }
        }else{
          if($event[key] != null){
            fd.append(key, $event[key]);
          }
        }
      });
      let res;
      if($event?.id){
         res = await this.userService.submitUpdateUser(fd).toPromise();
      }else{
         res = await this.userService.submitUser(fd).toPromise();
      }
      if(res?.result?.data?.id){
        this.moveForward(1, {user_id: res?.result?.data?.id});
        this.user = res.result.data;
      }
    }catch (e){
      this.messageService.add({
        severity: 'error',
        summary: "Erreur ",
        detail: 'Une erreur est survenue',
        sticky: false,
      });
      console.log('error submit user', e);
    }finally {
      this.submittingUser = false;
    }
  }

  async submitPerimeters($event: any) {
    try{
      this.submittingPerimeters = true;
      const params = {
        personal_id: this.user.id,
        personal_perimeter_ids: $event
      }
      const res = await this.userService.submitPerimeters(params).toPromise();
      this.moveForward(4);
    }catch (e){

    }finally {
      this.submittingPerimeters = false;
    }
  }

  async submitAccess($event: any) {
    try{
      this.submittingAccess = true;
      const params = {
        user_id: this.user?.id,
        permission_ids: $event.permissions
      }
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
      this.submittingAccess = false;
    }
  }

  async submitParameters($event: any) {
    try{
      this.submittingParameters = true;
      const res = await this.userService.submitParameters($event).toPromise();
      if(res?.result?.data){
        this.moveForward(2);
      }
    }catch (e){

    }finally {
      this.submittingParameters = false;
    }
  }

}

