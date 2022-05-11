import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Error4Component } from './error4.component';
import { ErrorModule } from '../error.module';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

describe('Testing Error: error4 Component', () => {
  let component: Error4Component;
  let fixture: ComponentFixture<Error4Component>;
  const AppRoutes: Routes = [
    {
      path: 'statistiques/globales',
      component: class DummyComponent { },
      data: {
        heading: 'MENU.STATISTIQUES MENU.GLOBALES'
      }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [TranslateService],
      imports: [ErrorModule, TranslateModule.forRoot(), RouterTestingModule.withRoutes(AppRoutes)]
    }).compileComponents();

    fixture = TestBed.createComponent(Error4Component);
    component = fixture.componentInstance;
  });

  it('should create Error4 component', () => {
    expect(component).toBeTruthy();
  });
});
