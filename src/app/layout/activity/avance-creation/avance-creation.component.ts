import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivitiesService} from "@services/activities.service";
import {markFormAsDirty, SharedClasses} from "@shared/Utils/SharedClasses";
import {MessageService} from "primeng/api";
import * as moment from "moment";
import {isMoment} from "moment";
import {UserStore} from "@store/user.store";
import {$userRoles} from "@shared/Objects/sharedObjects";

@Component({
  selector: 'app-avance-creation',
  templateUrl: './avance-creation.component.html',
  styleUrls: ['./avance-creation.component.scss']
})
export class AvanceCreationComponent implements OnInit {
  personals = [];
  advance_cost = [];
  submittingCreate: any;
  submittingDiffuse: any;
  myForm: FormGroup;
  formInputs = {
    personal_id: 'personal_id',
    status_id: 'status_id',
    type_id: 'type_id',
    amount: 'amount',
    date:  'date',
    motif:  'motif'
  }
  roles_can_show_personals_input = [$userRoles.ADV, $userRoles.ACCOUNTING, $userRoles.GP];
  loadingPersonals: boolean;

  constructor(private router: Router,
              private fb: FormBuilder,
              private activitiesService: ActivitiesService,
              private messageService: MessageService,
              public userStore: UserStore,
              private listService: ListsService, private mainStore: MainStore) {
    this.myForm = this.fb.group({
      personal_id: [],
      status_id: [null],
      type_id: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],
      date:  [null, Validators.compose([Validators.required])],
      motif: [null, Validators.compose([Validators.required])]
    })
  }

  async ngOnInit() {
    const id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    try{ this.personals = await this.listService.getPersonalsByCpId({entity_id: id_entite}).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.advance_cost = await this.listService.getFilter(this.listService.list.ADVANCE_COST).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
  }

  goback() {
    this.router.navigate(['/activity/avance/list']);
  }

  async createDemand() {
    markFormAsDirty(this.myForm);
    if(!this.myForm.valid){
      return;
    }
    try{
      this.submittingCreate = true;
      const params = this.myForm.value;
      params.date = params.date && isMoment(moment(params.date)) ? moment(params.date)?.format('YYYY-MM-DD'): null;

      const res = await this.activitiesService.addOrUpdateAdvanceCost(params).toPromise();
      this.myForm.reset();
      this.goback();
      this.messageService.add({
        severity: 'success',
        summary: 'Parfait!',
        detail: 'Demande créé avec succès',
        sticky: false,
      });
    }catch (e){
      console.log('err createDemand', e);
        this.messageService.add({
          severity: 'error',
          summary: 'Echec!',
          detail: 'Impossible de créer cette demande d\'avance de frais pour le moment',
          sticky: false});
    }finally {
      this.submittingCreate = false;
    }
  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.myForm.controls[control]) ? '(*)': '';
  }

  showPersonels() {
    return this.roles_can_show_personals_input.includes(this.userStore.getAuthenticatedUser?.role_name);
  }

  async getPsersonals() {
    const id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
    try{
      this.loadingPersonals = true;
      this.personals = await this.listService.getPersonalsByCpId({entity_id: id_entite}).toPromise();
    }
    catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    finally {
      this.loadingPersonals = false;
    }
  }
}
