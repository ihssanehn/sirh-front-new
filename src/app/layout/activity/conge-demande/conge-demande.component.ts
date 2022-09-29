import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedClasses} from "@shared/Utils/SharedClasses";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";

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
    absence_request: 'absence_request'

  }
  loadingSelect = {};
  id_entite = null;
  absence_request = [];
  constructor(private fb: FormBuilder,
              public listService: ListsService,
              private mainStore: MainStore,
              ) {
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
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
  }

  async getFilterList(items, list_name, list_param?){
    if(items === 'personals'){
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.listService.getPersonalsByCpId({entity_id: this.id_entite}).toPromise();
      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }else{
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.listService.getAll(list_name, list_param).toPromise();

      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }
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
