// src/app/components/books/book-create/book-create.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BooksService } from '../book.service';
import { Topic } from '../../../interface/topics.interface';

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [BooksService],
  templateUrl: './book-create.html',
  styleUrls: ['./book-create.scss']
})
export class CreateBookComponent implements OnInit {
  bookForm: FormGroup;
  topics: Topic[] = [];
  error: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private booksService: BooksService,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      topics: [[], Validators.required] // Changed to simple array control
    });
  }

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    this.loading = true;
    this.error = null;
    this.booksService.getTopics().subscribe({
      next: (response) => {
        this.topics = Array.isArray(response) ? response : (response.data || []);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load topics';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;
      // topics is already an array of selected IDs from the select dropdown
      const payload = {
        title: formValue.title,
        author: formValue.author,
        topics: formValue.topics
      };
      
      this.booksService.createBook(payload).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create book';
        }
      });
    }
  }
}