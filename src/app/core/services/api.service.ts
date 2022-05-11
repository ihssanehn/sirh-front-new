import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable()
export class ApiService {

  public apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  private formatErrors(error: any) {
    return new error.error;
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(`${this.apiUrl}${path}`, { params });
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put(`${this.apiUrl}${path}`, body)
      .pipe(catchError(this.formatErrors));
  }

  post(path: string, body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${path}`, body);
  }

  delete(path: string, body?: any): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}${path}`, {
      body
    });
  }
}
