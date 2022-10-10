import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ListsService} from "@services/lists.service";
import {markFormAsDirty} from "@shared/Utils/SharedClasses";
import {UserService} from "@app/core/services";
import {User} from "@app/core/entities";
import {MainStore} from "@store/mainStore.store";

@Component({
  selector: 'app-delegation-creation',
  templateUrl: './delegation-creation.component.html',
  styleUrls: ['./delegation-creation.component.scss']
})
export class DelegationCreationComponent implements OnInit {
  myForm: FormGroup;
  formInputs = {
    type:'type'
  };
  submitting = false;
  filter = {
    starts_at_delegation: false,
    ends_at_delegation: false,
    validator_titulaire: null,
    validator_delegue: null,
    absences: null,
    avances: null,
    practice_mananger: null,
    validation_devis_rentabilite_previsionnel: null,
    ordre_mission: null,
    demande_teletravail: null,
    demande_deplacement: null,
    demande_lignes_releve: null,
    validation_lignes_releve: null,
    entretien: null,
    note_frais: null,
    saisi_ra_frais: null,
    gestion_email: null,
    delegation_permanante: null,
  }
  personals = [];
  submittingCreate: boolean;
  id_entite;
  loadingSelect = {};
  constructor(private fb: FormBuilder,
              private usersService: UserService,
              private mainStore: MainStore,
              public listService: ListsService,
              private changeDetectorRef: ChangeDetectorRef
              ) {
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

  }

  ngOnInit(): void {
  }

  submit() {

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


  getPage(data) {
    if(!data) return;

      // while(data.length>0 && data?.length < 5){
      //   data.push();
      // }
    return data;
  }

  filterChanged() {

  }



  onCheckChange($event, input) {
    this.filter[input] = $event?.target?.checked;
  }

  goback() {

  }

  save() {
    console.log('submit', this.filter);
  }
}

