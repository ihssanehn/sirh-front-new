import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conge-history',
  templateUrl: './conge-history.component.html',
  styleUrls: ['./conge-history.component.scss']
})
export class CongeHistoryComponent implements OnInit {
  status = [];
  avance_types = [];
  submittingExport = false;
  filters = {
    range: null,
    status: null,
    avance: null
  }
  formInputs = {
    range: 'range',
    status: 'status',
    avance: 'avance'
  };
  cards = [
    {
      title: 'Absence non rémunérée',
      value: 0
    },
    {
      title: 'Chômage technique',
      value: 0
    },
    {
      title: 'Congé parental',
      value: 0
    },
    {
      title: 'Congé ancienneté',
      value: 0
    },
    {
      title: 'Congé exceptionnels',
      value: 0
    },
    {
      title: 'Congé paternité',
      value: 0
    },
    {
      title: 'Congé payés',
      value: 0
    },
    {
      title: 'Congé sans solde',
      value: 0
    },
    {
      title: 'Exception Décès',
      value: 0
    },
    {
      title: 'Exception Mariage',
      value: 0
    },
    {
      title: 'Exception Naissance',
      value: 0
    },
    {
      title: 'Exception PACS',
      value: 0
    },
    {
      title: 'Maladie',
      value: 0
    },
    {
      title: 'Matenité',
      value: 0
    },
    {
      title: 'Récupération',
      value: 0
    },
    {
      title: 'RTT',
      value: 0
    },
    {
      title: 'Temps partiel',
      value: 0
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

  export() {

  }

  getAll() {

  }

  clearDateInput(date: any) {

  }
}
