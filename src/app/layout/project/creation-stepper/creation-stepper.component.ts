import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { FormBuilder} from '@angular/forms';
import {ErrorService} from '@app/core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatStepper} from "@angular/material/stepper";
import {User} from "@app/core/entities";
import {MainStore} from "@store/mainStore.store";
import {ProjectService} from "@services/project.service";
import {isMoment} from "moment";
import * as moment from "moment";
import {MY_CUSTOM_DATETIME_FORMATS} from "@shared/classes/CustomDateTimeFormat";


@Component({
  selector: 'app-creation-stepper',
  templateUrl: './creation-stepper.component.html',
  styleUrls: ['./creation-stepper.component.scss']
})
export class CreationStepperComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') private myStepper: MatStepper;
  isEditable = true;
  profile_id: number;
  user: User;

  @ViewChildren('stepperIcon') private matStepperIconViewChildren;
  matStepperIcons: any[];
  submittingProject: boolean;
  submittingClient: boolean;
  submittingLieu: boolean;
  submittingPointage: boolean;
  submittingFrais: boolean;
  submittingStats: boolean;
  submittingSecurite: boolean;
  submittingAttachments: boolean;
  projectToSubmit: any;
  constructor(
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private mainStore: MainStore,
    private projectService : ProjectService
  ) {
    this.activatedRoute?.queryParams?.subscribe(async params => {
      const project_id = Number(params.id);
      this.getProject(project_id);
    });
  }

  ngOnInit(): void {
    // this.projectToSubmit = {
    //   personal_id:20,
    //   cp_id:12,
    //   devise_id:1,
    //   end_date: "2022-12-16",
    //   end_estimated_date: "2022-10-11",
    //   has_mail_to_manager:true,
    //   id:null,
    //   initial_number_of_days:34,
    //   is_active:true,
    //   left_number_of_days:19,
    //   mission_title:  "SIRH",
    //   short_mission_title:  "sirhshort",
    //   start_date: "2022-10-05",
    //   tariff:232398,
    //
    //   client_email: "a.chbani@piman.fr",
    //   client_id: 2,
    //   in_out_office:  true,
    //   proposal_reference: "Réfff",
    //   purchasing_contact: "Contact Achat +212",
    //   technical_contact:  "ContactTTECH",
    //
    //   address:"test adresse",
    //   calendar_id:4,
    //   city_id:71307,
    //   country_id:149,
    //   mission_description:"descript mission",
    //   postal_code:"212000",
    //
    //   information_for_consultant:"zfeczs",
    //   pointing_tariff:23,
    //   pointing_type_id:106,
    //   pointing_unity_id:8,
    //
    //   cost_remarks: 'test',
    //   distance_home_customer_site: 4,
    //   has_cost_ok: 1,
    //   has_exclusion_tr: 1,
    //   mission_costs:  [
    //     {
    //       is_billable: false,
    //       amount_max: false,
    //       amount: 4,
    //       frequency_id: 84,
    //       cost_type_id: 105
    //     },
    //     {
    //       is_billable: false,
    //       amount_max: true,
    //       amount: 3,
    //       frequency_id: 85,
    //       cost_type_id: 111
    //     }
    //   ],
    //
    //   has_formation:true,
    //   is_getting_started: true,
    //   is_mission_inter_contract: true,
    //   is_mission_not_billable: true,
    //   is_mission_not_valued: true,
    //   is_remote_mission: true,
    //   mission_specific_code: "BSDVSDEGTG",
    //
    //   mission_securities:  [{id:3},
    //     {id:6},
    //     {id:10},
    //     {id:13},
    //     {id:16},
    //     {id:19},
    //     {id:22},
    //     {id:25},
    //     {id:28},
    //     {id:31},
    //     {id:34},
    //     {id:131},
    //     {id:50},
    //     {id:51},
    //     {id:52},
    //     {id:66},
    //     {id:67},
    //     {id:68},
    //     {id:88},
    //     {id:90},
    //     {id:92},
    //     {id:94},
    //     {id:96},
    //     {id:110},
    //     {id:112},
    //     {id:114},
    //     {id:116},
    //     {id:125},
    //     {id:126},
    //     {id:128},
    //     {id:129},
    //   ],
    //   risk_level: 'piman_client_ae_td_inferior_400',
    //
    //   is_pj_visible: true
    // };
  }

  async ngAfterViewInit() {
    this.matStepperIcons = this.matStepperIconViewChildren.toArray();
    this.myStepper.selectedIndex = 0;
    this.activatedRoute?.queryParams?.subscribe(async params => {
      const step = Number(params.step);
      const project_id = Number(params.project_id);
      if(this.myStepper){
        if([0, 1, 2, 3, 4, 5, 6, 7].includes(step)){
          console.log('moved', step);
          // this.myStepper.selectedIndex = step;
          if(this.myStepper.selectedIndex < step){
            while (this.myStepper.selectedIndex < step){
              this.myStepper.selectedIndex = this.myStepper.selectedIndex + 1;
            }
          }else if(this.myStepper.selectedIndex > step){
            while (this.myStepper.selectedIndex > step){
              this.myStepper.selectedIndex = this.myStepper.selectedIndex - 1;
            }
          }
        }else{
          this.moveForward(0);
        }
      }
      if(project_id){
        await this.getProject(project_id);
        if(!this.projectToSubmit){
          this.moveForward(0);
        }
      }else {
        // this.moveForward(0); // TODO uncomment this
      }
      this.changeDetectorRef.detectChanges();
    })
  }

  async getProject(id){
    try{
      const res = await this.projectService.getProjectById({id}).toPromise();
      this.projectToSubmit = res.data;
      if(this.projectToSubmit){
        this.projectToSubmit.mission_securities = this.projectToSubmit.mission_securities.map((item) => {
          return {id: item.security_id, comment: item.comment};
        });
        this.projectToSubmit.mission_costs = this.projectToSubmit.mission_costs.map((item) => {
          return {
            is_billable: item.is_billable,
            amount_max: item.amount_max,
            amount: item.amount,
            frequency_id: item.frequency_id,
            cost_type_id: item.cost_type_id
          };
        });
      }
    }catch (e) {
      console.log('getProject error', e);
    }finally {

    }
  }

  submitRole($event: any) {
    this.profile_id = $event;
    if( this.profile_id) this.moveForward(1);
  }

  selectionChange($event) {
    const snapshot = this.activatedRoute.snapshot;
    let params = { ...snapshot.queryParams, step: $event.selectedIndex};
    this.router.navigate(['.'],
      { relativeTo: this.activatedRoute, queryParams: params, queryParamsHandling: 'merge'});
  }

  moveForward(step, other_params?) {
    if(this.myStepper){

      const snapshot = this.activatedRoute.snapshot;
      let params = { ...snapshot.queryParams, step: step};

      if(other_params){
        params = {...params, ...other_params}
      }
      this.router.navigate(['.'],
        { relativeTo: this.activatedRoute, queryParams: params, queryParamsHandling: 'merge'});
    }
  }

  async saveStep($event: any) {

    try{
      console.log('saveStep', $event);
      this.submittingProject = true;
      this.projectToSubmit = {
        ...this.projectToSubmit,
        ...$event
      }
    }catch (e){
      console.log('error submit step 1', e);
    }finally {
      this.submittingProject = false;
    }
  }

  async submit() {
    const fd = new FormData();
    console.log('this.projectToSubmit', this.projectToSubmit);
    const date_inputs = [
      'start_date',
      'end_estimated_date',
      'end_date'
    ];
    date_inputs.forEach(input => {
      this.projectToSubmit[input] = this.projectToSubmit[input] && isMoment(moment(this.projectToSubmit[input], MY_CUSTOM_DATETIME_FORMATS.supportedFormats)) ? moment(this.projectToSubmit[input], MY_CUSTOM_DATETIME_FORMATS.supportedFormats)?.format('YYYY-MM-DD'): null;
    });
    Object.keys(this.projectToSubmit).forEach(key => {
      if(Array.isArray(this.projectToSubmit[key])){
        if(key === 'mission_files'){
          this.projectToSubmit[key].forEach((file, index) => {
            fd.append(`mission_files`, file);
          })
        }else{
          fd.append(key, JSON.stringify(this.projectToSubmit[key]));
        }
      }else {
        if(this.projectToSubmit[key] != null){
          fd.append(key, this.projectToSubmit[key]);
        }
      }
    });

    try{
      this.submittingProject = true;
      const res = await this.projectService.addOrUpdateMission(fd).toPromise();
      console.log('res', res);

      this.messageService.add({
        severity: 'success',
        summary: 'Parfait!',
        detail: 'Mise à jour réussie',
        sticky: false,
      });

    } catch (e) {
      console.log('error submit', e);
      this.mainStore.showMessage(`Echec de l'opération!`, `Echec de l'opération`, 'error');

    } finally {
      this.submittingProject = false;
    }
  }

  refreshGlobalData(event) {
    this.saveStep(event);
  }
}

