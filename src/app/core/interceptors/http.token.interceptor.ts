import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtService } from '@services/index';
import {JwtStore} from '@store/jwt.store';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtStore: JwtStore) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headersConfig = {
      Accept: 'application/json'
    };
    const token = this.jwtStore.getToken;

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);
  }
}
