import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-avance-creation',
  templateUrl: './avance-creation.component.html',
  styleUrls: ['./avance-creation.component.scss']
})
export class AvanceCreationComponent implements OnInit {
  personnels = [];
  avances = [];
  submittingCreate: any;
  submittingDiffuse: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goback() {
    this.router.navigate(['/activity/avance/list']);
  }

  createDemand() {

  }

  diffuse() {

  }
}
