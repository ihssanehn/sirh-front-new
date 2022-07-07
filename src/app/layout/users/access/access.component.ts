import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ListsService} from "@services/lists.service";
import {markFormAsDirty} from "@shared/Utils/SharedClasses";

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Output() submitAccess: EventEmitter<any> = new EventEmitter();
  @Input()
  public set permissions(val) {
    if(val && this.myForm){
      const formArray: FormArray = this.myForm.get('permissions') as FormArray;
      this.myForm.reset();
      if(val && Array.isArray(val)){
        val.forEach(item => {
          formArray.push(new FormControl(item.id));
        })
      }
      console.log('val && this.myForm', val, this.myForm.value, val.map(item => item.id));
    }
  }

  myForm: FormGroup;
  formInputs = {
    type:'type'
  };
  error = '';
  warning = '';


  access = [];
  filter = {
    by_profile: false
  }
  constructor(private fb: FormBuilder,
              private listsService: ListsService,
              ) {
    this.myForm = this.fb.group({
      permissions: new FormArray([]),
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

  filterChanged() {

  }

  saveAccess() {
    this.error = '';
    markFormAsDirty(this.myForm);
    if(!this.myForm.valid ){
      this.error = '';
      return;
    }
    this.submitAccess.emit(this.myForm.value);
  }

  onCheckChange(event, access) {
    const formArray: FormArray = this.myForm.get('permissions') as FormArray;

    console.log('event', event.target.checked, event);
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(access.id));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == access.id) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  ischecked(id) {
    // console.log('this.myForm?.value?.permissions', this.myForm?.value?.permissions);
    return this.myForm?.value?.permissions?.includes(id);
  }
}

