import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvanceModificationComponent } from './avance-creation.component';

describe('AvanceCreationComponent', () => {
  let component: AvanceModificationComponent;
  let fixture: ComponentFixture<AvanceModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvanceModificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvanceModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
