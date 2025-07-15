import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-email',
  imports : [CommonModule , FormsModule],
  templateUrl: './verify-email.html',
})
export class VerifyEmailComponent implements OnInit {
  email: string = '';
  token: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (this.token) {
      this.onVerify();
    }
  }

  onVerify() {
    if (this.token) {
      this.authService.verifyEmail(this.token).subscribe({
        next: (response) => {
          // Handle success (e.g., navigate to login)
        },
        error: (error) => {
          // Error handled in AuthService
        },
      });
    }
  }

  resendVerification() {
    this.authService.requestPasswordReset(this.email).subscribe(); // Reuse for resending verification
  }
}