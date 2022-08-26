import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraisListComponent } from './activity-list.component';

describe('ActivityListComponent', () => {
  let component: FraisListComponent;
  let fixture: ComponentFixture<FraisListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FraisListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FraisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
