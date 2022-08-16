import { Component, OnInit } from '@angular/core';
import {ActivitiesService} from "@services/activities.service";

@Component({
  selector: 'app-activity-history',
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.scss']
})
export class ActivityHistoryComponent implements OnInit {

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
}
