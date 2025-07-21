import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../common/pagination/pagination';
import { PaginationQuery, Topic } from '../../../interface/topics.interface';
import { RouterLink } from '@angular/router';
import { TopicsService } from '../topic.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { PaginatedTopics } from '../../../interface/topics.interface';

@Component({
  selector: 'app-topics-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PaginationComponent,
    ReactiveFormsModule,
  ],
  providers: [TopicsService],
  templateUrl: './topic-list.html',
  styleUrls: ['./topic-list.scss'],
})
export class TopicsListComponent implements OnInit {
  topics: Topic[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  searchQuery: string = '';
  sort: string = '';
  loading: boolean = false;
  error: string | null = null;
  editingTopicId: string | null = null;
  editForm: FormGroup;

  constructor(private topicsService: TopicsService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      genre: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    this.loading = true;
    this.error = null; // Clear previous errors
    const query: PaginationQuery = {
      offset: this.currentPage, // 1-based offset (e.g., 1 for first page)
      limit: this.pageSize,
      sort: this.sort || undefined,
      search: this.searchQuery || undefined,
    };
    console.log('Loading topics with query:', query); // Debug log
    this.topicsService.getTopics(query).subscribe({
      next: (response: PaginatedTopics) => {
        let filteredTopics = response.data || [];

        // Debug: Log the first topic to see its structure
        if (filteredTopics.length > 0) {
          console.log('First topic structure:', filteredTopics[0]);
          console.log('First topic id:', filteredTopics[0].id);
          console.log('First topic _id:', (filteredTopics[0] as any)._id);
        }

        // Client-side search fallback if backend search isn't working
        if (
          this.searchQuery &&
          filteredTopics.length === (response.data || []).length
        ) {
          const searchTerm = this.searchQuery.toLowerCase();
          filteredTopics = (response.data || []).filter(
            (topic) =>
              topic.genre?.toLowerCase().includes(searchTerm) ||
              topic.description?.toLowerCase().includes(searchTerm)
          );
          console.log(
            'Applied client-side search filter:',
            filteredTopics.length,
            'results'
          );
        }

        // Backend always returns paginated response
        this.topics = filteredTopics;
        this.totalPages = response.totalPages || 1;

        // Debug: Log all topics to see their structure
        console.log('All loaded topics:');
        this.topics.forEach((topic, index) => {
          console.log(`Topic ${index + 1}:`, {
            topic: topic,
            id: topic.id,
            _id: (topic as any)._id,
            genre: topic.genre,
            description: topic.description,
          });
        });

        // Client-side case-insensitive sorting fallback
        if (this.sort && !this.sort.includes('createdAt')) {
          this.topics.sort((a, b) => {
            const field = this.sort.split(':')[0];
            const direction = this.sort.split(':')[1];

            let aValue = '';
            let bValue = '';

            if (field === 'genre') {
              aValue = a.genre?.toLowerCase() || '';
              bValue = b.genre?.toLowerCase() || '';
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
        console.error('Error loading topics:', err); // Debug log
        this.error = err.error?.message || 'Failed to load topics';
        this.topics = []; // Clear topics on error
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    console.log('Search triggered with query:', this.searchQuery);
    this.currentPage = 1;
    this.loadTopics();
  }

  clearSearch(): void {
    console.log('Clearing search');
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadTopics();
  }

  onSort(): void {
    this.currentPage = 1;
    this.loadTopics();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTopics();
  }

  deleteTopic(id: string): void {
    console.log('deleteTopic called with ID:', id);
    if (confirm('Are you sure you want to delete this topic?')) {
      this.topicsService.deleteTopic(id).subscribe({
        next: () => {
          this.topics = this.topics.filter(
            (topic) => this.getTopicId(topic) !== id
          );
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to delete topic';
        },
      });
    }
  }

  startEdit(topic: Topic): void {
    console.log('startEdit called with topic:', topic);
    console.log('Topic ID for editing:', this.getTopicId(topic));
    this.editingTopicId = this.getTopicId(topic);
    this.editForm.patchValue({
      genre: topic.genre,
      description: topic.description,
    });
  }

  cancelEdit(): void {
    this.editingTopicId = null;
    this.editForm.reset();
  }

  saveEdit(): void {
    if (this.editForm.invalid) return;
    this.topicsService
      .updateTopic(this.editingTopicId!, this.editForm.value)
      .subscribe({
        next: (updatedTopic) => {
          const idx = this.topics.findIndex(
            (t) => t.id === this.editingTopicId
          );
          if (idx !== -1) this.topics[idx] = updatedTopic;
          this.cancelEdit();
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update topic';
        },
      });
  }

  isEditing(topic: Topic): boolean {
    return this.editingTopicId === topic.id;
  }

  get genreControl(): FormControl {
    return this.editForm.get('genre') as FormControl;
  }
  get descriptionControl(): FormControl {
    return this.editForm.get('description') as FormControl;
  }

  // Helper method to get topic ID consistently
  getTopicId(topic: Topic): string {
    const topicId = topic.id || (topic as any)._id || '';
    console.log('getTopicId called for topic:', topic);
    console.log('Returning topic ID:', topicId);
    return topicId;
  }
}
