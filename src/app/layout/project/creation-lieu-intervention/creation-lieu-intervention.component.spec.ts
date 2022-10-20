import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationLieuInterventionComponent } from './creation-lieu-intervention.component';

describe('CreationLieuInterventionComponent', () => {
  let component: CreationLieuInterventionComponent;
  let fixture: ComponentFixture<CreationLieuInterventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationLieuInterventionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationLieuInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
