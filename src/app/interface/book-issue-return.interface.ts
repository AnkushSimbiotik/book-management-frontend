export interface BookIssueDto {
    userId: string;
    bookId: string;
  }
  
  export interface BookIssue {
    _id?: string;
    bookId: string;
    userId: string;
    status: 'Issued' | 'Returned';
    issueDate: Date;
    estimatedReturnDate: Date;
    returnDate?: Date;
  }
  
  export interface PaginatedBookIssues {
    data: BookIssue[];
  }
  
  export interface PaginationQuery {
    offset?: number;
    limit?: number;
    sort?: string;
    search?: string;
  }