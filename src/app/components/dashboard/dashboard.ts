import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environments/environment';

interface Book {
  id: string;
  title: string;
  author: string;
  topic: string | string[]; // Can be a single ID or array of IDs
}

interface Topic {
  id: string;
  genre: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgbModule],
})
export class DashboardComponent implements OnInit {
  totalBooks: number = 0;
  totalTopics: number = 0;
  topics: Topic[] = [];
  filteredBooks: Book[] = [];
  selectedTopicId: string | null = null;
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    // Fetch total books
    this.http.get<number>(`${this.apiUrl}/stats/total-books`).pipe(
      
      tap(total => {
        console.log(`${this.apiUrl}/stats/total-books`)
        console.log(`${this.totalBooks} Books are there`)
        this.totalBooks = total
      }),
      catchError(error => {
        console.error('Error fetching total books:', error);
        return of(0);
      })
    ).subscribe();

          console.log(`${this.apiUrl}/stats/total-books`)
    // Fetch total topics
    this.http.get<number>(`${this.apiUrl}/stats/total-topics`).pipe(
      tap(total => this.totalTopics = total),
      catchError(error => {
        console.error('Error fetching total topics:', error);
        return of(0);
      })
    ).subscribe();

    // Fetch topics list
    this.http.get<Topic[]>(`${this.apiUrl}/topics`).pipe(
      tap(topics => this.topics = topics),
      catchError(error => {
        console.error('Error fetching topics:', error);
        return of([]);
      })
    ).subscribe();

    // Fetch all books
    this.http.get<Book[]>(`${this.apiUrl}/books`).pipe(
      tap(books => this.filteredBooks = books),
      catchError(error => {
        console.error('Error fetching books:', error);
        return of([]);
      })
    ).subscribe();
  }

  onTopicChange() {
    if (this.selectedTopicId === null) {
      // Show all books if "All Topics" is selected
      this.http.get<Book[]>(`${this.apiUrl}/books`).pipe(
        tap(books => this.filteredBooks = books),
        catchError(error => {
          console.error('Error fetching books:', error);
          return of([]);
        })
      ).subscribe();
    } else {
      // Filter books by selected topic
      this.http.get<Book[]>(`${this.apiUrl}/books?topic=${this.selectedTopicId}`).pipe(
        tap(books => this.filteredBooks = books),
        catchError(error => {
          console.error('Error fetching filtered books:', error);
          return of([]);
        })
      ).subscribe();
    }
  }

  getTopicNames(topicIds: string | string[]): string {
    if (!this.topics.length || !topicIds) return 'N/A';
    const ids = Array.isArray(topicIds) ? topicIds : [topicIds];
    const topicNames = this.topics
      .filter(topic => ids.includes(topic.id))
      .map(topic => topic.genre);
    return topicNames.join(', ') || 'N/A';
  }
}