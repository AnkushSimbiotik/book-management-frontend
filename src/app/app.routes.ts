import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { BookIssueComponent } from './components/book-issue/book-issue';
import { BookReturnComponent } from './components/book-return/book-return';
import { BookListComponent } from './components/books/book-list/book-list';
import { BookCreateComponent } from './components/books/book-create/book-create';
import { BookDetailComponent } from './components/books/book-detail/book-detail';
import { TopicListComponent } from './components/topics/topic-list/topic-list';
import { TopicCreateComponent } from './components/topics/topic-create/topic-create';
import { TopicDetailComponent } from './components/topics/topic-detail/topic-detail';
import { SignupComponent } from './components/authentication/sign-up/sign-up';
import { LoginComponent } from './components/authentication/login/login';
import { VerifyEmailComponent } from './components/authentication/verify-email/verify-email';
import { ForgotPasswordComponent } from './components/authentication/forget-password/forgetPassword';
import { VerifyOtpComponent } from './components/authentication/verify-otp/verify-otp';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password';
import { AuthGuard } from './common/guard/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'forget-password', component: ForgotPasswordComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'books', component: BookListComponent , canActivate: [AuthGuard]},
  { path: 'books/create', component: BookCreateComponent , canActivate: [AuthGuard]},
  { path: 'books/:id', component: BookDetailComponent , canActivate: [AuthGuard]},
  { path: 'topics', component: TopicListComponent , canActivate: [AuthGuard]},
  { path: 'topics/create', component: TopicCreateComponent , canActivate: [AuthGuard] },
  { path: 'topics/:id', component: TopicDetailComponent , canActivate: [AuthGuard] },
  { path: 'issue', component: BookIssueComponent , canActivate: [AuthGuard]},
  { path: 'return', component: BookReturnComponent , canActivate: [AuthGuard]},
];
