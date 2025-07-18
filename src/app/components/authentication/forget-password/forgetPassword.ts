import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { RequestPasswordResetDto } from '../../../interface/authenticationInterface/auth.interface';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , RouterLink],
  providers: [AuthService],
  templateUrl: './forgetPassword.html',
})
export class ForgetPasswordComponent {
  forgetForm: FormGroup;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgetForm.valid) {
      const dto: RequestPasswordResetDto = this.forgetForm.value;
      this.authService.forgetPassword(dto).subscribe({
        next: (response) => {
          this.success = response.message;
          this.error = null;
          setTimeout(() => this.router.navigate(['/verify-otp']), 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to send OTP';
          this.success = null;
        }
      });
    }
  }
}
