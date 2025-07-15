// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { TopicService } from '../../services/topic.service';
import { Book } from '../../models/book.model';
import { Topic } from '../../models/topic.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  totalBooks: number = 0;
  totalTopics: number = 0;
  topics: Topic[] = [];
  selectedTopicId: number | null = null;
  filteredBooks: Book[] = [];

  constructor(
    private bookService: BookService,
    private topicService: TopicService
  ) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe({
      next: (books) => (this.totalBooks = books.length),
      error: () => (this.totalBooks = 0),
    });
    this.topicService.getTopics().subscribe({
      next: (topics) => {
        this.topics = topics;
        this.totalTopics = topics.length;
      },
      error: () => (this.totalTopics = 0),
    });
  }

  onTopicChange() {
    if (this.selectedTopicId) {
      this.bookService.getBooksByTopic(this.selectedTopicId).subscribe({
        next: (books) => (this.filteredBooks = books),
        error: () => (this.filteredBooks = []),
      });
    } else {
      this.filteredBooks = [];
    }
  }

  getTopicNames(topics: Topic[]): string {
    return topics.map(topic => topic.genre).join(', ');
  }
}