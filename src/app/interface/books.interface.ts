import { Topic } from "./topics.interface";

export interface CreateBookDto {
  title: string;
  author: string;
  topics: string[];
}

export interface UpdateBookDto extends Partial<CreateBookDto> {}

export interface Book {
id: any;
  _id: string;
  title: string;
  author: string;
  topics: Topic[];
  totalStock: number;
  availableStock: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedBooks {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  data: Book[];
}

export interface PaginationQuery {
  offset?: number;
  limit?: number;
  sort?: string;
  search?: string;
}