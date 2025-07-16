import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  
  imports: [FormsModule, RouterModule, CommonModule ],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService , router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.authService.login(this.email, this.password).then(() => {
      this.errorMessage = ''; // Clear any previous error
      this.authService.router.navigate(['/dashboard']);
    }).catch((error) => {
      this.errorMessage = 'Invalid email or password';
      console.error('Login error:', error);
    });
  }
}