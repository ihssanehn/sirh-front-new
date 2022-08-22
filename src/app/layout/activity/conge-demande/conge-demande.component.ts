import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conge-demande',
  templateUrl: './conge-demande.component.html',
  styleUrls: ['./conge-demande.component.scss']
})
export class CongeDemandeComponent implements OnInit {

  types = [];
  submittingDiffuse: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  diffuse() {

  }
}
