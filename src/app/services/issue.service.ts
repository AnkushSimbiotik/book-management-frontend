import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  constructor(private http: HttpClient) {}

  issueBook(issue: Issue): Observable<Issue> {
    return of(issue); 
  }

  returnBook(issue: Issue): Observable<Issue> {
    return of(issue); 
  }
}
