import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraisHistoryComponent } from './frais-history.component';

describe('FraisHistoryComponent', () => {
  let component: FraisHistoryComponent;
  let fixture: ComponentFixture<FraisHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FraisHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FraisHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
