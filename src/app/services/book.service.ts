// src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Book } from '../models/book.model';
import { Topic } from '../models/topic.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly STORAGE_KEY = 'library_books';

  private initialBooks: Book[] = [
    { id: 1, title: 'Sample Book', author: 'John Doe', topic: [
      { id: 1, genre: 'Fiction', description: 'Fictional literature' },
      { id: 2, genre: 'Non-Fiction', description: 'Non-fictional literature' }
    ] },
    { id: 2, title: 'Another Book', author: 'Jane Smith', topic: [
      { id: 1, genre: 'Fiction', description: 'Fictional literature' }
    ] },
  ];

  constructor(private http: HttpClient) {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.initialBooks));
    }
  }

  private getBooksFromStorage(): Book[] {
    const booksJson = localStorage.getItem(this.STORAGE_KEY);
    return booksJson ? JSON.parse(booksJson) : [];
  }

  private saveBooksToStorage(books: Book[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books));
  }

  getBooks(): Observable<Book[]> {
    return of(this.getBooksFromStorage());
  }

  getBook(id: number): Observable<Book> {
    const book = this.getBooksFromStorage().find(book => book.id === id);
    return of(book!); // Assume book exists; handle undefined in real app
  }

  createBook(book: Book): Observable<Book> {
    const books = this.getBooksFromStorage();
    book.id = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    books.push(book);
    this.saveBooksToStorage(books);
    return of(book);
  }

  deleteBook(id: number): Observable<void> {
    const books = this.getBooksFromStorage().filter(book => book.id !== id);
    this.saveBooksToStorage(books);
    return of(void 0);
  }

  getBooksByTopic(topicId: number): Observable<Book[]> {
    return of(this.getBooksFromStorage().filter(book => book.topic.some(topic => topic.id === topicId)));
  }
}