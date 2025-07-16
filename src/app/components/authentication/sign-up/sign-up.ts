import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.html', // Corrected to match the file name
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
})
export class SignupComponent {
  user: User = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    console.log('Form data:', JSON.stringify(this.user));
    if (
      !this.user.email ||
      !this.user.username ||
      !this.user.password ||
      !this.user.confirmPassword
    ) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const payload = {
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,
      confirmPassword: this.user.confirmPassword,
      role: this.user.role.toLowerCase() 
    };
    console.log('Sending payload:', JSON.stringify(payload));
    try {
      await this.authService.register(payload);
      this.errorMessage = '';
    } catch (error: any) {
      this.errorMessage =
        error.message || 'Registration failed. Please try again.';
      console.error('Signup error:', error);
    }
  }
}
