// src/app/components/books/book-detail/book-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';
import { Topic } from '../../../models/topic.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-detail.html',
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBook(id).subscribe({
      next: (book) => (this.book = book),
      error: () => (this.book = null),
    });
  }

  getTopicNames(topics: Topic[]): string {
    return topics.map(topic => topic.genre).join(', ');
  }
}