import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceDemandeComponent } from './conge-demande.component';

describe('CongeDemandeComponent', () => {
  let component: AbsenceDemandeComponent;
  let fixture: ComponentFixture<AbsenceDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenceDemandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
