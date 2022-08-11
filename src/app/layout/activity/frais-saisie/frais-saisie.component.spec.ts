import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraisSaisieComponent } from './frais-saisie.component';

describe('FraisSaisieComponent', () => {
  let component: FraisSaisieComponent;
  let fixture: ComponentFixture<FraisSaisieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FraisSaisieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FraisSaisieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
