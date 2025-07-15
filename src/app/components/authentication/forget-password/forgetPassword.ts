import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgetPassword.html',
  imports : [FormsModule , CommonModule , RouterLink]
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.router.navigate(['/verify-otp'], { queryParams: { email: this.email } });
      },
    });
  }
}