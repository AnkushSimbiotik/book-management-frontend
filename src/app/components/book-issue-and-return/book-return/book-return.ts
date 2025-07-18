import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BookIssueService } from '../book-issue-return';
import { BookIssueDto } from '../../../interface/book-issue-return.interface';
import { IssuedBooksListComponent } from "../issued-books-list/issued-books-list";

@Component({
  selector: 'app-book-return',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IssuedBooksListComponent],
  providers: [BookIssueService],
  templateUrl: './book-return.html',
  styleUrls: ['./book-return.scss']
  
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
      bookId: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.returnForm.valid) {
      const dto: BookIssueDto = this.returnForm.value;
      this.bookIssueService.returnBook(dto).subscribe({
        next: (response) => {
          this.success = response.message;
          this.error = null;
          this.returnForm.reset();
          setTimeout(() => this.success = null, 3000); 
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to return book';
          this.success = null;
        }
      });
    }
  }

  onSearch(): void {
    this.searchUserId = this.returnForm.value.userId;
  }
}
