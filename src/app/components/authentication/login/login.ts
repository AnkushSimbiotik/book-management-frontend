import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { noLeadingSpaceValidator } from '../../../common/custom-validatiors/no-leading-space.validator';
import { NoLeadingSpaceDirective } from '../../../common/custom-directives/no-leading-space.directive';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NoLeadingSpaceDirective],
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, noLeadingSpaceValidator()]],
      password: ['', [Validators.required, Validators.minLength(8), noLeadingSpaceValidator()]],
    });
  }

  // CHANGE: Added getters for form controls
  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.authService.signIn(credentials).subscribe({
        next: (response) => {
          console.log('Login Response:', response); 
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
            if (isAuthenticated) {
              this.router.navigate(['/dashboard']).then(() => {
                console.log('Navigated to dashboard');
              }).catch(err => {
                console.error('Navigation failed:', err);
              });
            }
          });
          this.error = null;
        },
        error: (err) => {
          console.error('Login Error:', err); 
          this.error = err.error?.message || 'Invalid email or password';
        }
      });
    }
  }
}