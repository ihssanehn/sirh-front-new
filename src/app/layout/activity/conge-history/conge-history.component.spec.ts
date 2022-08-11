import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongeHistoryComponent } from './conge-history.component';

describe('CongeHistoryComponent', () => {
  let component: CongeHistoryComponent;
  let fixture: ComponentFixture<CongeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CongeHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CongeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
