import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ErrorModule} from '../error.module';
import {Error503Component} from './error503.component';

describe('Testing Error: error503 Component', ()=>{

  let component: Error503Component;
  let fixture: ComponentFixture<Error503Component>;
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

    fixture = TestBed.createComponent(Error503Component);
    component = fixture.componentInstance;
  });

  it('should create Error503 component', () => {
    expect(component).toBeTruthy();
  });


});
