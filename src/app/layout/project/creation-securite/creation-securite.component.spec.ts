import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationSecuriteComponent } from './creation-securite.component';

describe('CreationSecuriteComponent', () => {
  let component: CreationSecuriteComponent;
  let fixture: ComponentFixture<CreationSecuriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationSecuriteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationSecuriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
