import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsService } from '../topic.service';
import { Topic } from '../../../interface/topics.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-topic',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [TopicsService],
  templateUrl: './view-topic.html',
  styleUrls: ['./view-topic.scss'],
})
export class ViewTopicComponent implements OnInit {
  topic: Topic | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private topicsService: TopicsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Topic ID from route:', id); // Debug log
    if (!id) {
      this.error = 'Invalid or missing topic ID';
      this.loading = false;
      return;
    }
    this.loading = true;
    this.topicsService.getTopic(id).subscribe({
      next: (topic) => {
        console.log('Fetched Topic:', topic); // Debug log
        this.topic = topic;
        this.loading = false;
      },
      error: (err) => {
        console.error('Topic Error:', err); // Debug log
        this.error = err.message || 'Failed to load topic';
        this.loading = false;
      },
    });
  }
}