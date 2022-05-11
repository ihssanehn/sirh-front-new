import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordBannerComponent } from './password-banner.component';

describe('PasswordBannerComponent', () => {
  let component: PasswordBannerComponent;
  let fixture: ComponentFixture<PasswordBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
