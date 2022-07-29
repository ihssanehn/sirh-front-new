import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListsService} from "@services/lists.service";

@Component({
  selector: 'app-modal-perimetre-users',
  templateUrl: './modal-perimetre-users.component.html',
  styleUrls: ['./modal-perimetre-users.component.scss']
})
export class ModalPerimetreUsersComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  selectedProfile_id = null;
  @Input() users = [];
  constructor(
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private listService: ListsService,
  ) {
  }

  ngOnInit() {
  }


}
