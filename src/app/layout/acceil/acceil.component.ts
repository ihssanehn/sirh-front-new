import { Component, OnInit } from '@angular/core';
import {UserStore} from "@store/user.store";
import {MainStore} from "@store/mainStore.store";

@Component({
  selector: 'app-acceil',
  templateUrl: './acceil.component.html',
  styleUrls: ['./acceil.component.scss']
})
export class AcceilComponent implements OnInit {

  constructor(
    public userSotre: UserStore,
    public mainStore: MainStore,
  ) {
    this.mainStore.sidebarOpened = false;
  }

  ngOnInit(): void {
  }

}
