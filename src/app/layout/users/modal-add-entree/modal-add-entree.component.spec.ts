import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddEntreeComponent } from './modal-add-entree.component';

describe('ModalAddEntreeComponent', () => {
  let component: ModalAddEntreeComponent;
  let fixture: ComponentFixture<ModalAddEntreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddEntreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddEntreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
