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
import { BookIssueDto } from '../../../interface/book-issue-return.interface';

@Component({
  selector: 'app-book-return',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [BookIssueService],
  templateUrl: './book-return.html',
  styleUrls: ['./book-return.scss'],
})
export class BookReturnComponent {
  returnForm: FormGroup;
  error: string | null = null;
  success: string | null = null;
  searchUserId: string = '';

  constructor(
    private fb: FormBuilder,
    private bookIssueService: BookIssueService,
    private router: Router
  ) {
    this.returnForm = this.fb.group({
      userId: ['', Validators.required],
      bookId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.returnForm.valid) {
      const dto: BookIssueDto = this.returnForm.value;
      console.log('Returning book with data:', dto);

      this.bookIssueService.returnBook(dto).subscribe({
        next: (response) => {
          console.log('Book returned successfully:', response);
          this.success = response.message || 'Book returned successfully!';
          this.error = null;
          this.returnForm.reset();

          // Clear success message after 5 seconds
          setTimeout(() => {
            this.success = null;
          }, 5000);
        },
        error: (err) => {
          console.error('Error returning book:', err);
          this.error = err.error?.message || 'Failed to return book';
          this.success = null;
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.returnForm.controls).forEach((key) => {
        const control = this.returnForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onSearch(): void {
    this.searchUserId = this.returnForm.value.userId;
  }
}
