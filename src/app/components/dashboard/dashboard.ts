import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TopicsService } from '../topics/topic.service';
import { BooksService } from '../books/book.service';
import { Book } from '../../interface/books.interface';
import { Topic } from '../../interface/topics.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [BooksService, TopicsService],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  totalBooks: number | null = null;
  totalTopics: number | null = null;
  bookTopicRelationships: Book[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private booksService: BooksService,
    private topicsService: TopicsService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadBookTopicRelationships();
  }

  loadStats(): void {
    this.loading = true;
    this.booksService.getTotalBooks().subscribe({
      next: (stats) => {
        // If stats is { total: number }
        if (stats && typeof stats === 'object' && 'total' in stats && typeof (stats as any).total === 'number') {
          this.totalBooks = (stats as { total: number }).total;
        } else if (typeof stats === 'number') {
          this.totalBooks = stats;
        } else {
          this.totalBooks = null;
        }
        this.loading = false;
      },
      error: (_err) => {
        this.booksService.getBooks({ offset: 1, limit: 1 }).subscribe({
          next: (paginated) => {
            this.totalBooks = paginated.totalElements;
            this.loading = false;
          },
          error: (error: any) => {
            this.error = error.error?.message || 'Failed to load book stats';
            this.loading = false;
          },
        });
      },
    });

    this.topicsService.getTotalTopics().subscribe({
      next: (stats) => {
        if (stats && typeof stats === 'object' && 'total' in stats && typeof (stats as any).total === 'number') {
          this.totalTopics = (stats as { total: number }).total;
        } else if (typeof stats === 'number') {
          this.totalTopics = stats;
        } else {
          this.totalTopics = null;
        }
      },
      error: (err) => {
        this.topicsService.getTopics({ offset: 1, limit: 1 }).subscribe({
          next: (topics: any) => {
            this.totalTopics = topics.total;
            this.loading = false;
          },
          error: (err2) => {
            this.error = 'Failed to load topic stats';
            this.loading = false;
          },
        });
      },
    });
  }

  loadBookTopicRelationships(): void {
    this.loading = true;
    this.booksService.getBooks({ offset: 1, limit: 100 }).subscribe({
      next: (paginated) => {
        this.bookTopicRelationships = paginated.data;
        this.loading = false;
      },
      error: (err) => {
        this.error =
          err.error?.message || 'Failed to load book-topic relationships';
        this.loading = false;
      },
    });
  }
  getGenres(topics: Topic[]): string {
    return topics && topics.length
      ? topics.map((topic) => topic.genre).join(', ')
      : '';
  }
}
