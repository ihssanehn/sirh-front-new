import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAdvancedFormComponent } from './profile-advanced-form.component';

describe('ProfileAdvancedFormComponent', () => {
  let component: ProfileAdvancedFormComponent;
  let fixture: ComponentFixture<ProfileAdvancedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileAdvancedFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAdvancedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
