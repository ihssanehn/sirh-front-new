import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frais-saisie',
  templateUrl: './frais-saisie.component.html',
  styleUrls: ['./frais-saisie.component.scss']
})
export class FraisSaisieComponent implements OnInit {

  note_frais_list = [];
  expense_reports = [
    {
      title: 'lun. 01',
      description: 'C CADRE CEA DIMP-KKO',
      note: 46.50,
      opened: true,
      items: [
      {
        id: 1,
        demand: null,
        exceptional: true,
        billable: true,
        comment: null,
        type_of_fee: null,
        ttc_amout: null,
        vat: null,
      }
    ]
    },
    {
      title: 'Mar. 02',
      description: 'C CADRE CEA DIMP-KKO',
      note: 46.50,
      opened: false,
      items: [
        {
          id: 1,
          demand: null,
          exceptional: true,
          billable: true,
          comment: null,
          type_of_fee: null,
          ttc_amout: null,
          vat: null,
        }
      ]
    },
    {
      title: 'Mer. 03',
      description: 'Projets internes - KKO',
      note: 0,
      opened: false,
      items: [
        {
          id: 1,
          demand: null,
          exceptional: true,
          billable: true,
          comment: null,
          type_of_fee: null,
          ttc_amout: null,
          vat: null,
        }
      ]
    },
    {
      title: 'Jeu. 04',
      description: 'Structure',
      note: 0,
      opened: false,
      items: [
        {
          id: 1,
          demand: null,
          exceptional: true,
          billable: true,
          comment: null,
          type_of_fee: null,
          ttc_amout: null,
          vat: null,
        }
      ]
    }
  ];

  selectedAccount = null;
  type_frais = [
    { id: 1, name: 'Aucun type de frais', category: 'Aucun type de frais'},

    { id: 2, name: 'Forfait hébergement', category: 'Héberegement' },
    { id: 3, name: 'Congés sans solde', category: 'Héberegement' },

    { id: 4, name: 'Frais kms', category: 'Frais kilométriques' },
    { id: 5, name: 'Frais km sur justificatif', category: 'Frais kilométriques' },

    { id: 6, name: 'Abonnement Transport en commun', category: 'Transport en commun' },
    { id: 7, name: 'Transport occasionnel', category: 'Transport en commun' },
    { id: 8, name: 'Taxi', category: 'Transport en commun' },

    { id: 9, name: 'Péages', category: 'Véhicule' },
    { id: 10, name: 'Badge télépéage', category: 'Véhicule' },
    { id: 11, name: 'Carburant', category: 'Véhicule' },
    { id: 12, name: 'Parking', category: 'Véhicule' },
    { id: 13, name: 'Voiture location/société', category: 'Véhicule' },

  ];
  constructor() { }

  ngOnInit(): void {
  }

  ischecked(id) {

  }

  onCheckChange($event) {

  }
}
