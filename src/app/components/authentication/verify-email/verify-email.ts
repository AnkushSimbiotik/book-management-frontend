import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  providers: [AuthService],
  templateUrl: './verify-email.html',
})
export class VerifyEmailComponent implements OnInit {
  loading: boolean = true;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: (response) => {
          this.success = response.message;
          this.error = null;
          this.loading = false;
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Verification failed';
          this.success = null;
          this.loading = false;
        }
      });
    } else {
      this.error = 'No token provided';
      this.loading = false;
    }
  }
}
