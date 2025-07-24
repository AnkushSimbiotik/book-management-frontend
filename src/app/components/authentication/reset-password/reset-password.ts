import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ResetPasswordDto } from '../../../interface/authenticationInterface/auth.interface';
import { NoLeadingSpaceDirective } from '../../../common/custom-directives/no-leading-space.directive';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink , NoLeadingSpaceDirective],
  providers: [AuthService],
  templateUrl: './reset-password.html',
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      const dto: ResetPasswordDto = this.resetForm.value;
      this.authService.resetPassword(dto).subscribe({
        next: (response) => {
          this.success = response.message;
          this.error = null;
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Password reset failed';
          this.success = null;
        },
      });
    }
  }
}
