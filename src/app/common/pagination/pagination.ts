// src/app/common/pagination/pagination.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  getPages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 3; // Show current page and next 2 pages
    const startPage = Math.max(1, this.currentPage);
    const endPage = Math.min(
      this.totalPages,
      this.currentPage + maxPagesToShow - 1
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
  }
}
