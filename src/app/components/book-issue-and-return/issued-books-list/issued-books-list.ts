import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../common/pagination/pagination';
import { BookIssueService } from '../book-issue-return';
import {
  BookIssue,
  PaginationQuery,
} from '../../../interface/book-issue-return.interface';
import { NoLeadingSpaceDirective } from '../../../common/custom-directives/no-leading-space.directive';

@Component({
  selector: 'app-issued-books-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent , NoLeadingSpaceDirective],
  providers: [BookIssueService],
  templateUrl: './issued-books-list.html',
  styleUrls: ['./issued-books-list.scss'],
})
export class IssuedBooksListComponent implements OnInit {
  issuedBooks: BookIssue[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  searchQuery: string = '';
  sort: string = '';
  loading: boolean = false;
  error: string | null = null;
  searchUserId: string = '';
  searchBookId: string = '';
  statusFilter: string = 'Issued'; 

  constructor(private bookIssueService: BookIssueService) {}

  ngOnInit(): void {
    this.loadIssuedBooks();
  }

  loadIssuedBooks(): void {
    this.loading = true;
    this.error = null;

    const query: PaginationQuery = {
      offset: this.currentPage,
      limit: this.pageSize,
      sort: this.sort || undefined,
      search: this.searchQuery || undefined,
      userId: this.searchUserId || undefined,
      bookId: this.searchBookId || undefined,
    };

    console.log('Loading issued books with query:', query);

    this.bookIssueService.getAllIssuedBooks(query).subscribe({
      next: (response) => {
        console.log('Issued books loaded:', response);
        let data = response.data || [];
        if (this.searchUserId) {
          data = data.filter((b) =>
            b.userId?.toLowerCase().includes(this.searchUserId.toLowerCase())
          );
        }
        if (this.searchBookId) {
          data = data.filter((b) =>
            b.bookId?.toLowerCase().includes(this.searchBookId.toLowerCase())
          );
        }
        if (this.statusFilter) {
          data = data.filter((b) => b.status === this.statusFilter);
        }
        this.issuedBooks = data;
        this.currentPage = response.page || 1;
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading issued books:', err);
        this.error = err.error?.message || 'Failed to load issued books';
        this.loading = false;
        this.issuedBooks = [];
      },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadIssuedBooks();
  }

  clearSearch(): void {
    this.searchUserId = '';
    this.searchBookId = '';
    this.searchQuery = '';
    this.statusFilter = 'Issued';
    this.currentPage = 1;
    this.loadIssuedBooks();
  }

  onSort(): void {
    this.currentPage = 1;
    this.loadIssuedBooks();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadIssuedBooks();
  }

  // Helper methods for display
  getUserDisplay(issue: BookIssue): string {
    if (issue.user) {
      return `${issue.user.name} (${issue.user.email})`;
    }
    return `User ID: ${issue.userId}`;
  }

  getBookDisplay(issue: BookIssue): string {
    if (issue.book) {
      return `${issue.book.title} by ${issue.book.author}`;
    }
    return `Book ID: ${issue.bookId}`;
  }

  getStatusBadgeClass(status: string): string {
    return status === 'Issued' ? 'badge bg-warning' : 'badge bg-success';
  }

  getDaysOverdue(issue: BookIssue): number {
    if (issue.status === 'Returned') return 0;

    const estimatedDate = new Date(issue.estimatedReturnDate);
    const today = new Date();
    const diffTime = today.getTime() - estimatedDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  getOverdueClass(issue: BookIssue): string {
    const overdueDays = this.getDaysOverdue(issue);
    if (overdueDays === 0) return '';
    if (overdueDays <= 7) return 'table-warning';
    if (overdueDays <= 30) return 'table-danger';
    return 'table-danger';
  }
}
