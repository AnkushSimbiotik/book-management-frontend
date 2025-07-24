import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import {  SignUpInterface } from '../../../interface/authenticationInterface/auth.interface';
import { NoLeadingSpaceDirective } from '../../../common/custom-directives/no-leading-space.directive';
import { noLeadingSpaceValidator } from '../../../common/custom-validatiors/no-leading-space.validator';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink , NoLeadingSpaceDirective],
  providers: [AuthService],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required , noLeadingSpaceValidator()]],
      email: ['', [Validators.required, Validators.email , noLeadingSpaceValidator()]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8) , noLeadingSpaceValidator()]],
      confirmPassword: ['',[ Validators.required , Validators.minLength(8) , noLeadingSpaceValidator()]],
    });
  }

  get emailControl() : FormControl {
    return this.signUpForm.get('email') as FormControl
  }
  get userNameControl() : FormControl {
    return this.signUpForm.get('username') as FormControl
  }
  get passwordControl() : FormControl {
    return this.signUpForm.get('password') as FormControl
  }
  get confirmPasswordControl() : FormControl {
    return this.signUpForm.get('confirmPassword') as FormControl
  }


  onSubmit(e : SubmitEvent): void {
    e.preventDefault()
    if (this.signUpForm.valid) {
      const dto: SignUpInterface = this.signUpForm.value;
      console.log(dto);
      this.authService.signUp(dto).subscribe({
        next: (response) => {
          this.success = response.message;
          this.error = null;
          setTimeout(() => this.router.navigate(['/verify-email']), 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Sign up failed';
          this.success = null;
        }
      });
    }
  }
}
