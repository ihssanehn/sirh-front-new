import { Component, OnInit } from '@angular/core';
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";

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

  costTypes = [];
  loadingSelect = {};
  id_entite;
  constructor(public listService: ListsService, private mainStore: MainStore,) {
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

  }

  ngOnInit(): void {
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

  ischecked(id) {

  }

  onCheckChange($event) {

  }
}
