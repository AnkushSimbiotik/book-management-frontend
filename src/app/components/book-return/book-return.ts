// src/app/components/book-return/book-return.component.ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IssueService } from '../../services/issue.service';

@Component({
  selector: 'app-book-return',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule , FormsModule],
  templateUrl: './book-return.html',
})
export class BookReturnComponent {
  returnForm: FormGroup;
  userSearch: string = '';
  showSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private issueService: IssueService
  ) {
    this.returnForm = this.fb.group({
      userId: ['', Validators.required],
      bookId: ['', Validators.required],
      returnDate: ['', Validators.required],
    });
  }

  searchUsers() {
    // Implement user search logic
  }

  onSubmit() {
    if (this.returnForm.valid) {
      this.issueService.returnBook(this.returnForm.value).subscribe(() => {
        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
          this.returnForm.reset();
        }, 2000);
      });
    }
  }
}