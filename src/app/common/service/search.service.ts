import { FormControl } from '@angular/forms';
import { Injectable, OnDestroy } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService implements OnDestroy {
  private searchControl: FormControl = new FormControl('');
  private destroy$ = new Subject<void>();
  private searchQuerySubject = new Subject<string>();

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((value: string) => value.trimStart()),
        takeUntil(this.destroy$)
      )
      .subscribe((value: string) => {
        this.searchQuerySubject.next(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSearchControl(): FormControl {
    return this.searchControl;
  }

  getSearchQuery(): Observable<string> {
    return this.searchQuerySubject.asObservable();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
}
