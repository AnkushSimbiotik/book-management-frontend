export interface BookIssueDto {
  userId: string;
  bookId: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
}

export interface BookIssue {
  _id?: string;
  bookId: string;
  userId: string;
  status: 'Issued' | 'Returned';
  issueDate: Date;
  estimatedReturnDate: Date;
  returnDate?: Date;
  // Populated fields (when backend populates)
  user?: User;
  book?: Book;
}

export interface PaginatedBookIssues {
  data: BookIssue[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaginationQuery {
  offset?: number;
  limit?: number;
  sort?: string;
  search?: string;
  userId?: string;
  bookId?: string;
  }
