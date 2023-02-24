import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { FormBuilder} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatStepper} from "@angular/material/stepper";
import {User, PersonalAnnex} from "@app/core/entities";
import {MainStore} from "@store/mainStore.store";
import { PersonalService } from '@app/core/services/personal.service';


@Component({
  selector: 'app-advanced-add-stepper',
  templateUrl: './advanced-add-stepper.component.html',
  styleUrls: ['./advanced-add-stepper.component.scss']
})
export class AdvancedAddStepperComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') private myStepper: MatStepper;
  isEditable = true;
  profile_id: number;
  user: PersonalAnnex;

  @ViewChildren('stepperIcon') private matStepperIconViewChildren;
  matStepperIcons: any[];
  submittingEntree: boolean;
  submittingPerimeters: boolean;
  submittingParameters: boolean;
  submittingAccess: boolean;
  cameFrom: string;
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
    private mainStore: MainStore,
    private userService : PersonalService
  ) {

  }

  ngOnInit(): void {
    console.clear()
  }

  async ngAfterViewInit() {
    console.log('my stepper :::',this.myStepper)
    this.matStepperIcons = this.matStepperIconViewChildren.toArray();
    this.myStepper.selectedIndex = 0;
    this.activatedRoute?.queryParams?.subscribe(async params => {
      const step = Number(params.step);
      if(this.cameFrom == null){
        this.cameFrom = this.getStepLabelById(step);
      }
      const user_id = Number(params.user_id);
      console.log('params', params);
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
      console.log('user_id', user_id);
      if(user_id){
        let _queryParams = {id:user_id};
      console.log('params step ====', params.step);
        switch(params.step){
          case '0':
            _queryParams['with_entrance'] =true
            break;
          case '1':
              _queryParams['with_pe'] =true
              break;
          case '2':
              _queryParams['with_entretiens'] =true
              break;
          case '3':
              _queryParams['with_vm'] =true
              break;
          case '4':
              _queryParams['with_sortie'] =true
              break;
        }
        await this.getUser(_queryParams);
        if(!this.user){
          this.moveForward(0);
        }
      }else {
        this.moveForward(0);
      }
      this.changeDetectorRef.detectChanges();
    })
  }

  getStepLabelById(step_id: number){
    switch (step_id){
      case 0:
        return 'entree';
      case 1:
        return 'periode_essai';
      case 2:
        return 'entretien';
      case 3:
        return 'visite_medicale';
      case 4:
        return 'sortie';
      default: return '';
    }
  }

  async getUser(params){
    console.log('here get user')
    try{
      const res = await this.userService.getDetailed(params).toPromise();
      this.user = res.result?.data;
      // if(this.user?.type_account === 'independent'){
      //   this.router.navigate(['users/new/'+this.user.type_account], {queryParams: {step: 0, user_id: this.user.id}});
      // }
    }catch (e) {
      console.log('getUser error', e);
    }finally {

    }
  }

  submitRole($event: any) {
    this.profile_id = $event;
    if( this.profile_id) this.moveForward(1);
  }

  selectionChange($event) {
    console.log('on selection change',$event)
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


  // async submitEntree($event: any) {
  //   try{
  //     this.submittingEntree = true;
  //     console.log('submitEntree', $event);
  //       this.moveForward(1, null);
  //   }catch (e){
  //     this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être mises à jour`, 'error');
  //     console.log('error submit entree', e);
  //   }finally {
  //     this.submittingEntree = false;
  //   }
  // }

  // async submitPE($event: any) {
  //   try{
  //     this.submittingEntree = true;
  //       this.moveForward(2, null);
  //   }catch (e){
  //     this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être mises à jour`, 'error');
  //     console.log('error submit PE', e);
  //   }finally {
  //     this.submittingEntree = false;
  //   }
  // }

  // async submitEntretien($event: any) {
  //   try{
  //     this.submittingEntree = true;
  //       const res = await this.userService.addInterview($event).toPromise();
  //   }catch (e){
  //     this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être mises à jour`, 'error');
  //     console.log('error submit Entretien', e);
  //   }finally {
  //     this.submittingEntree = false;
  //   }
  // }

  // async submitVM($event: any) {
  //   try{
  //     this.submittingEntree = true;
  //     const res = await this.userService.addVM($event).toPromise();
  //     // this.moveForward(4, null);
  //   }catch (e){
  //     this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être mises à jour`, 'error');
  //     console.log('error submit vm', e);
  //   }finally {
  //     this.submittingEntree = false;
  //   }
  // }

  // async submitSortie($event: any) {
  //   try{
  //     this.submittingEntree = true;
  //       this.moveForward(5, null);
  //   }catch (e){
  //     this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être mises à jour`, 'error');
  //     console.log('error submit sortie', e);
  //   }finally {
  //     this.submittingEntree = false;
  //   }
  // }

  goback() {
    console.log('cameFrom', this.cameFrom);
    // return;
    // this.location.back();
    // this.router.navigate(['/users/suivi'],
    //   { queryParams: this.activatedRoute.snapshot.queryParams }
    // );
    this.router.navigate(['/users/suivi/'+this.cameFrom],  { queryParams: this.activatedRoute.snapshot.queryParams });
  }

}

