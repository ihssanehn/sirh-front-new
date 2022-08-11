import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvanceListComponent } from './avance-list.component';

describe('AvanceListComponent', () => {
  let component: AvanceListComponent;
  let fixture: ComponentFixture<AvanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvanceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
