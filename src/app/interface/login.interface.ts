export interface LoginRequest {
    email: string;
    password: string;
    
  }
  
  export interface LoginResponse {
    _id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }
  
 