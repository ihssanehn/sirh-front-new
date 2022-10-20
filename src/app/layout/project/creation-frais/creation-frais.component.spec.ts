import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationFraisComponent } from './creation-frais.component';

describe('CreationFraisComponent', () => {
  let component: CreationFraisComponent;
  let fixture: ComponentFixture<CreationFraisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationFraisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationFraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
