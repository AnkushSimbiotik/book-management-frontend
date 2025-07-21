// src/app/components/books/book-create/book-create.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BooksService } from '../book.service';
import { Topic } from '../../../interface/topics.interface';

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [BooksService],
  templateUrl: './book-create.html',
  styleUrls: ['./book-create.scss'],
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
      topics: [[], [Validators.required, this.validateTopics.bind(this)]], // Added custom validator
    });
  }

  // Custom validator to ensure topics array doesn't contain null values
  validateTopics(control: any) {
    if (!control.value || !Array.isArray(control.value)) {
      return { required: true };
    }

    const validTopics = control.value.filter(
      (topicId: any) => topicId != null && topicId !== ''
    );
    if (validTopics.length === 0) {
      return { required: true };
    }

    return null;
  }

  getTopicId(topic: Topic): string {
    return topic.id || topic._id || '';
  }

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    this.loading = true;
    this.error = null;
    this.booksService.getTopics().subscribe({
      next: (response) => {
        console.log('Topics response:', response); // Debug log
        this.topics = Array.isArray(response) ? response : response.data || [];
        console.log('Processed topics:', this.topics); // Debug log

        // Check for topics with missing IDs
        const invalidTopics = this.topics.filter(
          (topic) => !topic.id && !topic._id
        );
        if (invalidTopics.length > 0) {
          console.warn('Found topics without IDs:', invalidTopics);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading topics:', err); // Debug log
        this.error = err.error?.message || 'Failed to load topics';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;
      console.log('Form value:', formValue); // Debug log

      // Filter out null/undefined values from topics array
      const validTopics = formValue.topics.filter(
        (topicId: any) => topicId != null && topicId !== ''
      );
      console.log('Valid topics:', validTopics); // Debug log

      // Additional validation
      if (validTopics.length === 0) {
        this.error = 'Please select at least one valid topic';
        return;
      }

      const payload = {
        title: formValue.title.trim(),
        author: formValue.author.trim(),
        topics: validTopics,
      };

      console.log('Final payload:', payload); // Debug log

      this.loading = true;
      this.error = null;

      this.booksService.createBook(payload).subscribe({
        next: () => {
          this.loading = false;
          this.bookForm.reset(); // Reset form
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Create book error:', err); // Debug log
          this.loading = false;
          this.error =
            err.error?.message ||
            'Failed to create book. Please check your input and try again.';
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookForm.controls).forEach((key) => {
        const control = this.bookForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
