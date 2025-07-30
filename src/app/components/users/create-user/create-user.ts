import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { NoLeadingSpaceDirective } from '../../../common/custom-directives/no-leading-space.directive';
import { noLeadingSpaceValidator } from '../../../common/custom-validatiors/no-leading-space.validator';
import { Users } from '../users.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NoLeadingSpaceDirective,
    RouterModule,
  ],
  templateUrl: './create-user.html',
  styleUrls: ['./create-user.scss'],
})
export class CreateUserComponent implements OnInit {
  createForm: FormGroup;
  error: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: Users,
    public router: Router
  ) {
    this.createForm = this.fb.group({
      username: ['', [Validators.required, noLeadingSpaceValidator()]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.createForm.invalid) return;
    this.loading = true;
    this.error = null;
    this.userService.createUser(this.createForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/users']);
      },
      error: (err: any) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  get usernameControl() {
    return this.createForm.get('username');
  }
  get emailControl() {
    return this.createForm.get('email');
  }
  get passwordControl() {
    return this.createForm.get('password');
  }
}
