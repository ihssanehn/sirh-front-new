import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ErrorModule} from '../error.module';
import {Error429Component} from './error429.component';

describe('Testing Error: error429 Component', ()=>{

  let component: Error429Component;
  let fixture: ComponentFixture<Error429Component>;
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

    fixture = TestBed.createComponent(Error429Component);
    component = fixture.componentInstance;
  });

  it('should create Error429 component', () => {
    expect(component).toBeTruthy();
  });


});
