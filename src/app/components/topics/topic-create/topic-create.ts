import { Component, EventEmitter, Output } from '@angular/core';
import { Topic } from '../../../models/topic.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TopicService } from '../../../services/topic.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topic-create',
  imports: [ReactiveFormsModule , CommonModule ],
  templateUrl: './topic-create.html',
})
export class TopicCreateComponent {
@Output() topicCreated = new EventEmitter<Topic>();
  topicForm: FormGroup;
  showSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private topicService: TopicService,
    private router: Router
  ) {
    this.topicForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.topicForm.valid) {
      this.topicService.createTopic(this.topicForm.value).subscribe(topic => {
        this.topicCreated.emit(topic);
        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
          this.topicForm.reset();
          const modal = document.getElementById('createTopicModal');
          if (modal) {
            const bootstrap = (window as any).bootstrap;
            bootstrap.Modal.getInstance(modal)?.hide();
          }
        }, 2000);
      });
    }
  }
}
