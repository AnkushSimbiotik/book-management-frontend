// src/app/models/issue.model.ts
export interface Issue {
  userId: string;
  bookId: string;
  issueDate?: string;
  returnDate?: string;
}