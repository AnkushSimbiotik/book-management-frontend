
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONSTANTS } from '../../core/constants/api.constants';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, RequestPasswordResetDto, ResetPasswordDto, SignInDto, SignUpInterface, UpdatePasswordDto, VerifyResetOtpDto } from '../../interface/authenticationInterface/auth.interface';


@Injectable({ providedIn: 'root' }) 
export class AuthService {
  private http = inject(HttpClient);
  private headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('accessToken'));
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  setAuthenticated(value: boolean) {
    this.isAuthenticatedSubject.next(value);
  }

  signUp(dto: SignUpInterface): Observable<any> {
    return this.http.post<any>(API_CONSTANTS.AUTH.SIGN_UP, dto, { headers: this.headers });
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get<any>(`${API_CONSTANTS.AUTH.VERIFY_EMAIL}?token=${token}`, { headers: this.headers });
  }

  signIn(dto: SignInDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_CONSTANTS.AUTH.LOGIN, dto, { headers: this.headers }).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.isAuthenticatedSubject.next(true);
      })
    );
    
  }

  forgetPassword(dto: RequestPasswordResetDto): Observable<any> {
    return this.http.post<any>(API_CONSTANTS.AUTH.FORGET_PASSWORD, dto, { headers: this.headers }, );
  }

  verifyOtp(dto: VerifyResetOtpDto): Observable<any> {
    return this.http.post<any>(API_CONSTANTS.AUTH.VERIFY_OTP, dto, { headers: this.headers });
  }

  resetPassword(dto: ResetPasswordDto): Observable<any> {
    return this.http.post<any>(API_CONSTANTS.AUTH.RESET_PASSWORD, dto, { headers: this.headers });
  }

  updatePassword(id: string, dto: UpdatePasswordDto): Observable<any> {
    return this.http.patch<any>(API_CONSTANTS.AUTH.UPDATE_PASSWORD(id), dto, { headers: this.headers });
  }

  logout(): Observable<any> {
    return this.http.post(API_CONSTANTS.AUTH.LOGOUT, {}, {
      headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('accessToken')}` })
    }).pipe(
      tap(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.isAuthenticatedSubject.next(false);
      })
    );
  }

  private getUserIdFromToken(): string | null {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Simplified token parsing (use jwt-decode in production)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
