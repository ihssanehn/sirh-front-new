import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationPointageComponent } from './creation-pointage.component';

describe('CreationPointageComponent', () => {
  let component: CreationPointageComponent;
  let fixture: ComponentFixture<CreationPointageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationPointageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationPointageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
