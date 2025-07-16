import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { TopicService } from '../../../services/topic.service';
import { Book } from '../../../models/book.model';
import { Topic } from '../../../models/topic.model';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './book-detail.html',
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  topics: Topic[] = [];

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private topicService: TopicService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.findOne(id).subscribe({
        next: (book) => (this.book = book),
        error: () => (this.book = null),
      });
       this.topicService.getTopics({ page: 1, limit: 100 }).subscribe({
      next: (response) => (this.topics = response.topics),
      error: () => (this.topics = []),
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