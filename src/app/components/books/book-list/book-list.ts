// src/app/components/books/book-list/book-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { PaginationComponent } from '../../../common/pagination/pagination';
import { BooksService } from '../book.service';
import { Book, PaginationQuery } from '../../../interface/books.interface';
import { Topic } from '../../../interface/topics.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    PaginationComponent,
  ],
  providers: [BooksService],
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.scss'],
})
export class BooksListComponent implements OnInit {
  books: Book[] = [];
  topics: Topic[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  searchQuery: string = '';
  sort: string = '';
  loading: boolean = false;
  error: string | null = null;
  editingBookId: string | null = null;
  editForm: FormGroup;

  constructor(private booksService: BooksService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      topics: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBooks();
    this.loadTopics();
  }

  loadBooks(): void {
    this.loading = true;
    const offset = this.currentPage;
    const query: PaginationQuery = {
      offset: offset,
      limit: this.pageSize,
      sort: this.sort || undefined,
      search: this.searchQuery || undefined,
    };

    this.booksService.getBooks(query).subscribe({
      next: (response) => {
        this.books = response.data;
        this.currentPage = response.number;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.error =
          err.error?.message ||
          `Failed to load books. Ensure backend is running on http://localhost:3000 and proxy is configured.`;
        this.loading = false;
      },
    });
  }

  loadTopics(): void {
    this.booksService.getTopics().subscribe({
      next: (response) => {
        this.topics = Array.isArray(response) ? response : response.data || [];
      },
      error: (err) => {
        console.error('Failed to load topics:', err);
      },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadBooks();
  }

  onSort(): void {
    this.currentPage = 1;
    this.loadBooks();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadBooks();
  }

  // Edit functionality
  startEdit(book: Book): void {
    this.editingBookId = book._id || (book as any).id;
    this.editForm.patchValue({
      title: book.title,
      author: book.author,
      topics: Array.isArray(book.topics)
        ? book.topics.map((t) => (typeof t === 'string' ? t : t.id))
        : [],
    });
  }

  cancelEdit(): void {
    this.editingBookId = null;
    this.editForm.reset();
  }

  saveEdit(): void {
    if (this.editForm.invalid) return;
    const formValue = this.editForm.value;
    // Ensure topics is an array of strings (IDs)
    const updatePayload = {
      ...formValue,
      topics: (formValue.topics || []).map((t: any) =>
        typeof t === 'string' ? t : t.id
      ),
    };
    this.booksService.updateBook(this.editingBookId!, updatePayload).subscribe({
      next: (response) => {
        // Update the book in the local array
        const index = this.books.findIndex(
          (book) => (book._id || (book as any).id) === this.editingBookId
        );
        if (index !== -1) {
          this.books[index] = response;
        }
        this.cancelEdit();
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Failed to update book';
      },
    });
  }

  deleteBook(id: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.booksService.deleteBook(id).subscribe({
        next: () => {
          this.books = this.books.filter((book) => book._id !== id);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to delete book';
        },
      });
    }
  }

  // Helper methods
  getBookId(book: Book): string | undefined {
    return book._id || (book as any).id;
  }

  isEditing(book: Book): boolean {
    return this.editingBookId === this.getBookId(book);
  }

  getTopicNames(topics: any[]): string {
    if (!topics || topics.length === 0) return 'No topics';
    return topics
      .map((topic) => topic.genre  || 'Unknown')
      .join(', ');
  }

  getSelectedTopicNames(): string {
    const selectedTopicIds = this.editForm.get('topics')?.value || [];
    const selectedTopics = this.topics.filter((topic) =>
      selectedTopicIds.includes(topic.id || (topic as any)._id)
    );
    return selectedTopics
      .map((topic) => topic.genre || topic.genre || 'Unknown')
      .join(', ');
  }

  get titleControl(): FormControl {
    return this.editForm.get('title') as FormControl;
  }
  get authorControl(): FormControl {
    return this.editForm.get('author') as FormControl;
  }
  get topicsControl(): FormControl {
    return this.editForm.get('topics') as FormControl;
  }
}
