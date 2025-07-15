import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports : [CommonModule , FormsModule],
  templateUrl: './reset-password.html',
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';
  }

  onSubmit() {
    this.authService.resetPassword(this.email, this.newPassword, this.confirmPassword).subscribe();
  }
}