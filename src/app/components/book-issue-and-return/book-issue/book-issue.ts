import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BookIssueService } from '../book-issue-return';
import {
  BookIssueDto,
  BookIssue,
} from '../../../interface/book-issue-return.interface';
import { PaginationComponent } from '../../../common/pagination/pagination';

@Component({
  selector: 'app-book-issue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationComponent,
  ],
  providers: [BookIssueService],
  templateUrl: './book-issue.html',
  styleUrls: ['./book-issue.scss'],
})
export class BookIssueComponent {
  issueForm: FormGroup;
  error: string | null = null;
  success: string | null = null;
  searchUserId: string = '';
  issuedBooks: BookIssue[] = [];
  issuedBooksTotal: number = 0;
  issuedBooksPage: number = 1;
  issuedBooksPageSize: number = 5;

  constructor(
    private fb: FormBuilder,
    private bookIssueService: BookIssueService,
    private router: Router
  ) {
    this.issueForm = this.fb.group({
      userId: ['', Validators.required],
      bookId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.issueForm.valid) {
      const dto: BookIssueDto = this.issueForm.value;
      this.bookIssueService.issueBook(dto).subscribe({
        next: (response) => {
          this.success = response.message;
          this.error = null;
          this.issueForm.reset();
          setTimeout(() => (this.success = null), 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to issue book';
          this.success = null;
        },
      });
    }
  }

  onSearch(page: number = 1): void {
    if (!this.searchUserId) {
      this.issuedBooks = [];
      this.issuedBooksTotal = 0;
      return;
    }
    this.issuedBooksPage = page;
    this.bookIssueService
      .getIssuedBooksByUser(
        this.searchUserId,
        this.issuedBooksPage,
        this.issuedBooksPageSize
      )
      .subscribe({
        next: (result) => {
          this.issuedBooks = result.data;
          this.issuedBooksTotal = result.total;
        },
        error: (err) => {
          this.issuedBooks = [];
          this.issuedBooksTotal = 0;
          this.error = err.error?.message || 'Failed to fetch issued books';
        },
      });
  }

  onIssuedBooksPageChange(page: number): void {
    this.onSearch(page);
  }

  get issuedBooksTotalPages(): number {
    return Math.ceil(this.issuedBooksTotal / this.issuedBooksPageSize) || 1;
  }
}
