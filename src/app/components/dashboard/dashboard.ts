import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
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
  allTopics: Topic[] = []; // Store all topics for mapping
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private booksService: BooksService,
    private topicsService: TopicsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadTopics(); // Load topics first
    this.loadBookTopicRelationships();
  }

  loadStats(): void {
    this.loading = true;
    this.booksService.getTotalBooks().subscribe({
      next: (stats: { total: number }) => {
        this.totalBooks = stats.total;
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
      next: (stats: { total: number }) => {
        this.totalTopics = stats.total;
      },
      error: (err) => {
        this.topicsService.getTopics({ offset: 1, limit: 1 }).subscribe({
          next: (topics: any) => {
            this.totalTopics = topics.totalElements;
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

  loadTopics(): void {
    this.topicsService.getTopics({ offset: 1, limit: 1000 }).subscribe({
      next: (response: any) => {
        this.allTopics = response.data || response || [];
        console.log('Loaded topics for mapping:', this.allTopics);
      },
      error: (err) => {
        console.error('Failed to load topics for mapping:', err);
      },
    });
  }

  loadBookTopicRelationships(): void {
    this.loading = true;
    this.booksService.getBooks({ offset: 1, limit: 100 }).subscribe({
      next: (paginated) => {
        console.log('Books loaded:', paginated.data); // Debug log

        // Log first book structure if available
        if (paginated.data.length > 0) {
          console.log('First book structure:', paginated.data[0]);
          console.log('First book topics:', paginated.data[0].topics);
        }

        this.bookTopicRelationships = paginated.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading book-topic relationships:', err); // Debug log
        this.error =
          err.error?.message || 'Failed to load book-topic relationships';
        this.loading = false;
      },
    });
  }
  getGenres(topics: any[]): string {
    console.log('getGenres called with:', topics); // Debug log

    if (!topics || topics.length === 0) {
      return 'No topics';
    }

    // Check if topics are objects with genre property
    if (topics[0] && typeof topics[0] === 'object' && topics[0].genre) {
      console.log('Topics are objects with genre');
      return topics.map((topic) => topic.genre).join(', ');
    }

    // Topics are likely IDs, need to look them up in the allTopics array
    if (topics[0] && typeof topics[0] === 'string') {
      console.log('Topics are IDs, looking up in allTopics array');
      const topicNames = topics.map((topicId) => {
        const topic = this.allTopics.find(
          (t) => t.id === topicId || t._id === topicId
        );
        console.log(`Looking for topic ID ${topicId}, found:`, topic);
        return topic ? topic.genre : 'Unknown Topic';
      });
      return topicNames.join(', ');
    }

    console.log('Unknown topic format:', topics);
    return 'Unknown format';
  }

  viewAllBooks(): void {
    this.router.navigate(['/books']);
  }

  viewAllTopics(): void {
    this.router.navigate(['/topics']);
  }
}
