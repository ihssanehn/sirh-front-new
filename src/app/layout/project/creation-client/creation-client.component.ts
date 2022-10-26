import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ErrorService} from "@app/core/services";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {ListsService} from "@services/lists.service";
import {MainStore} from "@store/mainStore.store";
import {SharedClasses} from "@shared/Utils/SharedClasses";

@Component({
  selector: 'app-creation-client',
  templateUrl: './creation-client.component.html',
  styleUrls: ['./creation-client.component.scss']
})
export class CreationClientComponent implements OnInit {

  formGroup: FormGroup;
  errors = [];
  error = '';
  warning = '';
  errorLoadData = false;
  loadingData = false;
  formInputs = {
    client_id: 'client_id',
    in_out_office: 'in_out_office',
    technical_contact: 'technical_contact',
    client_email: 'client_email',
    proposal_reference: 'proposal_reference',
    purchasing_contact: 'purchasing_contact'
  }
  @Input() title = '';
  @Input() type = '';
  @Input()  idProject: any;
  @Input()  submitting: any;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  loadingSelect = {};
  id_entite;
  sieges = [
    {
      label: 'Siège',
      id: true
    },
    {
      label: 'Hors siège',
      id: false
    }
  ];
  clients = [];
  constructor(private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private router: Router,
              private location: Location,
              private modalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private translate: TranslateService,
              private changeDetectorRef: ChangeDetectorRef,
              private listService: ListsService,
              private mainStore: MainStore) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      client_id: [null, Validators.compose([Validators.required])],
      in_out_office: [null, Validators.compose([Validators.required])],
      technical_contact: [null],
      client_email: [null],
      proposal_reference: [null],
      purchasing_contact: [null]
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


  isRequired(control) {
    return SharedClasses.isControlRequired(this.formGroup.controls[control]) ? '(*)': '';
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
    }else if(items === 'clients') {
      try{
        this.loadingSelect[list_name] = true;
        // {entity_id: this.id_entite}
        this[items] = await this.listService.getClients().toPromise();
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
