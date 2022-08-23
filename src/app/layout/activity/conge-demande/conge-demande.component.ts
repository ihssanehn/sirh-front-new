import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedClasses} from "@shared/Utils/SharedClasses";

@Component({
  selector: 'app-conge-demande',
  templateUrl: './conge-demande.component.html',
  styleUrls: ['./conge-demande.component.scss']
})
export class CongeDemandeComponent implements OnInit {

  types = [];
  submittingDiffuse: boolean;
  myForm: FormGroup;
  formInputs = {
    type_absence: 'type_absence',
    starts_at: 'starts_at',
    starts_at_am_pm: 'starts_at_am_pm',
    ends_at: 'ends_at',
    ends_at_am_pm: 'ends_at_am_pm',
    duration: 'duration',
    justification: 'justification',
  }
  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      type_absence: [null, Validators.compose([Validators.required])],
      starts_at: [null, Validators.compose([Validators.required])],
      starts_at_am_pm: ['am', Validators.compose([Validators.required])],
      ends_at: [null, Validators.compose([Validators.required])],
      ends_at_am_pm: ['pm', Validators.compose([Validators.required])],
      duration: [null],
      justification: [null],
    });
  }

  ngOnInit(): void {
  }

  diffuse() {
    console.log('muform', this.myForm.value);
  }

  clearDateInput(input) {

  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.myForm.controls[control]) ? '(*)': '';
  }
}
