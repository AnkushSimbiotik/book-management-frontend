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
    this.error = null; // Clear previous errors
    const offset = this.currentPage;
    const query: PaginationQuery = {
      offset: offset,
      limit: this.pageSize,
      sort: this.sort || undefined,
      search: this.searchQuery || undefined,
    };

    console.log('Loading books with query:', query); // Debug log

    this.booksService.getBooks(query).subscribe({
      next: (response) => {
        let filteredBooks = response.data;

        // Debug: Log the first book to see its structure
        if (filteredBooks.length > 0) {
          console.log('First book structure:', filteredBooks[0]);
          console.log('First book topics:', filteredBooks[0].topics);
        }

        // Client-side search fallback if backend search isn't working
        if (this.searchQuery && filteredBooks.length === response.data.length) {
          const searchTerm = this.searchQuery.toLowerCase();
          filteredBooks = response.data.filter(
            (book) =>
              book.title?.toLowerCase().includes(searchTerm) ||
              book.author?.toLowerCase().includes(searchTerm)
          );
          console.log(
            'Applied client-side search filter:',
            filteredBooks.length,
            'results'
          );
        }

        this.books = filteredBooks;
        this.currentPage = response.number;
        this.totalPages = response.totalPages;

        // Client-side case-insensitive sorting fallback
        if (this.sort && !this.sort.includes('createdAt')) {
          this.books.sort((a, b) => {
            const field = this.sort.split(':')[0];
            const direction = this.sort.split(':')[1];

            let aValue = '';
            let bValue = '';

            if (field === 'title') {
              aValue = a.title?.toLowerCase() || '';
              bValue = b.title?.toLowerCase() || '';
            } else if (field === 'author') {
              aValue = a.author?.toLowerCase() || '';
              bValue = b.author?.toLowerCase() || '';
            }

            if (direction === 'desc') {
              return bValue.localeCompare(aValue);
            } else {
              return aValue.localeCompare(bValue);
            }
          });
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading books:', err); // Debug log
        this.error =
          err.error?.message ||
          `Failed to load books. Ensure backend is running on http://localhost:3000 and proxy is configured.`;
        this.loading = false;
        this.books = []; // Clear books on error
      },
    });
  }

  loadTopics(): void {
    this.booksService.getTopics().subscribe({
      next: (response) => {
        console.log('Topics response:', response); // Debug log
        this.topics = Array.isArray(response) ? response : response.data || [];
        console.log('Loaded topics:', this.topics); // Debug log

        // Log first topic structure if available
        if (this.topics.length > 0) {
          console.log('First topic structure:', this.topics[0]);
        }
      },
      error: (err) => {
        console.error('Failed to load topics:', err);
      },
    });
  }

  onSearch(): void {
    console.log('Search triggered with query:', this.searchQuery);
    this.currentPage = 1;
    this.loadBooks();
  }

  clearSearch(): void {
    console.log('Clearing search');
    this.searchQuery = '';
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
    console.log('getTopicNames called with:', topics); // Debug log

    if (!topics || topics.length === 0) {
      console.log('No topics found');
      return 'No topics';
    }

    // Check if topics are objects with genre property
    if (topics[0] && typeof topics[0] === 'object' && topics[0].genre) {
      console.log('Topics are objects with genre');
      return topics.map((topic) => topic.genre || 'Unknown').join(', ');
    }

    // Topics are likely IDs, need to look them up in the topics array
    if (topics[0] && typeof topics[0] === 'string') {
      console.log('Topics are IDs, looking up in topics array');
      const topicNames = topics.map((topicId) => {
        const topic = this.topics.find(
          (t) => t.id === topicId || t._id === topicId
        );
        console.log(`Looking for topic ID ${topicId}, found:`, topic);
        return topic ? topic.genre : 'Unknown Topic';
      });
      return topicNames.join(', ');
    }

    console.log('Unknown topic format:', topics);
    return 'Unknown format';
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
