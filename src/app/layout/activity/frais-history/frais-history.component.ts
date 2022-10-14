import { Component, OnInit } from '@angular/core';
import {ActivitiesService} from "@services/activities.service";
import * as moment from "moment/moment";

@Component({
  selector: 'app-frais-history',
  templateUrl: './frais-history.component.html',
  styleUrls: ['./frais-history.component.scss']
})
export class FraisHistoryComponent implements OnInit {

  data = [];

  selectedYear = '2022';

  years = [
    '2022',
    '2021',
    '2020',
  ];
  loadingData = false;
  constructor( private activitiesService: ActivitiesService,) { }

  ngOnInit(): void {
    this.getAll();
  }

  async getAll() {
    try{
      this.loadingData = true;
      const res = await this.activitiesService.getHistoryOfActivity({year: this.selectedYear}).toPromise();
      this.data = res.data;
    }catch (e){

    }finally {
      this.loadingData = false;
    }
  }

  getMonth(date){
    return moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
  }
}
