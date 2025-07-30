import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { API_CONSTANTS } from '../../core/constants/api.constants';
import {
  CustomerInterface,
  CustomerResponse,
  PaginatedCustomers,
} from '../../interface/customer.interface';
import { PaginationQuery } from '../../interface/pagination.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);
  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  getCustomers(query: PaginationQuery): Observable<CustomerResponse> {
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

  getCustomer(id: string): Observable<CustomerResponse> {
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

  searchCustomers(searchTerm: string): Observable<CustomerResponse> {
    return this.http
      .get<CustomerResponse>(API_CONSTANTS.CUSTOMER.BASE, {
        headers: this.headers,
        params: { search: searchTerm },
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }
}
