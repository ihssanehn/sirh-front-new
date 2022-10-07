import { Component, OnInit } from '@angular/core';
import frLocale from "date-fns/locale/fr";
import {Subscription} from "rxjs";
import {ListsService} from "@services/lists.service";
import {ActivitiesService} from "@services/activities.service";
import * as _moment from "moment";
import {Router} from "@angular/router";

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-delegation-list',
  templateUrl: './delegation-list.component.html',
  styleUrls: ['./delegation-list.component.scss']
})
export class DelegationListComponent implements OnInit {
  showFilters = false;
  dateValue;
  config = {
    format: 'MM/YYYY',
    locale: frLocale,
  }

  personals = [];
  member_ships = [];
  center_profits = [];
  sort_choices = [];
  business_units = [];
  type_frais = [];
  business_lines = [];
  adv_managers = [];
  direction_ops = [];
  clients = [];
  departments = [];
  validation_stats = [];
  societe_origins = [];
  // pagination: any = {
  //   page: 1,
  //   total: 10,
  //   limit: 10
  // };

  exportPrint = {
    activity_record: null,
    expense_sheet: null,
  }
// is_virtual: null,
  // page: 1,
  // limit: 10,
  filter = {
    keyword: '',
    personals: [],
    plage_starts_at: null,
    plage_ends_at: null
  }

  personnalFilters;
  loadingData = false;
  searchSubscription: Subscription;

  submittingPrint = false;
  submittingExport = false;
  submittingDetailedExport = false;

  delegations = [
    {
      id: 1,
      titulaire_full_name: "LACH Jean Pierre",
      validatur_full_name: "KOLEVA Kremena",
      starts_at: 'Délégation permanente',
      ends_at: 'Délégation permanente',
      types: [
        'Ordre de mission'
      ]
    },
    {
      id: 1,
      titulaire_full_name: "HEUSSE-OLD ThibautHEUSSE-OLD Thibaut",
      validatur_full_name: "LACH Jean Pierre",
      starts_at: 'Délégation permanente',
      ends_at: 'Délégation permanente',
      types: [
        'Absences',
        'Validation devis/rentabilité prévisionnelle',
        'Ordre de mission',
        'Déplacements',
        'Frais',
        'Avances',
        'Lignes relevé'
      ]
    },
    {
      id: 2,
      titulaire_full_name: "DIZARD Coralie",
      validatur_full_name: "POHU Alexandra",
      starts_at: 'Délégation permanente',
      ends_at: 'Délégation permanente',
      types: [
        'Absences',
        'Validation devis/rentabilité prévisionnelle',
        'Ordre de mission',
        'Déplacements',
        'Frais',
        'Avances',
        'Lignes relevé',
        'Saisie RA et Frais',
        'Practice manager',
        'Demande de télétravail',
        'Entretien'
      ]
    },
    {
      id: 3,
      titulaire_full_name: "LACH Jean Pierre",
      validatur_full_name: "KOLEVA Kremena",
      starts_at: 'Délégation permanente',
      ends_at: 'Délégation permanente',
      types: [
        'Ordre de mission'
      ]
    },
    {
      id: 4,
      titulaire_full_name: "HEUSSE-OLD ThibautHEUSSE-OLD Thibaut",
      validatur_full_name: "LACH Jean Pierre",
      starts_at: 'Délégation permanente',
      ends_at: 'Délégation permanente',
      types: [
        'Absences',
        'Validation devis/rentabilité prévisionnelle',
        'Ordre de mission',
        'Déplacements',
        'Frais',
        'Avances',
        'Lignes relevé'
      ]
    },
    {
      id: 5,
      titulaire_full_name: "DIZARD Coralie",
      validatur_full_name: "POHU Alexandra",
      starts_at: 'Délégation permanente',
      ends_at: 'Délégation permanente',
      types: [
        'Absences',
        'Validation devis/rentabilité prévisionnelle',
        'Ordre de mission',
        'Déplacements',
        'Frais',
        'Avances',
        'Lignes relevé',
        'Saisie RA et Frais',
        'Practice manager',
        'Demande de télétravail',
        'Entretien'
      ]
    },

  ]


  constructor(private listService: ListsService,
              private activitiesService: ActivitiesService,
              private router: Router,
  ) { }

  ngOnInit(): void {
    this.getFilters();
  }

  resetFilters() {
    this.filter = {
      keyword:  this.filter.keyword,
      personals: [],
      plage_starts_at: null,
      plage_ends_at: null
    }
  }

  async getFilters(){
    try{
      this.personnalFilters = await this.listService.getPersonalFilters().toPromise();
      console.log('this.filters', this.personnalFilters);
      this.personals = this.personnalFilters.personals;

    } catch (e) {
      console.log('error filter PROFIT_CENTER', e);
    }
  }

  filterChanged() {

  }


  ischecked(id) {

  }

  returnfalse(){
    return false;
  }

  clearDateInput(date: any) {
    date.patchValue(null);
  }

  print(){

  }

  export(){

  }

  detailedExport(){

  }

  goToCreate() {
    this.router.navigate(['/activites/delegation/creation']);
  }
}
