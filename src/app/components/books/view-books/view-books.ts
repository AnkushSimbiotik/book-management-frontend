// src/app/components/books/view-book/view-book.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BooksService } from '../book.service';
import { Book } from '../../../interface/books.interface';

@Component({
  selector: 'app-view-book',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [BooksService],
  templateUrl: './view-books.html',
  styleUrls: ['./view-books.scss']
})
export class ViewBookComponent implements OnInit {
  book: Book | null = null;
  allTopics: any[] = []; // Store all topics for mapping
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = null;

    // Debug: Log all route parameters
    console.log('All route params:', this.route.snapshot.paramMap);
    console.log('Route params keys:', this.route.snapshot.paramMap.keys);

    const _id = this.route.snapshot.paramMap.get('_id');
    const id = this.route.snapshot.paramMap.get('id'); // Try both

    console.log('_id param:', _id);
    console.log('id param:', id);

    const bookId = _id || id; // Use whichever exists

    if (bookId && bookId !== 'undefined') {
      this.booksService.getBook(bookId).subscribe({
        next: (book) => {
          this.book = book;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load book. Unauthorized access may be the cause.';
          this.loading = false;
        }
      });
    } else {
      this.error = `Book ID not found in route. Received: ${bookId}`;
      this.loading = false;
    }
  }

  getTopicGenres(topics: { genre: string }[]): string {
    return topics?.map((topic) => topic.genre).join(', ') || '';
  }
}