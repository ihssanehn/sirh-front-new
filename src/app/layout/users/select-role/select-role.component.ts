import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddUserComponent} from "@layout/users/add-user-stepper/add-user.component";
import {UserInfoFormComponent} from "@layout/users/user-info-form/user-info-form.component";
import {ListsService} from "@services/lists.service";
import {User} from "@app/core/entities";

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.scss']
})
export class SelectRoleComponent implements OnInit, AfterViewInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Output() submitRole: EventEmitter<any> = new EventEmitter();

  @Input()
  public set user(val: User) {
    this.selectedProfile_id = val?.profile_id;
    console.log('Input()', val);
  }

  selectedProfile_id = null;
  error = '';
  warning = '';
  profiles = [
  ];
  loadingData;
  constructor(
    private modalService: NgbModal,
    private listService: ListsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.getProfiles();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // if(this.user){
    //   console.log('ngAfterViewInit select role', this.user);
    //   this.selectedProfile_id = this.user.profile_id;
    //   this.changeDetectorRef.detectChanges();
    // }
  }

  async getProfiles(){
    try{
      this.loadingData = true;
      const res = await this.listService.getFilter('PROFILE').toPromise();
      this.profiles = res || [];
    }catch (e) {

    }finally {
      this.loadingData = false;
    }
  }

  openModal(profil: string) {
    if(this.modalService.hasOpenModals()){
      this.modalService.dismissAll();
    }
    let modal = null;
    let size = null;
    let title = null;
    let type = null;
    switch (profil){
      case 'user': {
        modal = AddUserComponent;
        size = 'lg'
        title = 'utilisateur';
        type = 'user';
        break;
      }
      case 'collab': {
        modal = UserInfoFormComponent;
        size = 'xl';
        title = 'collaborateur';
        type = 'collab';
        break;
      }
      case 'collab-user': {
        modal = UserInfoFormComponent;
        size = 'xl';
        title = 'utilisateur et collaborateur';
        type = 'collab-user';
        break;
      }
    }

    const modalRef = this.modalService.open(modal, { size: size , centered: true, windowClass: 'myModal'});
    modalRef.result.then(result=>{
      console.log('closed', result);
    }, reason => {
      console.log('closed');
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.type = type;
  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }

  selectProfil(profile_id){
    this.selectedProfile_id = profile_id;
  }

  saveProfile(){
    this.error = '';
    if(!this.selectedProfile_id){
      this.error = 'Veillez séléctionner un profil';
      return;
    }
    this.submitRole.emit(this.selectedProfile_id);
  }
}
