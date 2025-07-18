import { Inject, inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  CreateBookDto,
  UpdateBookDto,
  Book,
  PaginatedBooks,
  PaginationQuery,
} from '../../interface/books.interface';
import { API_CONSTANTS } from '../../core/constants/api.constants';
import { Topic } from '../../interface/topics.interface';
import { BookIssueDto } from '../../interface/book-issue-return.interface';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private http = inject(HttpClient);

  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  createBook(bookData: { title: string; author: string; topics: string[] }): Observable<Book> {
    return this.http.post<Book>(API_CONSTANTS.BOOKS.BASE, bookData, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Create Book Error:', error);
        return throwError(() => new Error(error.error?.message || 'Unable to create book'));
      })
    );
  }

  getBooks(query: PaginationQuery): Observable<PaginatedBooks> {
    const params: { [key: string]: string } = {
      offset: query.offset?.toString() || '1',
      limit: query.limit?.toString() || '10',
    };
    if (query.sort) params['sort'] = query.sort;
    if (query.search) params['search'] = query.search;
    return this.http
      .get<PaginatedBooks>(`/${API_CONSTANTS.BOOKS.BASE}`, {
        headers: this.headers,
        params,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${API_CONSTANTS.BOOKS.BASE}/${id}`, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Get Book Error:', error);
        return throwError(() => new Error(error.error?.message || 'Unable to load book'));
      })
    );
  }

  updateBook(id: string, bookData: Partial<Book>): Observable<Book> {
    console.log('Updating book with ID:', id, 'Data:', bookData); // Debug the update
    return this.http.patch<Book>(`${API_CONSTANTS.BOOKS.BASE}/${id}`, bookData, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Update Book Error:', error);
        return throwError(() => new Error(error.error?.message || 'Unable to update book'));
      })
    );
  }

  deleteBook(id: string): Observable<Book> {
    return this.http
      .put<Book>(
        `/${API_CONSTANTS.BOOKS.BY_ID(id)}`,
        {},
        { headers: this.headers }
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getTopics(): Observable<Topic[] | { data: Topic[]; total: number }> {
    return this.http.get<Topic[] | { data: Topic[]; total: number }>(API_CONSTANTS.TOPICS.BASE, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Get Topics Error:', error);
        return throwError(() => new Error(error.error?.message || 'Unable to load topics'));
      })
    );
  }

  getTotalBooks(): Observable<number> {
    return this.http
      .get<number>(`/${API_CONSTANTS.DASHBOARD.STATS_BOOK}`, {
        headers: this.headers,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }
}
