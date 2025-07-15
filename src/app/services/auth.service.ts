import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface User {
  id?: string;
  email: string;
  username: string;
  password: string;
  role?: string;
  isVerified?: boolean;
  status?: string;
  imageURL?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/authentication';
  constructor(
    private http: HttpClient = inject(HttpClient),
    private router: Router = inject(Router),
    private toastr: ToastrService = inject(ToastrService)
  ) {}

  async register(user: User) {
    try {
      const result = await this.http
        .post<{ id: string; username: string; email: string; message: string }>(
          `${this.apiUrl}/sign-up`,
          {
            email: user.email,
            password: user.password,
            username: user.username.trim(),
            role: user.role || 'Customer',
          }
        )
        .toPromise();

      if (result) {
        this.toastr.success(result.message, 'Registration Success');
        this.router.navigate(['/verify-email'], {
          queryParams: { email: user.email },
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 409) {
          this.toastr.error(
            'This email is already registered. Try logging in.',
            'Error'
          );
        } else {
          this.toastr.error(error.error?.message || 'Registration failed', 'Error');
        }
      } else {
        this.toastr.error('An unexpected error occurred', 'Error');
      }
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await this.http
        .post<{ id: string; email: string; accessToken: string; refreshToken: string }>(
          `${this.apiUrl}/login`,
          { email, password }
        )
        .toPromise();

      if (response) {
        const user: User = {
          id: response.id,
          email: response.email,
          username: '',
          password: '',
          role: '',
          isVerified: true,
          status: 'active',
          imageURL: 'https://via.placeholder.com/150',
        };
        this.setUserToLocalStorage(user, response.accessToken, response.refreshToken);
        this.toastr.success('Login Successful');
        this.router.navigate(['']);
        return user;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this.toastr.error(error.error?.message || 'Email or password is incorrect', 'Error');
      throw error;
    }
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/verify`, {
      params: { token },
    }).pipe(
      catchError((error) => {
        this.toastr.error(error.error?.message || 'Email verification failed', 'Error');
        return throwError(() => error);
      })
    );
  }

  requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgetPassword`, { email }).pipe(
      map((response) => {
        this.toastr.success(response.message, 'Success');
        return response;
      }),
      catchError((error) => {
        this.toastr.error(error.error?.message || 'Failed to send OTP', 'Error');
        return throwError(() => error);
      })
    );
  }

  verifyOtp(email: string, otp: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/verify-otp`, { email, otp }).pipe(
      map((response) => {
        this.toastr.success(response.message, 'Success');
        return response;
      }),
      catchError((error) => {
        this.toastr.error(error.error?.message || 'Invalid OTP', 'Error');
        return throwError(() => error);
      })
    );
  }

  resetPassword(email: string, newPassword: string, confirmPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, {
      email,
      newPassword,
      confirmPassword,
    }).pipe(
      map((response) => {
        this.toastr.success(response.message, 'Success');
        this.router.navigate(['/login']);
        return response;
      }),
      catchError((error) => {
        this.toastr.error(error.error?.message || 'Password reset failed', 'Error');
        return throwError(() => error);
      })
    );
  }

  refreshTokens(refreshToken: string): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.apiUrl}/refresh-tokens`,
      { refreshToken }
    ).pipe(
      map((response) => {
        const user = this.loggedInStatus;
        if (user) {
          this.setUserToLocalStorage(user, response.accessToken, response.refreshToken);
        }
        return response;
      }),
      catchError((error) => {
        this.toastr.error(error.error?.message || 'Token refresh failed', 'Error');
        return throwError(() => error);
      })
    );
  }

  setUserToLocalStorage(user: User, accessToken?: string, refreshToken?: string) {
    const userData = { ...user, accessToken, refreshToken };
    localStorage.setItem('user', JSON.stringify(userData));
  }

  get loggedInStatus(): User | false {
    const userString = localStorage.getItem('user');
    if (userString === null) {
      return false;
    } else {
      return JSON.parse(userString);
    }
  }

  logoutFromLocalStorage() {
    localStorage.removeItem('user');
  }

  signOutUser() {
    this.logoutFromLocalStorage();
    this.toastr.success('Logout Successful');
    this.router.navigate(['/login']);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      map((user) => {
        if (user) {
          return user;
        } else {
          throw new Error('No user data found');
        }
      }),
      catchError((error) => {
        this.toastr.error(error.error?.message || 'User not found', 'Error');
        return throwError(() => error);
      })
    );
  }

  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  
}