import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationClientComponent } from './creation-client.component';

describe('CreationClientComponent', () => {
  let component: CreationClientComponent;
  let fixture: ComponentFixture<CreationClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
