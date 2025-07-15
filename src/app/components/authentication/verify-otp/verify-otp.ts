import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-otp',
  imports : [CommonModule , FormsModule],
  templateUrl: './verify-otp.html',
})
export class VerifyOtpComponent implements OnInit {
  email: string = '';
  otp: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';
  }

  onSubmit() {
    this.authService.verifyOtp(this.email, this.otp).subscribe({
      next: () => {
        this.router.navigate(['/reset-password'], { queryParams: { email: this.email } });
      },
    });
  }
}