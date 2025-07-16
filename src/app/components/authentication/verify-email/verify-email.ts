// In src/app/components/verify-email/verify-email.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-email.html',
})
export class VerifyEmailComponent implements OnInit {
  email: string = '';
  token: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isVerifying: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.token = this.route.snapshot.queryParams['token'] || '';
    console.log('Query params:', { email: this.email, token: this.token });
  }

  onVerify() {
    if (!this.token) {
      this.errorMessage = 'Please enter a verification token.';
      this.successMessage = '';
      return;
    }
    this.isVerifying = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.verifyEmail(this.token).subscribe({
      next: (response) => {
        console.log('Verification response:', response);
        this.isVerifying = false;
        this.successMessage = JSON.stringify(response) || 'Email verified successfully! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Verification error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
        });
        this.isVerifying = false;
        let errorMsg = 'Email verification failed. Please check the token or contact support.';
        if (error.status === 0) {
          errorMsg = 'Unable to connect to the server. Please check your internet connection or server status.';
        } else if (error.message.includes('Unexpected token')) {
          errorMsg = 'Server error: Received invalid response. Please ensure the server is running and the endpoint is correct.';
        } else if (error.error?.message) {
          errorMsg = error.error.message; // Backend errors like "Invalid or expired token"
        }
        this.errorMessage = errorMsg;
        this.successMessage = '';
      },
    });
  }
}