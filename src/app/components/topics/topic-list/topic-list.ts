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

@Component({
  selector: 'app-topics-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent, ReactiveFormsModule],
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
    const query: PaginationQuery = {
      offset: this.currentPage, // 1-based offset (e.g., 1 for first page)
      limit: this.pageSize,
      sort: this.sort || undefined,
      search: this.searchQuery || undefined,
    };
    console.log('Query:', query); // Debug log
    this.topicsService.getTopics(query).subscribe({
      next: (response) => {
        if (response && 'data' in response && Array.isArray(response.data)) {
          this.topics = [...response.data];
          this.totalPages = Math.ceil((response.length || 0) / this.pageSize);
        } else if (Array.isArray(response)) {
          this.topics = [...response];
          this.totalPages = Math.ceil(100 / this.pageSize); // Replace 100 with actual total
        } else {
          this.topics = [];
          this.totalPages = 1;
          this.error = 'Unexpected response format';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error Response:', err); // Log full error
        this.error = err.error?.message || 'Failed to load topics';
        this.topics = [];
        this.loading = false;
      },
    });
  }

  onSearch(): void {
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
    if (confirm('Are you sure you want to delete this topic?')) {
      this.topicsService.deleteTopic(id).subscribe({
        next: () => {
          this.topics = this.topics.filter((topic) => topic.id !== id);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to delete topic';
        },
      });
    }
  }

  startEdit(topic: Topic): void {
    this.editingTopicId = topic.id;
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
}
