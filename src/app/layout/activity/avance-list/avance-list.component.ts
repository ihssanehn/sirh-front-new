import { Component, OnInit } from '@angular/core';
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";

@Component({
  selector: 'app-avance-list',
  templateUrl: './avance-list.component.html',
  styleUrls: ['./avance-list.component.scss']
})
export class AvanceListComponent implements OnInit {
  submittingExport: boolean;
  repayment_status = [];
  avance_types = [];
  avance_status = [];
  status = [];
  personals = [];
  state_advance_costs = [];
  profit_centers = [];
  avance_frais = [1, 2, 3, 4];
  filter = {
    plage_starts_at: null,
    plage_ends_at: null,
    type: null,
    state_advance_cost: null,
    status: null,
    user_id: null,
    profit_centers: null
  }


  constructor(private listService: ListsService,
              public mainStore: MainStore,
              ) { }

  async ngOnInit() {
    const id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;

    try{ this.avance_types = await this.listService.getAll(this.listService.list.ADVANCE_COST).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.avance_status = await this.listService.getAll(this.listService.list.STATUS, this.listService.list.ADVANCE_COST).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.state_advance_costs = await this.listService.getAll(this.listService.list.STATUS, this.listService.list.STATE_ADVANCE_COST).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.personals = await this.listService.getPersonalsByCpId({entity_id: id_entite}).toPromise();} catch (e) {console.log('error filter FAMILY_SITUATION', e);}
    try{ this.profit_centers = await this.listService.getAll(this.listService.list.PROFIT_CENTER, {id:  id_entite}).toPromise();} catch (e) {console.log('error filter PROFIT_CENTER', e);}

  }

  export() {

  }

  getAll() {

  }

  filterChanged() {

  }
}
