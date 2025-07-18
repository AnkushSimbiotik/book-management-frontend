import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, timeout } from 'rxjs';

const API_TIMEOUT = 300000; //
@Injectable()
export class CommonService {
  constructor(private http: HttpClient) {}

  commonGetService(
    endPoint: string,
    params?: HttpParams,
    HTTPOptions?: object
  ): Observable<any> {
    return this.http
      .get<any>(endPoint, { params, ...HTTPOptions })
      .pipe(timeout(API_TIMEOUT), catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => new Error(error));
  }

  commonPostService<T>(
    endPoint: string,
    body: any,
    params?: HttpParams,
    HTTPOptions?: object
  ): Observable<T> {
    return this.http.post<T>(endPoint, body, {
      params,
      ...HTTPOptions,
    });
  }
}
