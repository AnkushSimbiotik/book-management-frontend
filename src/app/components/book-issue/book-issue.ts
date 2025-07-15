import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IssueService } from '../../services/issue.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-issue',
  imports: [FormsModule , ReactiveFormsModule , CommonModule],
  templateUrl: './book-issue.html',
  styleUrl: './book-issue.scss'
})
export class BookIssueComponent {
issueForm: FormGroup;
  userSearch: string = '';
  bookSearch: string = '';

  constructor(private fb: FormBuilder, private issueService: IssueService) {
    this.issueForm = this.fb.group({
      userId: ['', Validators.required],
      bookId: ['', Validators.required],
      issueDate: ['', Validators.required]
    });
  }

  searchUsers() {
    // Implement user search logic
  }

  searchBooks() {
    // Implement book search logic
  }

  onSubmit() {
    if (this.issueForm.valid) {
      this.issueService.issueBook(this.issueForm.value).subscribe(() => {
        this.issueForm.reset();
      });
    }
  }
}
