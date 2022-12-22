import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddSortieComponent } from './modal-add-sortie.component';

describe('ModalAddSortieComponent', () => {
  let component: ModalAddSortieComponent;
  let fixture: ComponentFixture<ModalAddSortieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddSortieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddSortieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
