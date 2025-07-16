import { Component } from '@angular/core';
import { TopicService } from '../../../services/topic.service';
import { Router, RouterLink } from '@angular/router';
import { Topic } from '../../../models/topic.model';
import { TopicCreateComponent } from "../topic-create/topic-create";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topic-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './topic-list.html',
  
})
export class TopicListComponent {
topics: Topic[] = [];

  constructor(
    private topicService: TopicService,
    private router: Router
  ) {}

  ngOnInit() {
     this.topicService.getTopics({ page: 1, limit: 100 }).subscribe({
      next: (response) => (this.topics = response.topics),
      error: () => (this.topics = []),
    });
  }

  viewTopic(id: string) {
    this.router.navigate(['/topics', id]);
  }

  createTopic() {
    // Modal is triggered via Bootstrap's data attributes in the template
  }
}
