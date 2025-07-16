import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Book } from '../models/book.model';
import { Topic } from '../models/topic.model';
import { PaginationQuery } from '../common/pagination/pagination.interface';


@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'https://9a2363569f62.ngrok-free.app/books'; // Match your backend ngrok URL

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  createBook(book: Book): Observable<Book> {
    return this.http
      .post<Book>(this.apiUrl, book, { headers: this.getHeaders() })
      .pipe(
        tap((response) => console.log('Book created:', response)),
        catchError((error) => {
          console.error('Error creating book:', error);
          return throwError(() => error);
        })
      );
  }

  findAll(pagination: PaginationQuery): Observable<{ books: Book[]; total: number }> {
    const params = { page: pagination.page.toString(), limit: pagination.limit.toString() };
    return this.http
      .get<{ books: Book[]; total: number }>(this.apiUrl, {
        headers: this.getHeaders(),
        params,
      })
      .pipe(
        tap((response) => console.log('Books fetched:', response)),
        catchError((error) => {
          console.error('Error fetching books:', error);
          return throwError(() => error);
        })
      );
  }

  findOne(id: string): Observable<Book> {
    return this.http
      .get<Book>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap((response) => console.log('Book fetched:', response)),
        catchError((error) => {
          console.error('Error fetching book:', error);
          return throwError(() => error);
        })
      );
  }

  updateBook(id: string, book: Partial<Book>): Observable<Book> {
    return this.http
      .patch<Book>(`${this.apiUrl}/${id}`, book, { headers: this.getHeaders() })
      .pipe(
        tap((response) => console.log('Book updated:', response)),
        catchError((error) => {
          console.error('Error updating book:', error);
          return throwError(() => error);
        })
      );
  }

  deleteBook(id: string): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/${id}`, {}, { headers: this.getHeaders() })
      .pipe(
        tap(() => console.log('Book soft deleted:', id)),
        catchError((error) => {
          console.error('Error deleting book:', error);
          return throwError(() => error);
        })
      );
  }
}