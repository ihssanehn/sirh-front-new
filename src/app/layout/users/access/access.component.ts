import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  formGroup: any;
  formInputs = {
    type:'type'
  };

  access = [

      {
        category: 'Activité',
        access: [
          {
            id: 1,
            label: 'Consulter l’état d’un relevé d’actvitité'
          },
          {
            id: 2,
            label: 'Manager l’activité prévisionnelle d’un collaborateur',
          },
          {
            id: 3,
            label: 'Modifier l’activité d’un collaborateur',
          },
          {
            id: 4,
            label: 'Modifier le status d’un relevé d’actvitité',
          }
        ]
      },
    {
      category: 'Avances de frais',
      access: [
        {
          id: 5,
          label: 'Modifier le status d’une demande d’avance de frais',
        },
        {
          id: 6,
          label: 'Modifier les informations relatives aux demandes d’avance de frais',
        },
      ]
    },
    {
      category: 'Avances de frais',
      access: [
        {
          id: 7,
          label: 'Administrer les clients',
        },
        {
          id: 8,
          label: 'Ajouter un client',
        }
      ],
    },
    {
      category: 'Collaborateurs',
      access: [
        {
          id: 9,
          label: 'Accéder aux documents des collaborateurs',
        },
        {
          id: 10,
          label: 'Modifier carrière collaborateur',
        },
        {
          id: 11,
          label: 'Voir le Reporting de collaborateurs',
        },
        {
          id: 12,
          label: 'Ajouter des demande de conges',
        },
        {
          id: 13,
          label: 'Modifier l’entretien d’un collaborateur',
        },
        {
          id: 14,
          label: 'Voir tous les collaborateurs',
        },
        {
          id: 15,
          label: 'Ajouter un collaborateurs'
        },
        {
          id: 16,
          label: 'Modifier la période d’essais d’un collaborateur'
        },
        {
          id: 17,
          label: 'Archiver ou désarchiver un collaborateur'
        },
        {
          id: 18,
          label: 'Modifier le salaire d’un collaborateur'
        },
        {
          id: 19,
          label: 'Donner ou retirer l’accès d’un collaborateur'
        },
        {
          id: 20,
          label: 'Donner ou retirer l’accès d’un collaborateur'
        },
        {
          id: 21,
          label: 'Modifier un collaborateurs'
        },
        {
          id: 22,
          label: 'Gérer les droits d’un collaborateur'
        },
        {
          id: 23,
          label: 'Valider tous les entretiens'
        },
      ]
    },
    {
      category: 'Congés',
      access: [
        {
          id: 24,
          label: 'Gérer les congés d’un collaborateur',
          category: 'Congés'
        },
        {
          id: 25,
          label: 'Modifier le status d’un congé',
          category: 'Congés'
        },
        {
          id: 26,
          label: 'Paramétrage des types de congés',
          category: 'Congés'
        },
        {
          id: 27,
          label: 'Voir les reportings de conges',
          category: 'Congés'
        },
      ]
    },
    {
      category: 'Documents',
      access: [
        {
          id: 28,
          label: 'Ajouter les documents',
          category: 'Documents'
        },
        {
          id: 29,
          label: 'Supprimer un document',
          category: 'Documents'
        },
        {
          id: 30,
          label: 'Visualiser les documents',
          category: 'Documents'
        },
      ],
    },
    {
      category: 'Factures',
      access: [
        {
          id: 31,
          label: 'Accéder à la refacturation de frais',
          category: 'Factures'
        },
        {
          id: 32,
          label: 'Administrer une facture',
          category: 'Factures'
        },
        {
          id: 32,
          label: 'Ajouter une facture',
          category: 'Factures'
        },
      ],
    },
    {
      category: 'Divers',
      access: [
        {
          id: 33,
          label: 'Diffuser un message',
          category: 'Divers'
        },
      ],
    },
    {
      category: 'Login',
      access:  [
        {
          id: 35,
          label: 'Se connecter sous le profil d’un collaborateur',
          category: 'Login'
        },
      ],
    },
    {
      category: 'Materiel',
      access:  [
        {
          id: 35,
          label: 'Administrer le parc matériel',
          category: 'Materiel'
        },
        {
          id: 36,
          label: 'Administrer le parc matériel',
          category: 'Materiel'
        },
      ],
    },
    {
      category: 'Frais',
      access: [
        {
          id: 37,
          label: 'Consulter le reporting des frais',
          category: 'Frais'
        },
        {
          id: 38,
          label: 'Modifier le status d’une demande de remboursement de frais',
          category: 'Frais'
        },
        {
          id: 39,
          label: 'Modifier les codes d’écriture des exports de frais',
          category: 'Frais'
        },
        {
          id: 40,
          label: 'Paramétrage des types de frais',
          category: 'Frais'
        },
        {
          id: 41,
          label: 'Valider au 2nd niveau une demande de remboursement de frais',
          category: 'Frais'
        },
        {
          id: 42,
          label: 'Voir l’export des frais',
          category: 'Frais'
        },
        {
          id: 43,
          label: 'Voir la mini-synthese des frais sur le dashboard',
          category: 'Frais'
        },
      ],
    },
    {
      category: 'Mission',
      access: [
        {
          id: 44,
          label: 'Ajouter une mission depuis le relevé d’activité',
          category: 'Mission'
        },
        {
          id: 45,
          label: 'Modifier les missions',
          category: 'Mission'
        },
        {
          id: 46,
          label: 'Voir les règles de frais',
          category: 'Mission'
        },
        {
          id: 47,
          label: 'Voir toute les missions',
          category: 'Mission'
        },
      ],
    },
    {
      category: 'Paramétrage',
      access: [
        {
          id: 48,
          label: 'Administrer les catégories',
          category: 'Paramétrage'
        },
        {
          id: 49,
          label: 'Administrer les compteurs',
          category: 'Paramétrage'
        },
        {
          id: 50,
          label: 'Administrer les drois',
          category: 'Paramétrage'
        },
        {
          id: 51,
          label: 'Administrer les profils',
          category: 'Paramétrage'
        },
        {
          id: 52,
          label: 'Administrer les types',
          category: 'Paramétrage'
        },
        {
          id: 53,
          label: 'Suppression mail',
          category: 'Paramétrage'
        },
      ],
    },
    {
      category: 'Propositions Financières',
      access: [
        {
          id: 54,
          label: 'Avoir accès au module',
          category: 'Propositions Financières'
        },
        {
          id: 55,
          label: 'Modifier une proposition ou une version',
          category: 'Propositions Financières'
        },
        {
          id: 56,
          label: 'Supprimer une version',
          category: 'Propositions Financières'
        },
        {
          id: 57,
          label: 'Voir toutes les propositions',
          category: 'Propositions Financières'
        },
      ],
    },
    {
      category: 'QHSE',
      access: [
        {
          id: 58,
          label: 'Créer un plan de prévention',
          category: 'QHSE'
        },
        {
          id: 59,
          label: 'Manager les revues sécurités',
          category: 'QHSE'
        },
        {
          id: 60,
          label: 'Valider la lecture',
          category: 'QHSE'
        },
        {
          id: 61,
          label: 'Valider les plan de prévention',
          category: 'QHSE'
        },
        {
          id: 62,
          label: 'Voir toutes les fiches de renseignement de sécurité',
          category: 'QHSE'
        },
        {
          id: 63,
          label: 'Voir toutes les revues sécurités',
          category: 'QHSE'
        },
      ],
    },
    {
      category: 'Projets',
      access: [
       {
         id: 64,
         label: 'Modifier les projets',
         category: 'Projets'
       },
       {
         id: 65,
         label: 'Voir tous les projets',
         category: 'Projets'
       },
       {
         id: 66,
         label: 'Voir tous les projets',
         category: 'Projets'
       },
     ]
    }
  ];

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      type: []
    })
  }

  ngOnInit(): void {
  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }

  submit() {

  }

  getPage(data) {
    if(!data) return;

      while(data.length>0 && data?.length < 5){
        data.push();
      }

  }
}

