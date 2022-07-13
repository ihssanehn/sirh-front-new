import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddUserComponent} from "@layout/users/add-user/add-user.component";
import {UserInfoFormComponent} from "@layout/users/user-info-form/user-info-form.component";
import {ListsService} from "@services/lists.service";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {markFormAsDirty} from "@shared/Utils/SharedClasses";

@Component({
  selector: 'app-modal-periode-essai',
  templateUrl: './modal-periode-essai.component.html',
  styleUrls: ['./modal-periode-essai.component.scss']
})
export class ModalPeriodeEssaiComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  selectedProfile_id = null;
  @Input() users = [];
  status = [
    {
      id: 1,
      label: 'Cadre/Consultant: 4 mois'
    },
    {
      id: 2,
      label: 'Employé/Ouvrier: 2 mois'
    },
    {
      id: 3,
      label: 'ETAM: 1 mois'
    },
    {
      id: 4,
      label: 'Ag. maitrise/Techniciens: 3 mois'
    },
    {
      id: 5,
      label: 'CDD: à définir (entre 1 jour et 1 mois)'
    },
    {
      id: 6,
      label: 'Pas de période d\'essai'
    },
  ];
  myForm: FormGroup;
  selectedStatus  = [];
  constructor(
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private listService: ListsService,
  ) {
    this.myForm = this.fb.group({
      status: new FormArray([]),
      end_date: [null]
    });
  }

  ngOnInit() {
  }

  save() {
    markFormAsDirty(this.myForm);
    if(!this.myForm.valid ){
      return;
    }
    // this.submitAccess.emit(this.myForm.value);
  }

  ischecked(id) {
    return this.myForm?.value?.statuts?.includes(id);
  }

  onCheckChange(event, access) {
    const formArray: FormArray = this.myForm.get('permissions') as FormArray;

    console.log('event', event.target.checked, event);
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(access.id));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == access.id) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  clearDateInput() {
    this.myForm.patchValue({
      end_date: null
    });
  }
}
