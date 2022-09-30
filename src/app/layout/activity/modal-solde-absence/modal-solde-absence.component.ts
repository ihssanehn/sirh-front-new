import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListsService} from "@services/lists.service";
import {AnsenceRequest} from "@entities/ansenceRequest";

@Component({
  selector: 'app-modal-solde-absence.component',
  templateUrl: './modal-solde-absence.component.html',
  styleUrls: ['./modal-solde-absence.component.scss']
})
export class ModalSoldeAbsenceComponent implements OnInit {
  @Input() absenceRequest: AnsenceRequest;
  constructor(
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private listService: ListsService,
  ) {
  }

  ngOnInit() {
  }


}
