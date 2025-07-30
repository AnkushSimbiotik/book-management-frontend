import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  CreateTopicDto,
  PaginationQuery,
  Topic,
  UpdateTopicDto,
  PaginatedTopics,
} from '../../interface/topics.interface';
import { API_CONSTANTS } from '../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class TopicsService {
  private http = inject(HttpClient);

  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

  createTopic(dto: CreateTopicDto): Observable<Topic> {
    return this.http
      .post<Topic>(API_CONSTANTS.TOPICS.BASE, dto, { headers: this.headers })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getTopics(query: PaginationQuery): Observable<PaginatedTopics> {
    const params: { [key: string]: string } = {
      offset: query.offset?.toString() || '1',
      limit: query.limit?.toString() || '10',
    };
    if (query.sort) params['sort'] = query.sort;
    if (query.search) params['search'] = query.search;

    return this.http
      .get<PaginatedTopics>(API_CONSTANTS.TOPICS.BASE, {
        headers: this.headers,
        params,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getTopic(id: string): Observable<Topic> {
    console.log('Fetching topic with ID:', id); 
    return this.http
      .get<Topic>(API_CONSTANTS.TOPICS.BY_ID(id), { headers: this.headers })
      .pipe(
        catchError((error) => {
          console.error('Get Topic Error:', error);
          return throwError(
            () => new Error(error.error?.message || 'Unable to load topic')
          );
        })
      );
  }

  updateTopic(id: string, dto: UpdateTopicDto): Observable<Topic> {
    return this.http
      .patch<Topic>(API_CONSTANTS.TOPICS.BY_ID(id), dto, {
        headers: this.headers,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  deleteTopic(id: string): Observable<Topic> {
    return this.http
      .delete<Topic>(API_CONSTANTS.TOPICS.BY_ID(id), { headers: this.headers })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getTotalTopics(): Observable<{ total: number }> {
    return this.http
      .get<{ total: number }>(API_CONSTANTS.DASHBOARD.STATS_TOPIC, {
        headers: this.headers,
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getActiveTopicsCount(): Observable<{ total: number }> {
    return this.http
      .get<{ total: number }>(
        `${API_CONSTANTS.DASHBOARD.STATS_TOPIC}?activeOnly=true`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }
}
