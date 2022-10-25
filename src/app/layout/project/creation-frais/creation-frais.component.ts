import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ErrorService} from "@app/core/services";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";

@Component({
  selector: 'app-creation-frais',
  templateUrl: './creation-frais.component.html',
  styleUrls: ['./creation-frais.component.scss']
})
export class CreationFraisComponent implements OnInit {

  formGroup: FormGroup;
  errors = [];
  error = '';
  warning = '';
  errorLoadData = false;
  loadingData = false;
  formInputs = {

  }
  @Input() title = '';
  @Input() type = '';
  @Input()  idProject: any;
  @Input()  submitting: boolean;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  filter = {
    frais_politique: null,
  };
  politique_frais: any;
  types = [
    {
      id: 1,
      label: 'Frais de déplacement',
    },
    {
      id: 2,
      label: 'Repas midi',
    }
  ];
  frequences = [
    {
      id: 1,
      label: 'Mensuel'
    },
    {
      id: 2,
      label: 'Journalier'
    },
    {
      id: 3,
      label: 'Annuel'
    }
  ];
  refacturables = [
    {
      value: true,
      label: 'Oui'
    },
    {
      value: false,
      label: 'Non'
    },
  ];
  frais = [
    {
      type_id: null,
      frequence_id: null,
      amount: null,
      max_amount: null,
      is_refacturable: null,
    },
    {
      type_id: null,
      frequence_id: null,
      amount: null,
      max_amount: null,
      is_refacturable: null,
    },
    {
      type_id: null,
      frequence_id: null,
      amount: null,
      max_amount: null,
      is_refacturable: null,
    }
  ];
  loadingSelect = {};
  id_entite;
  constructor(private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private router: Router,
              private location: Location,
              private modalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private translate: TranslateService,
              private changeDetectorRef: ChangeDetectorRef,
              public listService: ListsService,
              private mainStore: MainStore) {
    this.formGroup = this.formBuilder.group({
      id: [null]
    });
  }

  ngOnInit(): void {
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
  }

  save() {
    this.move(1);
  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }


  async getFilterList(items, list_name, list_param?){
    if(items === 'personals'){
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.listService.getPersonalsByCpId({entity_id: this.id_entite}).toPromise();
      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }else{
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.listService.getAll(list_name, list_param).toPromise();
      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }
  }
}
