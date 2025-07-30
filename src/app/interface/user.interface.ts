


export interface UserInterface {
    id: string;
    _id : string;
    username: string;
    email: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface PaginatedUsers<UserInterface>{
    data: UserInterface[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }