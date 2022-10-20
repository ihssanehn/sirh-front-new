import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStatsComponent } from './creation-stats.component';

describe('CreationStatsComponent', () => {
  let component: CreationStatsComponent;
  let fixture: ComponentFixture<CreationStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
