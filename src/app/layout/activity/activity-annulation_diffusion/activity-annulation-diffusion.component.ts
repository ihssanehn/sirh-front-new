import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedClasses} from "@shared/Utils/SharedClasses";
import {ListsService} from "@services/lists.service";

@Component({
  selector: 'app-activity-annulation-diffusion',
  templateUrl: './activity-annulation-diffusion.component.html',
  styleUrls: ['./activity-annulation-diffusion.component.scss']
})
export class ActivityAnnulationDiffusionComponent implements OnInit {

  personnals = [];
  submitting: boolean;
  myForm: FormGroup;
  formInputs = {
    type_cancelation: 'type_cancelation',
    personnal_id: 'personnal_id',
    email: 'email',
    notify_mail: 'notify_mail'
  }
  constructor(private fb: FormBuilder, private listService: ListsService) {
    this.myForm = this.fb.group({
      type_cancelation: ['all_statements', Validators.compose([Validators.required])],
      personnal_id: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([])],
      notify_mail: [null, Validators.compose([Validators.required])],
    });
  }

  async ngOnInit() {
    try{ this.personnals = await this.listService.getAll(this.listService.list.USERS).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}

  }


  createDemand() {

  }

  diffuse() {

  }

  onCheckChange($event) {
    console.log('event', $event);
    this.myForm.patchValue({
      notify_email: $event?.target?.checked
    })
    console.log('test', this.myForm.value['notify_email']);
  }

  ischecked(input) {
    return this.myForm.value[input];
  }

  cancelDiffusion() {
    console.log('this.myForm.value', this.myForm.value);
  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.myForm.controls[control]) ? '(*)': '';
  }

}
