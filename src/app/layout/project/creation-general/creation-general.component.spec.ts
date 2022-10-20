import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationGeneralComponent } from './creation-general.component';

describe('CreationGeneralComponent', () => {
  let component: CreationGeneralComponent;
  let fixture: ComponentFixture<CreationGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
