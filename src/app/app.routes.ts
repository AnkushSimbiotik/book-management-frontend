import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { TopicsListComponent } from './components/topics/topic-list/topic-list';
import { CreateTopicComponent } from './components/topics/topic-create/topic-create';
import { ViewTopicComponent } from './components/topics/view-topic/view-topic';
import { SignUpComponent } from './components/authentication/sign-up/sign-up';
import { LoginComponent } from './components/authentication/login/login';
import { VerifyEmailComponent } from './components/authentication/verify-email/verify-email';
import { ForgetPasswordComponent } from './components/authentication/forget-password/forgetPassword';
import { VerifyOtpComponent } from './components/authentication/verify-otp/verify-otp';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password';
import { AuthGuard } from './common/guard/auth.guard';
import { BooksListComponent } from './components/books/book-list/book-list';
import { CreateBookComponent } from './components/books/book-create/book-create';
import { ViewBookComponent } from './components/books/view-books/view-books';
import { EditBookComponent } from './components/books/edit-books/edit-books';
import { EditTopicComponent } from './components/topics/edit-topic/edit-topic';
import { BookIssueComponent } from './components/book-issue-and-return/book-issue/book-issue';
import { BookReturnComponent } from './components/book-issue-and-return/book-return/book-return';
import { IssuedBooksListComponent } from './components/book-issue-and-return/issued-books-list/issued-books-list';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'books', component: BooksListComponent, canActivate: [AuthGuard] },
  {
    path: 'books/create',
    component: CreateBookComponent,
    canActivate: [AuthGuard],
  },
  { path: 'books/:id', component: ViewBookComponent, canActivate: [AuthGuard] },
  {
    path: 'books/:id/edit',
    component: EditBookComponent,
    canActivate: [AuthGuard],
  },
  { path: 'topics', component: TopicsListComponent, canActivate: [AuthGuard] },
  {
    path: 'topics/create',
    component: CreateTopicComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'topics/:id',
    component: ViewTopicComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'topics/:id/edit',
    component: EditTopicComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'book-issue',
    component: BookIssueComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'book-return',
    component: BookReturnComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'issued-books',
    component: IssuedBooksListComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
