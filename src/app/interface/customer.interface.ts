export interface CustomerInterface {
  id: string;
  _id: string;
  name: string;
  email: string;
  phone: number;
  identificationType: 'Aadhar' | 'Pan' | 'VoterId' | 'Passport';
  identificationNumber: string;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedCustomers<T> {
  data: T[];
  offset: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CustomerResponse {
  statusCode: number;
  message: string;
  data?: CustomerInterface;
  content?: PaginatedCustomers<CustomerInterface>;
}
