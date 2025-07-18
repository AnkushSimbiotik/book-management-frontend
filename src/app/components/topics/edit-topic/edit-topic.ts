import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TopicsService } from '../topic.service';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  providers: [TopicsService],
  templateUrl: './edit-topic.html',
  styleUrls: ['./edit-topic.scss'],
})
export class EditTopicComponent implements OnInit {
  topicForm: FormGroup;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private topicsService: TopicsService,
    private router: Router
  ) {
    this.topicForm = this.fb.group({
      genre: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.topicsService.getTopic(id).subscribe({
        next: (topic) => {
          this.topicForm.patchValue({
            genre: topic.genre,
            description: topic.description,
          });
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load topic';
          this.loading = false;
        },
      });
    }
  }

  onSubmit(): void {
    if (this.topicForm.valid) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.topicsService.updateTopic(id, this.topicForm.value).subscribe({
          next: () => {
            this.router.navigate(['/topics']);
          },
          error: (err) => {
            this.error = err.error?.message || 'Failed to update topic';
          },
        });
      }
    }
  }
}
