import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {SharedClasses} from "@shared/Utils/SharedClasses";
import {ListsService} from "@services/lists.service";
import {ActivitiesService} from "@services/activities.service";
import * as _moment from "moment";
import {MainStore} from "@store/mainStore.store";
import {FormBuilder, FormGroup} from "@angular/forms";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-cloture-mois-courant',
  templateUrl: './cloture-mois-courant.component.html',
  styleUrls: ['./cloture-mois-courant.component.scss']
})
export class ClotureMoisCourantComponent implements OnInit {



  submittingClose: boolean;
  submittingSave: boolean;
  myForm: FormGroup;
  formInputs = {
    releve_activite: 'releve_activite',
    fiche_frais: 'fiche_frais',
  };

  constructor(private listService: ListsService,
              private activitiesService: ActivitiesService,
              private mainStore: MainStore,
              private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      releve_activite: [],
      fiche_frais: [],
    })
  }

  ngOnInit(): void {
  }

  async submit(){

  }


  isRequired(control) {
    return SharedClasses.isControlRequired(this.myForm.controls[control]) ? '(*)': '';
  }

  clearDateInput(input: string) {
    this.myForm.patchValue({[input]: null});
  }
}
