// src/app/components/topics/topic-detail/topic-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TopicService } from '../../../services/topic.service';
import { Topic } from '../../../models/topic.model';

@Component({
  selector: 'app-topic-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topic-detail.html',
})
export class TopicDetailComponent implements OnInit {
  topic: Topic | null = null;

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.topicService.getTopic(id!).subscribe({
      next: (topic) => (this.topic = topic),
      error: () => (this.topic = null),
    });
  }
}
