import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedClasses} from "@shared/Utils/SharedClasses";
import {ListsService} from "@services/lists.service";
import {IDatePickerConfig} from "ng2-date-picker/lib/date-picker/date-picker-config.model";

@Component({
  selector: 'frais-ticket-restaurant',
  templateUrl: './frais-ticket-restaurant.component.html',
  styleUrls: ['./frais-ticket-restaurant.component.scss']
})
export class FraisTicketRestaurantComponent implements OnInit {

  personnals = [];
  submitting: boolean;
  myForm: FormGroup;
  formInputs = {
    starts_at: 'starts_at',
    ends_at: 'ends_at',
    personal_id: 'personal_id',
    releve_activite: 'releve_activite',
    fiche_frais: 'fiche_frais'
  }
  config: IDatePickerConfig = {
    format: 'MM/YYYY',
  }
  personals_tickets = [
    {
      matricule: '000809',
      last_name: 'AHARONIAN',
      first_name: 'Sendess',
      cp: 'DID',
      company: 'PIMAN CONSULTANTS',
      tr_aquis: 'Frais non validés',
      tr_ajustement: '',
      tr_valide: '',
      tr_donne: '',
    },
    {
      matricule: '000809',
      last_name: 'AHARONIAN',
      first_name: 'Sendess',
      cp: 'DID',
      company: 'PIMAN CONSULTANTS',
      tr_aquis: 'Frais non validés',
      tr_ajustement: '',
      tr_valide: '',
      tr_donne: '',
    },
    {
      matricule: '000809',
      last_name: 'AHARONIAN',
      first_name: 'Sendess',
      cp: 'DID',
      company: 'PIMAN CONSULTANTS',
      tr_aquis: 'Frais non validés',
      tr_ajustement: '',
      tr_valide: '',
      tr_donne: '',
    },
    {
      matricule: '000809',
      last_name: 'AHARONIAN',
      first_name: 'Sendess',
      cp: 'DID',
      company: 'PIMAN CONSULTANTS',
      tr_aquis: 'Frais non validés',
      tr_ajustement: '',
      tr_valide: '',
      tr_donne: '',
    },
    {
      matricule: '000809',
      last_name: 'AHARONIAN',
      first_name: 'Sendess',
      cp: 'DID',
      company: 'PIMAN CONSULTANTS',
      tr_aquis: 'Frais non validés',
      tr_ajustement: '',
      tr_valide: '',
      tr_donne: '',
    },
    {
      matricule: '000809',
      last_name: 'AHARONIAN',
      first_name: 'Sendess',
      cp: 'DID',
      company: 'PIMAN CONSULTANTS',
      tr_aquis: 'Frais non validés',
      tr_ajustement: '',
      tr_valide: '',
      tr_donne: '',
    },
    {
      matricule: '000809',
      last_name: 'AHARONIAN',
      first_name: 'Sendess',
      cp: 'DID',
      company: 'PIMAN CONSULTANTS',
      tr_aquis: 'Frais non validés',
      tr_ajustement: '',
      tr_valide: '',
      tr_donne: '',
    },
    {
      matricule: '000809',
      last_name: 'AHARONIAN',
      first_name: 'Sendess',
      cp: 'DID',
      company: 'PIMAN CONSULTANTS',
      tr_aquis: 'Frais non validés',
      tr_ajustement: '',
      tr_valide: '',
      tr_donne: '',
    },
  ];

  constructor(private fb: FormBuilder, private listService: ListsService) {
    this.myForm = this.fb.group({
      starts_at: [null, Validators.compose([])],
      ends_at: [null, Validators.compose([])],
      personal_id: [null, Validators.compose([])],
      releve_activite: [null, Validators.compose([])],
      fiche_frais: [null, Validators.compose([])],
    });
  }

  async ngOnInit() {
    try{ this.personnals = await this.listService.getAll(this.listService.list.USERS).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}

  }


  chosenMonthHandler(input) {

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

  search() {

  }
}
