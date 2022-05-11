import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-floating',
  templateUrl: './floating.component.html',
  styleUrls: ['./floating.component.scss']
})
export class FloatingComponent implements OnInit {


  @Input()
  addTitle : string = 'Ajouter';

  @Output()
  onAddClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  add(event){
    this.onAddClick.emit(event);
  }

}
