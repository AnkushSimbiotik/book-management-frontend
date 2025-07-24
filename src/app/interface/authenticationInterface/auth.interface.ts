export interface SignUpInterface {
    username: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface SignInDto {
    email: string;
    password: string;
  }
  
  export interface RequestPasswordResetDto {
    email: string;
  }
  
  export interface VerifyResetOtpDto {
    email: string;
    otp: string;
  }
  
  export interface ResetPasswordDto {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface UpdatePasswordDto {
    oldPassword: string;
    newPassword: string;
  }
  
  export interface AuthResponse {
    _id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }
  
  export interface PaginationQuery {
    offset?: number;
    limit?: number;
    sort?: string;
    search?: string;
  }