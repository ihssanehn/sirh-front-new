import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ErrorModule} from '../error.module';
import {Error5Component} from './error5.component';

describe('Testing Error: error5 Component', ()=>{

  let component: Error5Component;
  let fixture: ComponentFixture<Error5Component>;
  const AppRoutes: Routes = [
    {
      path: 'statistiques/globales',
      component: class DummyComponent {

      },
      data: {
        heading: 'MENU.STATISTIQUES MENU.GLOBALES'
      }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ErrorModule,
        RouterTestingModule.withRoutes(AppRoutes),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Error5Component);
    component = fixture.componentInstance;
  });

  it('should create Error5 component', () => {
    expect(component).toBeTruthy();
  });


});
