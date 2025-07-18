import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [AuthService],
  templateUrl: './nav.html',
  styleUrls: ['./nav.scss']
})

export class NavComponent {
  constructor(public authService: AuthService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.authService.setAuthenticated(false);
        window.location.href = '/login';
      },
      error: (err) => {
        console.error('Logout Error:', err);
      }
    });
  }
}
