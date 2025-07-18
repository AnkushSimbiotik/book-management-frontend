import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookIssueService } from '../book-issue-return';
import { BooksService } from '../../books/book.service';

@Component({
  selector: 'app-issued-books-list',
  standalone: true,
  imports: [CommonModule],
  providers: [BookIssueService, BooksService],
  templateUrl: './issued-books-list.html',
  styleUrls: ['./issued-books-list.scss'],
})
export class IssuedBooksListComponent implements OnChanges {
  @Input() userId: string = '';
  issuedBooks: { bookTitle: string; issueDate: Date; status: string }[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private bookIssueService: BookIssueService,
    private booksService: BooksService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.loadIssuedBooks();
    }
  }

  loadIssuedBooks(): void {
    if (!this.userId) return;
    this.loading = true;
    this.bookIssueService.getIssuedBooksByUser(this.userId, 1, 5).subscribe({
      next: (issues) => {
        this.issuedBooks = issues.data.map((issue) => ({
          bookTitle: 'Loading...',
          issueDate: issue.issueDate,
          status: issue.status,
        }));
        this.loading = false;
        issues.data.forEach((issue) => {
          this.booksService.getBook(issue.bookId).subscribe({
            next: (book) => {
              const index = this.issuedBooks.findIndex(
                (i) => i.issueDate === issue.issueDate
              );
              if (index !== -1) this.issuedBooks[index].bookTitle = book.title;
            },
            error: (err) => {
              this.error = err.error?.message || 'Failed to load book title';
            },
          });
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load issued books';
        this.loading = false;
      },
    });
  }
}
