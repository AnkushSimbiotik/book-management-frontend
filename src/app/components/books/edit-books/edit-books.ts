import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BooksService } from '../book.service';
import { Topic } from '../../../interface/topics.interface';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [BooksService],
  templateUrl: './edit-books.html',
  styleUrls: ['./edit-books.scss'],
})
export class EditBookComponent implements OnInit {
  bookForm: FormGroup;
  topics: Topic[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private booksService: BooksService,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      topics: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.booksService.getBook(id).subscribe({
        next: (book) => {
          console.log('Book loaded for editing:', book); // Debug log
          console.log('Book topics:', book.topics); // Debug log

          // Handle both topic objects and IDs
          let topicIds: string[] = [];
          if (book.topics && Array.isArray(book.topics)) {
            if (
              book.topics.length > 0 &&
              typeof book.topics[0] === 'object' &&
              (book.topics[0] as any).id
            ) {
              // Topics are objects with id property
              topicIds = book.topics.map((topic: any) => topic.id);
            } else if (
              book.topics.length > 0 &&
              typeof book.topics[0] === 'string'
            ) {
              // Topics are already IDs
              topicIds = book.topics as unknown as string[];
            }
          }

          console.log('Extracted topic IDs:', topicIds); // Debug log

          this.bookForm.patchValue({
            title: book.title,
            author: book.author,
            topics: topicIds,
          });
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading book for editing:', err); // Debug log
          this.error = err.error?.message || 'Failed to load book';
          this.loading = false;
        },
      });
    }
    this.booksService.getTopics().subscribe({
      next: (topics) => {
        console.log('Topics loaded for editing:', topics); // Debug log
        this.topics = topics as Topic[];
      },
      error: (err) => {
        console.error('Error loading topics for editing:', err); // Debug log
        this.error = err.error?.message || 'Failed to load topics';
      },
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.booksService.updateBook(id, this.bookForm.value).subscribe({
          next: () => {
            this.router.navigate(['/books']);
          },
          error: (err) => {
            this.error = err.error?.message || 'Failed to update book';
          },
        });
      }
    }
  }

  // Helper method to get topic ID consistently
  getTopicId(topic: Topic): string {
    return topic.id || topic._id || '';
  }
}
