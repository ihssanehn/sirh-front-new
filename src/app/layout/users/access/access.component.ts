import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ListsService} from "@services/lists.service";

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  formGroup: any;
  formInputs = {
    type:'type'
  };

  access = [];

  constructor(private fb: FormBuilder,
              private listsService: ListsService,
              ) {
    this.formGroup = this.fb.group({
      type: []
    });
    this.getPermissions();
  }

  ngOnInit(): void {
  }

  async getPermissions(){
    try {
      const res = await this.listsService.getAll(this.listsService.list.PERMISSIONS_BY_ELEMENT).toPromise();
      this.access = res;
      let index = 0;
      this.access.forEach(category => {
        if (category?.access?.length)
          while(category?.access?.length > 0 && category?.access?.length <5){
            category.access.push({});
          }
        // if(category.access.length>10){
        //   category.class= 'col-4';
        // }else if()
        // if(index %)
        // index++;
      });

      console.log('res', res);
    }catch (e){
      console.log('e', e);
    }
  }

  move(to) {
    if(to == 1){
      this.next.emit();
    }else{
      this.preview.emit();
    }
  }

  submit() {

  }

  getPage(data) {
    if(!data) return;

      // while(data.length>0 && data?.length < 5){
      //   data.push();
      // }
    return data;
  }
}

