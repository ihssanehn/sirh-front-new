import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedClasses} from "@shared/Utils/SharedClasses";
import frLocale from "date-fns/locale/fr";
import {Activity} from "@app/core/entities";
import {Subscription} from "rxjs";
import {ListsService} from "@services/lists.service";
import {ActivitiesService} from "@services/activities.service";
import * as _moment from "moment";

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-admin-solds-abs',
  templateUrl: './admin-solds-abs.component.html',
  styleUrls: ['./admin-solds-abs.component.scss']
})
export class AdminSoldsAbsComponent implements OnInit {

  entities = [
    {
      entity: 'Piman',
      category: 'LIBELLE_ENTETE_CP1',
      children: [
        {
          id: 1,
          value: 'Congés payés à solder avant fin Mai 2024',
          label: 'Valeur'
        },
        {
          id: 2,
          label: 'Valeur dur mobile',
          value: 'Congés payés à solder avant fin Mai 2020'
        }
      ]
    },
    {
      entity: 'Law Suite By Piman',
      children: [
        {
          id: 1,
          value: 'Congés payés à solder avant fin Mai 2024',
          label: 'Valeur'
        },
        {
          id: 2,
          label: 'Valeur dur mobile',
          value: 'Congés payés à solder avant fin Mai 2020'
        }
      ]
    },
    {
      entity: 'Piman Advisory',
      children: [
        {
          id: 1,
          value: 'Congés payés à solder avant fin Mai 2024',
          label: 'Valeur'
        },
        {
          id: 2,
          label: 'Valeur dur mobile',
          value: 'Congés payés à solder avant fin Mai 2020'
        }
      ]
    },
    {
      entity: 'Piman Analytics',
      children: [
        {
          id: 1,
          value: 'Congés payés à solder avant fin Mai 2024',
          label: 'Valeur'
        },
        {
          id: 2,
          label: 'Valeur dur mobile',
          value: 'Congés payés à solder avant fin Mai 2020'
        }
      ]
    },
    {
      entity: 'Piman Digital Solutions',
      children: [
        {
          id: 1,
          value: 'Congés payés à solder avant fin Mai 2024',
          label: 'Valeur'
        },
        {
          id: 2,
          label: 'Valeur dur mobile',
          value: 'Congés payés à solder avant fin Mai 2020'
        }
      ]
    },
    {
      entity: 'Piman Healthcare',
      children: [
        {
          id: 1,
          value: 'Congés payés à solder avant fin Mai 2024',
          label: 'Valeur'
        },
        {
          id: 2,
          label: 'Valeur dur mobile',
          value: 'Congés payés à solder avant fin Mai 2020'
        }
      ]
    },
    {
      entity: 'Piman IT',
      children: [
        {
          id: 1,
          value: 'Congés payés à solder avant fin Mai 2024',
          label: 'Valeur'
        },
        {
          id: 2,
          label: 'Valeur dur mobile',
          value: 'Congés payés à solder avant fin Mai 2020'
        }
      ]
    },
    {
      entity: 'Private Discuss',
      children: [
        {
          id: 1,
          value: 'Congés payés à solder avant fin Mai 2024',
          label: 'Valeur'
        },
        {
          id: 2,
          label: 'Valeur dur mobile',
          value: 'Congés payés à solder avant fin Mai 2020'
        }
      ]
    },
    {
      entity: 'Risk Management By Piman Security',
      children: [
        {
          id: 1,
          value: 'Congés payés à solder avant fin Mai 2024',
          label: 'Valeur'
        },
        {
          id: 2,
          label: 'Valeur dur mobile',
          value: 'Congés payés à solder avant fin Mai 2020'
        }
      ]
    },
    {
      entity: 'Secured By Piman Security',
      children: [
        {
          id: 1,
          value: 'Congés payés à solder avant fin Mai 2024',
          label: 'Valeur'
        },
        {
          id: 2,
          label: 'Valeur dur mobile',
          value: 'Congés payés à solder avant fin Mai 2020'
        }
      ]
    }
  ];

  constructor(private listService: ListsService,
              private activitiesService: ActivitiesService,
  ) { }

  ngOnInit(): void {

  }


}
