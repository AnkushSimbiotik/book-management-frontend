import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BooksService } from '../book.service';
import { Topic } from '../../../interface/topics.interface';
import { NoLeadingSpaceDirective } from '../../../common/custom-directives/no-leading-space.directive';
import { noLeadingSpaceValidator } from '../../../common/custom-validatiors/no-leading-space.validator';


@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    NoLeadingSpaceDirective,
  ],
  providers: [BooksService],
  templateUrl: './book-create.html',
  styleUrls: ['./book-create.scss'],
})
export class CreateBookComponent implements OnInit {
  bookForm: FormGroup;
  topics: Topic[] = [];
  error: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private booksService: BooksService,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, noLeadingSpaceValidator()]],
      author: ['', [Validators.required, noLeadingSpaceValidator()]],
      topics: [[], [Validators.required, this.validateTopics.bind(this)]],
    });
  }

  validateTopics(control: any) {
    if (!control.value || !Array.isArray(control.value) || control.value.length === 0) {
      return { required: true };
    }
    const validTopics = control.value.filter(
      (topicId: any) => topicId != null && topicId !== ''
    );
    if (validTopics.length === 0) {
      return { required: true };
    }
    return null;
  }

  getTopicId(topic: Topic): string {
    return topic.id || topic._id || '';
  }

  ngOnInit(): void {
    this.loadTopics();
    console.log('Form initialized:', this.bookForm.value);
    console.log('Title validators:', this.bookForm.get('title')?.validator);
    console.log('Author validators:', this.bookForm.get('author')?.validator);
    console.log('Topics validators:', this.bookForm.get('topics')?.validator);
  }

  loadTopics(): void {
    this.loading = true;
    this.error = null;
    this.booksService.getTopics().subscribe({
      next: (response) => {
        console.log('Topics response:', response);
        this.topics = Array.isArray(response) ? response : response.data || [];
        console.log('Processed topics:', this.topics);

        const invalidTopics = this.topics.filter(
          (topic) => !topic.id && !topic._id
        );
        if (invalidTopics.length > 0) {
          console.warn('Found topics without IDs:', invalidTopics);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading topics:', err);
        this.error = err.error?.message || 'Failed to load topics';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    console.log('Form submitted, valid:', this.bookForm.valid);
    console.log('Form errors:', {
      title: this.bookForm.get('title')?.errors,
      author: this.bookForm.get('author')?.errors,
      topics: this.bookForm.get('topics')?.errors,
    });

    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;
      console.log('Form value:', formValue);

      const validTopics = formValue.topics.filter(
        (topicId: any) => topicId != null && topicId !== ''
      );
      console.log('Valid topics:', validTopics);

      if (validTopics.length === 0) {
        this.error = 'Please select at least one valid topic';
        return;
      }

      const payload = {
        title: formValue.title,
        author: formValue.author,
        topics: validTopics,
      };

      console.log('Final payload:', payload);

      this.loading = true;
      this.error = null;

      this.booksService.createBook(payload).subscribe({
        next: () => {
          this.loading = false;
          this.bookForm.reset();
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Create book error:', err);
          this.loading = false;
          this.error =
            err.error?.message ||
            'Failed to create book. Please check your input and try again.';
        },
      });
    } else {
      Object.keys(this.bookForm.controls).forEach((key) => {
        const control = this.bookForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  get titleControl(): FormControl {
    return this.bookForm.get('title') as FormControl;
  }

  get authorControl(): FormControl {
    return this.bookForm.get('author') as FormControl;
  }

  get topicsControl(): FormControl {
    return this.bookForm.get('topics') as FormControl;
  }

  // Handle checkbox changes
  onTopicChange(topicId: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentTopics = this.topicsControl.value as string[] || [];
    let updatedTopics: string[];

    if (isChecked) {
      updatedTopics = [...currentTopics, topicId];
    } else {
      updatedTopics = currentTopics.filter((id) => id !== topicId);
    }

    this.topicsControl.setValue(updatedTopics);
    this.topicsControl.markAsTouched();
    console.log('Updated topics:', updatedTopics);
  }

  debugForm(): void {
    console.log('Form valid:', this.bookForm.valid);
    console.log('Form value:', this.bookForm.value);
    console.log('Title errors:', this.titleControl.errors);
    console.log('Author errors:', this.authorControl.errors);
    console.log('Topics errors:', this.topicsControl.errors);
  }
}