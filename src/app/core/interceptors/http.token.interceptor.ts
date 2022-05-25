import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { JwtService } from '@services/index';
import { JwtStore } from '@store/jwt.store';
import { MessageService } from 'primeng/api';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(
    private jwtStore: JwtStore,
    private messageService: MessageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headersConfig = {
      Accept: 'application/json',
    };
    const token = this.jwtStore.getToken;

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((err) => {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${err.error.message}`;
        } else {
          // server-side error
          console.log(err);
          errorMessage = `Error : ${err.message}`;
          this.showErrorMessage(err.status, err.statusText);
        }
        return throwError(err);
      })
    );
  }

  showErrorMessage(code: any, message: string) {
    this.messageService.add({
      severity: 'error',
      summary: "Erreur "+code,
      detail: message,
      sticky: false,
    });
  }
}
