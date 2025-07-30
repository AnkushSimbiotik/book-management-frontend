import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CustomerInterface } from '../../../interface/customer.interface';
import { Users } from '../users.service';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { noLeadingSpaceValidator } from '../../../common/custom-validatiors/no-leading-space.validator';
import { NoLeadingSpaceDirective } from '../../../common/custom-directives/no-leading-space.directive';
import { PaginationQuery } from '../../../interface/pagination.interface';
import { PaginationComponent } from '../../../common/pagination/pagination';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NoLeadingSpaceDirective,
    PaginationComponent,
    RouterLink,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit, OnDestroy {
  users: CustomerInterface[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  searchQuery = '';
  sort: string = 'name:asc';
  loading: boolean = false;
  error: string | null = null;
  editUserId: string | null = null;
  editForm: FormGroup;
  private destroy$ = new Subject<void>();
  searchControl = new FormControl('', [noLeadingSpaceValidator()]);

  get nameControl(): FormControl {
    return this.editForm.get('name') as FormControl;
  }

  constructor(private usersService: Users, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        noLeadingSpaceValidator(),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        noLeadingSpaceValidator(),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.searchQuery = value ? value.trim() : '';
        this.currentPage = 1;
        this.loadUsers();
      });
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    const pagination: PaginationQuery = {
      offset: this.currentPage,
      limit: this.pageSize,
      sort: this.sort,
      search: this.searchQuery,
    };

    this.usersService.getUsers(pagination).subscribe({
      next: (response) => {
        if (response.content?.data) {
          this.users = response.content.data;
          this.totalPages = response.content.totalPages || 1;
        } else {
          this.users = [];
          this.totalPages = 1;
        }
        this.loading = false;
        if (this.users.length > 0) {
          console.log('First user structure:', this.users[0]);
        }
      },
      error: (err) => {
        this.error = err.message;
        this.users = [];
        this.loading = false;
      },
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchControl.setValue('');
    this.loadUsers();
    this.currentPage = 1;
  }

  onSort(): void {
    this.sort = this.sort === 'name:asc' ? 'name:desc' : 'name:asc';
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  startEdit(user: CustomerInterface): void {
    this.editUserId = user.id;
    this.editForm.patchValue({
      name: user.name,
      email: user.email,
    });
  }

  cancelEdit(): void {
    this.editUserId = null;
    this.editForm.reset();
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.editUserId) return;

    this.usersService
      .updateUser(this.editUserId, this.editForm.value)
      .subscribe({
        next: (response) => {
          if (response.data) {
            const idx = this.users.findIndex(
              (user) => user.id === this.editUserId
            );
            if (idx !== -1) {
              this.users[idx] = response.data;
            }
          }
          this.cancelEdit();
          this.loadUsers();
        },
        error: (err) => {
          this.error = err.message;
        },
      });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== id);
        },
        error: (err) => {
          this.error = err.message;
        },
      });
    }
  }
}
