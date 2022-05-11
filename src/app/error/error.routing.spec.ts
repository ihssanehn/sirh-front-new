import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorRoutes } from './error.routing';
import { ErrorModule } from './error.module';
import { Location } from '@angular/common';

describe('Testing Error routing', () => {
  let router: Router;
  let location: Location;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [Location],
      imports: [ErrorModule, RouterTestingModule.withRoutes(ErrorRoutes)]
    }).compileComponents();

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.initialNavigation();
  });

  it(
    'fakeAsync works',
    fakeAsync(() => {
      const promise = new Promise(resolve => {
        setTimeout(resolve, 10);
      });
      let done = false;
      promise.then(() => (done = true));
      tick(50);
      expect(done).toBeTruthy();
    })
  );

  it(
    'navigate to "error404" takes you to /404',
    fakeAsync(() => {
      try {
        router.navigate(['404']).then(() => {
          expect(location.path()).toBe('/404');
        });
      } catch (error) {

        fail('Failed to open page 404');
      }
    })
  );

  it(
    'navigate to "error429" takes you to /429',
    fakeAsync(() => {
      try {
        router.navigate(['429']).then(() => {
          expect(location.path()).toBe('/429');
        });
      } catch (error) {
        fail('Failed to open page 429');
      }
    })
  );

  it(
    'navigate to "error500" takes you to /500',
    fakeAsync(() => {
      try {
        router.navigate(['500']).then(() => {
          expect(location.path()).toBe('/500');
        });
      } catch (error) {
        fail('Failed to open page 500');
      }
    })
  );

  it(
    'navigate to "error503" takes you to /503',
    fakeAsync(() => {
      try {
        router.navigate(['503']).then(() => {
          expect(location.path()).toBe('/503');
        });
      } catch (error) {
        fail('Failed to open page 503');
      }
    })
  );
});
