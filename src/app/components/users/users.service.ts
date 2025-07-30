import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserInterface } from '../../interface/user.interface';
import { catchError, Observable } from 'rxjs';
import { API_CONSTANTS } from '../../core/constants/api.constants';
import { PaginationQuery } from '../../interface/pagination.interface';
import {
  CustomerResponse,
  PaginatedCustomers,
} from '../../interface/customer.interface';

@Injectable({
  providedIn: 'root',
})
export class Users {
  private http = inject(HttpClient);
  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  createUser(user: UserInterface): Observable<CustomerResponse> {
    return this.http
      .post<CustomerResponse>(API_CONSTANTS.CUSTOMER.BASE, user, {
        headers: this.headers,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getUsers(query: PaginationQuery): Observable<CustomerResponse> {
    return this.http
      .get<CustomerResponse>(API_CONSTANTS.CUSTOMER.BASE, {
        headers: this.headers,
        params: { ...query } as any,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getUser(id: string): Observable<CustomerResponse> {
    return this.http
      .get<CustomerResponse>(API_CONSTANTS.CUSTOMER.BY_ID(id), {
        headers: this.headers,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  updateUser(id: string, user: UserInterface): Observable<CustomerResponse> {
    return this.http
      .patch<CustomerResponse>(API_CONSTANTS.CUSTOMER.BY_ID(id), user, {
        headers: this.headers,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  deleteUser(id: string): Observable<CustomerResponse> {
    return this.http
      .delete<CustomerResponse>(API_CONSTANTS.CUSTOMER.BY_ID(id), {
        headers: this.headers,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }
}
