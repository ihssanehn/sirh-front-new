import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-avance-list',
  templateUrl: './avance-list.component.html',
  styleUrls: ['./avance-list.component.scss']
})
export class AvanceListComponent implements OnInit {
  submittingExport: boolean;
  repayment_status = [];
  avance_types = [];
  status = [];
  avance_frais = [1, 2, 3, 4];
  constructor() { }

  ngOnInit(): void {
  }

  export() {

  }

  getAll() {

  }
}
