// src/app/components/books/book-create/book-create.component.ts
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { TopicService } from '../../../services/topic.service';
import { Book } from '../../../models/book.model';
import { Topic } from '../../../models/topic.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './book-create.html',
})
export class BookCreateComponent implements OnInit {
  bookForm: FormGroup;
  showSuccess: boolean = false;
  topics: Topic[] = [];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private topicService: TopicService,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      topic: [[], Validators.required], // Form control for topic IDs
    });
  }

  ngOnInit() {
    this.topicService.getTopics().subscribe({
      next: (topics) => (this.topics = topics),
      error: () => (this.topics = []),
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;
      const book: Book = {
        id: 0, // Will be set by BookService
        title: formValue.title,
        author: formValue.author,
        topic: this.topics.filter(topic => formValue.topic.includes(topic.id)),
      };
      this.bookService.createBook(book).subscribe({
        next: () => {
          this.showSuccess = true;
          setTimeout(() => {
            this.showSuccess = false;
            this.bookForm.reset();
            this.router.navigate(['/books']);
          }, 2000);
        },
        error: () => {
          this.showSuccess = false;
          // Optionally show an error alert
        },
      });
    }
  }
}