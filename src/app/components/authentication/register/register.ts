import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports : [FormsModule , CommonModule , RouterLink],
  templateUrl: './register.html',
})
export class SignupComponent {
  user: User = {
    email: '',
    username: '',
    password: '',
    role: 'Customer',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.user).then(() => {
    });
  }
}