import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {markFormAsDirty, SharedClasses} from "@shared/Utils/SharedClasses";
import {ListsService} from "@services/lists.service";
import * as moment from "moment";
import {MainStore} from "@store/mainStore.store";
import {isMoment} from "moment/moment";
import {ActivitiesService} from "@services/activities.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-activity-annulation-diffusion',
  templateUrl: './activity-annulation-diffusion.component.html',
  styleUrls: ['./activity-annulation-diffusion.component.scss']
})
export class ActivityAnnulationDiffusionComponent implements OnInit {

  personals = [];
  submitting: boolean;
  myForm: FormGroup;
  formInputs = {
    type_annulation: 'type_annulation',
    personal_id: 'personal_id',
    mail_content: 'mail_content',
    send_mail: 'send_mail',
    date: 'date'
  }
  month = moment().subtract(1, 'M').set({date: 1});
  loadingPersonals = false;
  constructor(private fb: FormBuilder,
              private mainStore: MainStore,
              private listService: ListsService,
              private messageService: MessageService,
              private activitiesService: ActivitiesService,
  ) {
    this.myForm = this.fb.group({
      date: [this.month, Validators.compose([Validators.required])],
      type_annulation: ['all_activity', Validators.compose([Validators.required])],
      personal_id: [null, Validators.compose([Validators.required])],
      mail_content: [null, Validators.compose([])],
      send_mail: [null]
    });
  }

  async ngOnInit() {
  }


  createDemand() {

  }

  diffuse() {

  }

  onCheckChange($event) {
    console.log('event', $event);
    this.myForm.patchValue({
      send_mail: $event?.target?.checked
    })
    console.log('test', this.myForm.value['send_mail']);
  }

  ischecked(input) {
    return this.myForm.value[input];
  }

  async cancelDiffusion() {
    console.log('this.myForm.value', this.myForm.value);
    markFormAsDirty(this.myForm);
    if(!this.myForm.valid){
      return;
    }
    try{
      this.submitting = true;
      const params = this.myForm.value;
      params.date = params.date && isMoment(moment(params.date)) ? moment(params.date)?.format('YYYY-MM-DD'): null;

      const res = await this.activitiesService.cancelDiffusion(params).toPromise();
      this.myForm.reset();

      this.messageService.add({
        severity: 'success',
        summary: 'Parfait!',
        detail: 'La diffusion du mois '+ this.month?.locale('fr').format('MMMM YYYY')+' a bien été annulé pour ce collaborateur',
        sticky: false,
      });
    }catch (e){
      console.log('err createDemand', e);
      if(e.status === 403){
        this.messageService.add({
          severity: 'info', summary: 'Echec!',
          detail: 'Le mois '+this.month?.locale('fr').format('MMMM YYYY')+' n\'est pas diffusé pour ce collaborateur pour le moment\n',
          sticky: false});
      }else{
        this.messageService.add({severity: 'error', summary: 'Echec!', detail: 'Une erreur est survenue lors de l\'annulation de la diffusion',  sticky: false});
      }
    }finally {
      this.submitting = false;
    }
  }

  isRequired(control) {
    return SharedClasses.isControlRequired(this.myForm.controls[control]) ? '(*)': '';
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
