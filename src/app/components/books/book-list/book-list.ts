// src/app/components/books/book-list/book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';
import { Topic } from '../../../models/topic.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-list.html',
})
export class BookListComponent implements OnInit {
  books: Book[] = [];

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe({
      next: (books) => (this.books = books),
      error: () => (this.books = []),
    });
  }

  viewBook(id: number) {
    this.router.navigate(['/books', id]);
  }

  deleteBook(id: number) {
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.books = this.books.filter(book => book.id !== id);
      },
      error: () => {
        throw new Error("Book not available")
      },
    });
  }

  getTopicNames(topics: Topic[]): string {
    return topics.map(topic => topic.genre).join(', ');
  }
}