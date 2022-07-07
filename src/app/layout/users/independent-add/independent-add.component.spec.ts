import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndependentAddComponent } from './independent-add.component';

describe('IndependentAddComponent', () => {
  let component: IndependentAddComponent;
  let fixture: ComponentFixture<IndependentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndependentAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndependentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
