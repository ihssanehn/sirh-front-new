import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvanceCreationComponent } from './avance-creation.component';

describe('AvanceCreationComponent', () => {
  let component: AvanceCreationComponent;
  let fixture: ComponentFixture<AvanceCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvanceCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvanceCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
