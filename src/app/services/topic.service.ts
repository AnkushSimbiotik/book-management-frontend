import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Topic } from '../models/topic.model';
import { PaginationQuery } from '../common/pagination/pagination.interface';



@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private apiUrl = 'https://9a2363569f62.ngrok-free.app/topics'; // Match your backend ngrok URL

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getTopics(pagination?: PaginationQuery): Observable<{ topics: Topic[]; total: number }> {
    const params = pagination ? { page: pagination.page.toString(), limit: pagination.limit.toString() } : {};
    return this.http
      .get<{ topics: Topic[]; total: number }>(this.apiUrl, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => console.log('Topics fetched:', response)),
        catchError((error) => {
          console.error('Error fetching topics:', error);
          return throwError(() => error);
        })
      );
  }

  getTopic(id: string): Observable<Topic> {
    return this.http
      .get<Topic>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap((response) => console.log('Topic fetched:', response)),
        catchError((error) => {
          console.error('Error fetching topic:', error);
          return throwError(() => error);
        })
      );
  }

  createTopic(topic: Topic): Observable<Topic> {
    return this.http
      .post<Topic>(this.apiUrl, topic, { headers: this.getHeaders() })
      .pipe(
        tap((response) => console.log('Topic created:', response)),
        catchError((error) => {
          console.error('Error creating topic:', error);
          return throwError(() => error);
        })
      );
  }

  updateTopic(id: string, topic: Partial<Topic>): Observable<Topic> {
    return this.http
      .patch<Topic>(`${this.apiUrl}/${id}`, topic, { headers: this.getHeaders() })
      .pipe(
        tap((response) => console.log('Topic updated:', response)),
        catchError((error) => {
          console.error('Error updating topic:', error);
          return throwError(() => error);
        })
      );
  }

  deleteTopic(id: string): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/${id}`, {}, { headers: this.getHeaders() })
      .pipe(
        tap(() => console.log('Topic soft deleted:', id)),
        catchError((error) => {
          console.error('Error deleting topic:', error);
          return throwError(() => error);
        })
      );
  }
}