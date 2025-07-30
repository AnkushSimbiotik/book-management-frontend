
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopicsService } from '../topic.service';
import { Router, RouterLink } from '@angular/router';
import { NoLeadingSpaceDirective } from '../../../common/custom-directives/no-leading-space.directive';
import { noLeadingSpaceValidator } from '../../../common/custom-validatiors/no-leading-space.validator';

@Component({
  selector: 'app-create-topic',
  imports: [CommonModule, ReactiveFormsModule , NoLeadingSpaceDirective],
  providers: [TopicsService],
  templateUrl: './topic-create.html',
  styleUrls: ['./topic-create.scss'],
})
export class CreateTopicComponent {
  topicForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private topicsService: TopicsService,
    private router: Router
  ) {
    this.topicForm = this.fb.group({
      genre: ['', Validators.required , noLeadingSpaceValidator()],
      description: ['', Validators.required , noLeadingSpaceValidator()]
    });
  }

  onSubmit(): void {
    if (this.topicForm.valid) {
      this.topicsService.createTopic(this.topicForm.value).subscribe({
        next: () => {
          this.router.navigate(['/topics']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create topic';
        }
      });
    }
  }
}
