import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { API_CONSTANTS } from '../../core/constants/api.constants';
import {
  BookIssue,
  BookIssueDto,
  PaginationQuery,
} from '../../interface/book-issue-return.interface';

@Injectable({
  providedIn: 'root',
})
export class BookIssueService {
  private http = inject(HttpClient);

  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  issueBook(
    dto: BookIssueDto
  ): Observable<{ message: string; data: BookIssue }> {
    return this.http
      .post<{ message: string; data: BookIssue }>(
        API_CONSTANTS.BOOK_ISSUES.ISSUE,
        dto,
        { headers: this.headers }
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  returnBook(
    dto: BookIssueDto
  ): Observable<{ message: string; data: BookIssue }> {
    return this.http
      .post<{ message: string; data: BookIssue }>(
        API_CONSTANTS.BOOK_ISSUES.RETURN,
        dto,
        { headers: this.headers }
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getIssuedBooksByUser(
    userId: string,
    page: number,
    pageSize: number
  ): Observable<{ data: BookIssue[]; total: number }> {
    console.log(
      `Fetching issued books for user: ${userId}, page: ${page}, pageSize: ${pageSize}`
    );

    return this.http
      .get<{ data: BookIssue[]; total: number }>(
        API_CONSTANTS.BOOK_ISSUES.BY_USER(userId),
        {
          headers: this.headers,
          params: {
            offset: page.toString(),
            limit: pageSize.toString(),
          },
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching issued books:', error);
          throw error;
        })
      );
  }

  getAllIssuedBooks(query: PaginationQuery): Observable<{
    data: BookIssue[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    console.log('Fetching all issued books with query:', query);

    const params: { [key: string]: string } = {
      offset: query.offset?.toString() || '1',
      limit: query.limit?.toString() || '10',
    };
    if (query.sort) params['sort'] = query.sort;
    if (query.search) params['search'] = query.search;

    return this.http
      .get<{
        data: BookIssue[];
        total: number;
        page: number;
        totalPages: number;
      }>(`${API_CONSTANTS.BOOK_ISSUES.BASE}/all`, {
        headers: this.headers,
        params,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching all issued books:', error);
          throw error;
        })
      );
  }
}
export type { BookIssue };
