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

export const routes: Routes = [
    
    { path: '', component: DashboardComponent },
  { path: 'books', component: BookListComponent },
  { path: 'books/create', component: BookCreateComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: 'topics', component: TopicListComponent },
  { path: 'topics/create', component: TopicCreateComponent },
  { path: 'topics/:id', component: TopicDetailComponent },
  { path: 'issue', component: BookIssueComponent },
  { path: 'return', component: BookReturnComponent }
];
