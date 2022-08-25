import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frais-saisie',
  templateUrl: './frais-saisie.component.html',
  styleUrls: ['./frais-saisie.component.scss']
})
export class FraisSaisieComponent implements OnInit {

  note_frais_list = [];
  constructor() { }

  ngOnInit(): void {
  }

  ischecked(id) {

  }

  onCheckChange($event) {

  }
}
