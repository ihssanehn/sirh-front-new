import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongeDemandeComponent } from './conge-demande.component';

describe('CongeDemandeComponent', () => {
  let component: CongeDemandeComponent;
  let fixture: ComponentFixture<CongeDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CongeDemandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CongeDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
