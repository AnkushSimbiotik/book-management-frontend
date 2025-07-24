import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { NoLeadingSpaceDirective } from '../../../common/custom-directives/no-leading-space.directive';
import { noLeadingSpaceValidator } from '../../../common/custom-validatiors/no-leading-space.validator';

@Component({
  selector: 'app-topics-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PaginationComponent,
    ReactiveFormsModule,
    NoLeadingSpaceDirective,
  ],
  providers: [TopicsService],
  templateUrl: './topic-list.html',
  styleUrls: ['./topic-list.scss'],
})
export class TopicsListComponent implements OnInit, OnDestroy {
  topics: Topic[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  searchQuery: string = '';
  sort: string = 'createdAt:desc';
  loading: boolean = false;
  error: string | null = null;
  editingTopicId: string | null = null;
  editForm: FormGroup;
  private destroy$ = new Subject<void>();
  searchControl = new FormControl('', [noLeadingSpaceValidator()]);

  constructor(private topicsService: TopicsService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      genre: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadTopics();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTopics(): void {
    this.loading = true;
    this.error = null;
    const query: PaginationQuery = {
      offset: this.currentPage,
      limit: this.pageSize,
      sort: this.sort || undefined,
      search: this.searchQuery || undefined,
    };
    console.log('Loading topics with query:', query);
    this.topicsService.getTopics(query).subscribe({
      next: (response) => {
        this.topics = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
        if (this.topics.length > 0) {
          console.log('First topic structure:', this.topics[0]);
        }
      },
      error: (err) => {
        console.error('Error loading topics:', err);
        this.error = err.error?.message || 'Failed to load topics';
        this.topics = [];
        this.loading = false;
      },
    });
  }

  clearSearch(): void {
    console.log('Clearing search');
    this.searchQuery = '';
    this.searchControl.setValue('');
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

  isEditing(topic: Topic): boolean {
    return this.editingTopicId === this.getTopicId(topic);
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
            (t) => this.getTopicId(t) === this.editingTopicId
          );
          if (idx !== -1) this.topics[idx] = updatedTopic;
          this.cancelEdit();
          this.loadTopics();
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update topic';
        },
      });
  }

  get genreControl(): FormControl {
    return this.editForm.get('genre') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.editForm.get('description') as FormControl;
  }

  getTopicId(topic: Topic): string {
    const topicId = topic.id || (topic as any)._id || '';
    console.log('getTopicId called for topic:', topic);
    console.log('Returning topic ID:', topicId);
    return topicId;
  }

  startEdit(topic: Topic): void {
    this.editingTopicId = this.getTopicId(topic);
    this.editForm.patchValue({
      genre: topic.genre,
      description: topic.description,
    });
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value: string | null) => {
        this.searchQuery = value ? value.trim() : '';
        console.log('Dynamic search query:', this.searchQuery);
        this.currentPage = 1;
        this.loadTopics();
      });
  }
}