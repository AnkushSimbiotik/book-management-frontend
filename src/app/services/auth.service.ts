import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';

export interface User {
  id?: string;
  email: string;
  username: string;
  password: string;
  role: string,
  confirmPassword?: string; 
  isVerified?: boolean;
  status?: string;
  imageURL?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/authentication`;
  constructor(
    private http: HttpClient = inject(HttpClient),
    public router: Router = inject(Router),
    private toastr: ToastrService = inject(ToastrService)
  ) {}

  async register(user: User) {
    try {
      console.log('Sending payload:', JSON.stringify(user));
      const result = await this.http
        .post(`${this.apiUrl}/sign-up`, user)
        .pipe(
          tap((response) => {
            console.log('Server response:', response);
            this.toastr.success('Registration successful! Please log in.');
          }),
          catchError((error: HttpErrorResponse) => {
            console.error('Registration error:', {
              status: error.status,
              statusText: error.statusText,
              error: error.error,
              message: error.message,
              fullError: JSON.stringify(error.error, null, 2)
            });
            this.toastr.error(error.error?.message || 'Registration failed');
            return throwError(() => new Error(error.error?.message || 'Registration failed'));
          })
        )
        .toPromise();
      if (result) {
        this.toastr.success(JSON.stringify(result), 'Registration Success');
        await this.router.navigate(['/verify-email'], {
          queryParams: { email: user.email },
        });
        return result;
      }
      throw new Error('No result from server');
    } catch (error: any) {
      console.error('Caught error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await this.http
        .post<{
          id: string;
          email: string;
          accessToken: string;
          refreshToken: string;
        }>(`${this.apiUrl}/login`, { email, password })
        .pipe(
          tap((response) => {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            this.toastr.success('Login successful!');
          }),
          catchError((error) => {
            console.error('Login error:', error);
            this.toastr.error(error.error?.message || 'Login failed');
            return throwError(() => error);
          })
        )
        .toPromise();

      if (response) {
        const user: User = {
          id: response.id,
          email: response.email,
          username: '',
          password: '',
          role: 'customer' ,
          isVerified: true,
          status: 'active',
          imageURL: 'https://via.placeholder.com/150',
        };
        this.setUserToLocalStorage(
          user,
          response.accessToken,
          response.refreshToken
        );
        this.toastr.success('Login Successful');
        this.router.navigate(['']);
        return user;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this.toastr.error(
        error.error?.message || 'Email or password is incorrect',
        'Error'
      );
      throw error;
    }
  }

 verifyEmail(token: string): Observable<any> {
    console.log('Verifying email with token:', token);
    return this.http.get(`${this.apiUrl}/verify`, { params: { token }, responseType: 'json' }).pipe(
      tap((response) => {
        console.log('Verification response:', response);
        this.toastr.success('Email verified successfully!');
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Verification error:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message,
          fullError: JSON.stringify(error.error, null, 2),
        });
        const errorMessage = error.error?.message || 'Email verification failed';
        this.toastr.error(errorMessage, 'Verification Error');
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/forgetPassword`, { email })
      .pipe(
        map((response) => {
          this.toastr.success(response.message, 'Success');
          return response;
        }),
        catchError((error) => {
          this.toastr.error(
            error.error?.message || 'Failed to send OTP',
            'Error'
          );
          return throwError(() => error);
        })
      );
  }

  verifyOtp(email: string, otp: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/verify-otp`, { email, otp })
      .pipe(
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

  resetPassword(
    email: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/reset-password`, {
        email,
        newPassword,
        confirmPassword,
      })
      .pipe(
        map((response) => {
          this.toastr.success(response.message, 'Success');
          this.router.navigate(['/login']);
          return response;
        }),
        catchError((error) => {
          this.toastr.error(
            error.error?.message || 'Password reset failed',
            'Error'
          );
          return throwError(() => error);
        })
      );
  }

  refreshTokens(
    refreshToken: string
  ): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http
      .post<{ accessToken: string; refreshToken: string }>(
        `${this.apiUrl}/refresh-tokens`,
        { refreshToken }
      )
      .pipe(
        map((response) => {
          const user = this.loggedInStatus;
          if (user) {
            this.setUserToLocalStorage(
              user,
              response.accessToken,
              response.refreshToken
            );
          }
          return response;
        }),
        catchError((error) => {
          this.toastr.error(
            error.error?.message || 'Token refresh failed',
            'Error'
          );
          return throwError(() => error);
        })
      );
  }

  setUserToLocalStorage(
    user: User,
    accessToken?: string,
    refreshToken?: string
  ) {
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
