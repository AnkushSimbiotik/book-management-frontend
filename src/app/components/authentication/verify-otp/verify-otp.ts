import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-otp',
  imports: [CommonModule, FormsModule , ReactiveFormsModule],
  templateUrl: './verify-otp.html',
})
export class VerifyOtpComponent {
  verifyOtpForm: FormGroup;
  error: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.verifyOtpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  ngOnInit(): void {
    // Optionally pre-fill email from route or local storage
    // Example: this.verifyOtpForm.patchValue({ email: 'user@example.com' });
  }

  onSubmit(): void {
    if (this.verifyOtpForm.valid) {
      this.loading = true;
      this.error = null;
      const dto = this.verifyOtpForm.value;
      this.authService.verifyOtp(dto).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('OTP Verified:', response.message);
          this.router.navigate(['/reset-password']); // Redirect to reset password page
        },
        error: (err) => {
          this.loading = false;
          this.error = err.message || 'An error occurred while verifying OTP';
        },
      });
    }
  }
}