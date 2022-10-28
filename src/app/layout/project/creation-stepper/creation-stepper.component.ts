import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { FormBuilder} from '@angular/forms';
import {ErrorService, UserService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatStepper} from "@angular/material/stepper";
import {User} from "@app/core/entities";
import {MainStore} from "@store/mainStore.store";


@Component({
  selector: 'app-creation-stepper',
  templateUrl: './creation-stepper.component.html',
  styleUrls: ['./creation-stepper.component.scss']
})
export class CreationStepperComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') private myStepper: MatStepper;
  isEditable = true;
  profile_id: number;
  user: User;

  @ViewChildren('stepperIcon') private matStepperIconViewChildren;
  matStepperIcons: any[];
  submittingProject: boolean;
  submittingClient: boolean;
  submittingLieu: boolean;
  submittingPointage: boolean;
  submittingFrais: boolean;
  submittingStats: boolean;
  submittingSecurite: boolean;
  submittingAttachments: boolean;
  projectToSubmit: any;
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
      const project_id = Number(params.project_id);
      if(this.myStepper){
        if([0, 1, 2, 3, 4, 5, 6, 7].includes(step)){
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
      if(project_id){
        await this.getProject(project_id);
        if(!this.user){
          this.moveForward(0);
        }
      }else {
        // this.moveForward(0); // TODO uncomment this
      }
      this.changeDetectorRef.detectChanges();
    })
  }

  async getProject(id){
    try{
      const res = await this.userService.getOne({id}).toPromise();
      this.user = res.result?.data;
      if(this.user?.type_account === 'independent'){
        this.router.navigate(['users/new/'+this.user.type_account], {queryParams: {step: 0, project_id: this.user.id}});
      }
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

  async submitProject($event: any) {
    try{
      this.submittingProject = true;
      this.projectToSubmit = {
        ...this.projectToSubmit,
        ...$event
      }
    }catch (e){
      console.log('error submit step 1', e);
    }finally {
      this.submittingProject = false;
    }
  }

  async submitClient($event: any) {
    try{
      this.submittingClient = true;
      const res = await this.userService.submitParameters($event).toPromise();
      if(res?.result?.data){
        this.moveForward(2);
      }
    }catch (e){
      this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être mises à jour`, 'error');

    }finally {
      this.submittingClient= false;
    }
  }

  async submitLieuIntervention($event: any) {
    try{
      this.submittingLieu = true;
      const params = {
        personal_id: this.user.id,
        personal_perimeter_ids: $event
      }
      const res = await this.userService.submitPerimeters(params).toPromise();
      this.moveForward(4);
    }catch (e){
      this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être mises à jour`, 'error');

    }finally {
      this.submittingLieu = false;
    }
  }

  async submitPointage($event: any) {
    try{
      this.submittingPointage = true;
      const params = {
        project_id: this.user?.id,
        permission_ids: $event.permissions.filter(item => item != null)
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
      this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être mises à jour`, 'error');

    }finally {
      this.submittingPointage = false;
    }
  }

  async submitFrais($event: any) {
    try{
      this.submittingFrais = true;
      const params = {
        project_id: this.user?.id,
        permission_ids: $event.permissions.filter(item => item != null)
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
      this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être mises à jour`, 'error');

    }finally {
      this.submittingFrais = false;
    }
  }

  async submitStats($event: any) {
    try{
      this.submittingStats = true;
      const params = {
        project_id: this.user?.id,
        permission_ids: $event.permissions.filter(item => item != null)
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
      this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être mises à jour`, 'error');

    }finally {
      this.submittingStats = false;
    }
  }

  async submitSecurite($event: any) {
    try{
      this.submittingSecurite = true;
      const params = {
        project_id: this.user?.id,
        permission_ids: $event.permissions.filter(item => item != null)
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
      this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être mises à jour`, 'error');

    }finally {
      this.submittingSecurite= false;
    }
  }

  async submitAttachments($event: any) {
    try{
      this.submittingAttachments = true;
      const params = {
        project_id: this.user?.id,
        permission_ids: $event.permissions.filter(item => item != null)
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
      this.mainStore.showMessage(`Echec de l'opération!`, `Les informations n'ont pas pu être mises à jour`, 'error');

    }finally {
      this.submittingAttachments = false;
    }
  }

}

