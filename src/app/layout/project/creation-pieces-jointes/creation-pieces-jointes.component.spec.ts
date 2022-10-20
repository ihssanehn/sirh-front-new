import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationPiecesJointesComponent } from './creation-pieces-jointes.component';

describe('CreationPiecesJointesComponent', () => {
  let component: CreationPiecesJointesComponent;
  let fixture: ComponentFixture<CreationPiecesJointesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationPiecesJointesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationPiecesJointesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
