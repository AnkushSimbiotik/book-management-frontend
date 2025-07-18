import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { API_CONSTANTS } from '../../core/constants/api.constants';
import {
  BookIssue,
  BookIssueDto,
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
          throw error;
        })
      );
  }
}
export type { BookIssue };
