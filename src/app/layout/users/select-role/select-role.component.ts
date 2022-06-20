import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddUserComponent} from "@layout/users/add-user/add-user.component";
import {UserInfoFormComponent} from "@layout/users/user-info-form/user-info-form.component";

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.scss']
})
export class SelectRoleComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
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
      // if(result === 'QUERY'){
      //   this.getAllStudents();
      // }
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
}
