export interface CreateTopicDto {
  genre: string;
  description: string;
}

export interface UpdateTopicDto extends Partial<CreateTopicDto> {}

export interface Topic {
  id: string;
  _id?: string; // MongoDB ObjectId format
  genre: string;
  description: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedTopics {
  data: Topic[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginationQuery {
  offset?: number;
  limit?: number;
  sort?: string;
  search?: string;
}
