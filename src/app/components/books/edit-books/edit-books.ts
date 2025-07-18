import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BooksService } from '../book.service';
import { Topic } from '../../../interface/topics.interface';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [BooksService],
  templateUrl: './edit-books.html',
  styleUrls: ['./edit-books.scss']
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
      topics: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.booksService.getBook(id).subscribe({
        next: (book) => {
          this.bookForm.patchValue({
            title: book.title,
            author: book.author,
            topics: book.topics.map(topic => topic.id)
          });
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load book';
          this.loading = false;
        }
      });
    }
    this.booksService.getTopics().subscribe({
      next: (topics) => {
        this.topics = topics as Topic[];
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load topics';
      }
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
          }
        });
      }
    }
  }
}
