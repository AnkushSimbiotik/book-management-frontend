import { Component, OnInit } from '@angular/core';
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
export class BookIssueComponent implements OnInit {
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

  ngOnInit(): void {
    // Test backend connectivity
    this.testBackendConnectivity();
  }

  testBackendConnectivity(): void {
    console.log('Testing backend connectivity for book issue endpoints...');
    // This will be called when component loads to verify backend is working
  }

  onSubmit(): void {
    if (this.issueForm.valid) {
      const dto: BookIssueDto = this.issueForm.value;
      console.log('Issuing book with data:', dto);

      this.bookIssueService.issueBook(dto).subscribe({
        next: (response) => {
          console.log('Book issued successfully:', response);
          this.success = response.message || 'Book issued successfully!';
          this.error = null;
          this.issueForm.reset();

          // Clear success message after 5 seconds
          setTimeout(() => {
            this.success = null;
          }, 5000);
        },
        error: (err) => {
          console.error('Error issuing book:', err);
          this.error = err.error?.message || 'Failed to issue book';
          this.success = null;
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.issueForm.controls).forEach((key) => {
        const control = this.issueForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onSearch(page: number = 1): void {
    if (!this.searchUserId) {
      this.issuedBooks = [];
      this.issuedBooksTotal = 0;
      return;
    }

    console.log(
      `Searching for issued books for user: ${this.searchUserId}, page: ${page}`
    );
    this.issuedBooksPage = page;
    this.bookIssueService
      .getIssuedBooksByUser(
        this.searchUserId,
        this.issuedBooksPage,
        this.issuedBooksPageSize
      )
      .subscribe({
        next: (result) => {
          console.log('Issued books result:', result);
          this.issuedBooks = result.data;
          this.issuedBooksTotal = result.total;
          this.error = null;

          if (result.data.length === 0) {
            this.success = 'No issued books found for this user.';
          } else {
            this.success = `Found ${result.data.length} issued book(s) for user ${this.searchUserId}.`;
          }
        },
        error: (err) => {
          console.error('Error in onSearch:', err);
          this.issuedBooks = [];
          this.issuedBooksTotal = 0;
          this.error = err.error?.message || 'Failed to fetch issued books';
          this.success = null;
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
