import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { TopicService } from '../../../services/topic.service';
import { Book } from '../../../models/book.model';
import { Topic } from '../../../models/topic.model';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './book-list.html',
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  topics: Topic[] = [];
  page = 1;
  limit = 10;
  total = 0;

  constructor(
    private bookService: BookService,
    private topicService: TopicService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBooks();
   
    this.topicService.getTopics({ page: 1, limit: 100 }).subscribe({
      next: (response) => (this.topics = response.topics),
      error: () => (this.topics = []),
    });
  }

  loadBooks() {
    this.bookService.findAll({ page: this.page, limit: this.limit }).subscribe({
      next: (response) => {
        this.books = response.books;
        this.total = response.total;
      },
      error: () => {
        this.books = [];
        this.total = 0;
      },
    });
  }

  viewBook(id: string) {
    this.router.navigate([`/books/${id}`]);
  }

  deleteBook(id: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => this.loadBooks(),
        error: (error) => console.error('Error deleting book:', error),
      });
    }
  }

  getTopicNames(topicIds: string | string[]): string {
    if (!this.topics.length || !topicIds) return 'N/A';
    const ids = Array.isArray(topicIds) ? topicIds : [topicIds];
    const topicNames = this.topics
      .filter(topic => ids.includes(topic.id))
      .map(topic => topic.genre);
    return topicNames.join(', ') || 'N/A';
  }
}