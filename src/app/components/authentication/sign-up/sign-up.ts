import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { SignUpDto } from '../../../interface/authenticationInterface/auth.interface';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  providers: [AuthService],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const dto: SignUpDto = this.signUpForm.value;
      this.authService.signUp(dto).subscribe({
        next: (response) => {
          this.success = response.message;
          this.error = null;
          setTimeout(() => this.router.navigate(['/verify-email']), 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Sign up failed';
          this.success = null;
        }
      });
    }
  }
}
