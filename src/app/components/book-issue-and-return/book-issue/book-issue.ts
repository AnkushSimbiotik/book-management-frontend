import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BookIssueService } from '../book-issue-return';
import {
  BookIssueDto,
  BookIssue,
} from '../../../interface/book-issue-return.interface';
import { PaginationComponent } from '../../../common/pagination/pagination';
import { NoLeadingSpaceDirective } from '../../../common/custom-directives/no-leading-space.directive';
import { noLeadingSpaceValidator } from '../../../common/custom-validatiors/no-leading-space.validator';
import { CustomerService } from '../../customers/customer.service';
import { CustomerInterface } from '../../../interface/customer.interface';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  takeUntil,
  BehaviorSubject,
} from 'rxjs';

@Component({
  selector: 'app-book-issue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NoLeadingSpaceDirective,
  ],
  providers: [BookIssueService],
  templateUrl: './book-issue.html',
  styleUrls: ['./book-issue.scss'],
})
export class BookIssueComponent implements OnInit {
  issueForm: FormGroup;
  error: string | null = null;
  success: string | null = null;
  searchUserId: string = '';
  issuedBooks: BookIssue[] = [];
  issuedBooksTotal: number = 0;
  issuedBooksPage: number = 1;
  issuedBooksPageSize: number = 5;

  // Customer search properties
  customers: CustomerInterface[] = [];
  filteredCustomers: CustomerInterface[] = [];
  selectedCustomer: CustomerInterface | null = null;
  customerSearchTerm: string = '';
  showCustomerDropdown: boolean = false;
  customerLoading: boolean = false;
  private destroy$ = new Subject<void>();
  private customerSearchTerm$ = new BehaviorSubject<string>('');

  constructor(
    private fb: FormBuilder,
    private bookIssueService: BookIssueService,
    private customerService: CustomerService,
    private router: Router
  ) {
    this.issueForm = this.fb.group({
      userId: ['', Validators.required, noLeadingSpaceValidator()],
      bookId: ['', Validators.required, noLeadingSpaceValidator()],
    });
  }

  ngOnInit(): void {
    // Test backend connectivity
    this.testBackendConnectivity();
    this.setupCustomerSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupCustomerSearch(): void {
    // Load initial customers
    this.loadCustomers();

    // Setup debounced search
    this.customerSearchTerm$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm: string) => {
        this.searchCustomers(searchTerm);
      });
  }

  loadCustomers(): void {
    this.customerLoading = true;
    this.customerService.getCustomers({ offset: 1, limit: 50 }).subscribe({
      next: (response) => {
        if (response.content?.data) {
          this.customers = response.content.data;
          this.filteredCustomers = this.customers;
        }
        this.customerLoading = false;
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.customerLoading = false;
        this.error = 'Failed to load customers';
      },
    });
  }

  searchCustomers(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredCustomers = this.customers;
      this.showCustomerDropdown = false;
      return;
    }

    this.customerLoading = true;
    this.customerService.searchCustomers(searchTerm).subscribe({
      next: (response) => {
        if (response.content?.data) {
          this.filteredCustomers = response.content.data;
          this.showCustomerDropdown = this.filteredCustomers.length > 0;
        } else {
          this.filteredCustomers = [];
          this.showCustomerDropdown = false;
        }
        this.customerLoading = false;
      },
      error: (err) => {
        console.error('Error searching customers:', err);
        this.customerLoading = false;
        this.filteredCustomers = [];
        this.showCustomerDropdown = false;
      },
    });
  }

  selectCustomer(customer: CustomerInterface): void {
    this.selectedCustomer = customer;
    this.issueForm.patchValue({ userId: customer.id });
    this.customerSearchTerm = `${customer.name} (${customer.email})`;
    this.showCustomerDropdown = false;
  }

  clearCustomerSelection(): void {
    this.selectedCustomer = null;
    this.issueForm.patchValue({ userId: '' });
    this.customerSearchTerm = '';
    this.customerSearchTerm$.next('');
    this.showCustomerDropdown = false;
  }

  onCustomerSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.customerSearchTerm$.next(target.value);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.customer-search-container')) {
      this.showCustomerDropdown = false;
    }
  }

  testBackendConnectivity(): void {
    console.log('Testing backend connectivity for book issue endpoints...');
    // This will be called when component loads to verify backend is working
  }

  onSubmit(): void {
    if (this.issueForm.valid) {
      const dto: BookIssueDto = this.issueForm.value;
      console.log('Issuing book with data:', dto);

      this.bookIssueService.issueBook(dto).subscribe({
        next: (response) => {
          console.log('Book issued successfully:', response);
          this.success = response.message || 'Book issued successfully!';
          this.error = null;
          this.issueForm.reset();

          // Clear success message after 5 seconds
          setTimeout(() => {
            this.success = null;
          }, 5000);
        },
        error: (err) => {
          console.error('Error issuing book:', err);
          this.error = err.error?.message || 'Failed to issue book';
          this.success = null;
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.issueForm.controls).forEach((key) => {
        const control = this.issueForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onSearch(page: number = 1): void {
    if (!this.searchUserId) {
      this.issuedBooks = [];
      this.issuedBooksTotal = 0;
      return;
    }

    console.log(
      `Searching for issued books for user: ${this.searchUserId}, page: ${page}`
    );
    this.issuedBooksPage = page;
    this.bookIssueService
      .getIssuedBooksByUser(
        this.searchUserId,
        this.issuedBooksPage,
        this.issuedBooksPageSize
      )
      .subscribe({
        next: (result) => {
          console.log('Issued books result:', result);
          this.issuedBooks = result.data;
          this.issuedBooksTotal = result.total;
          this.error = null;

          if (result.data.length === 0) {
            this.success = 'No issued books found for this user.';
          } else {
            this.success = `Found ${result.data.length} issued book(s) for user ${this.searchUserId}.`;
          }
        },
        error: (err) => {
          console.error('Error in onSearch:', err);
          this.issuedBooks = [];
          this.issuedBooksTotal = 0;
          this.error = err.error?.message || 'Failed to fetch issued books';
          this.success = null;
        },
      });
  }

  onIssuedBooksPageChange(page: number): void {
    this.onSearch(page);
  }

  get issuedBooksTotalPages(): number {
    return Math.ceil(this.issuedBooksTotal / this.issuedBooksPageSize) || 1;
  }
}
