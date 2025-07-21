export const API_CONSTANTS = {
  AUTH: {
    SIGN_UP: 'api/authentication/sign-up',
    VERIFY_EMAIL: 'api/authentication/verify',
    LOGIN: 'api/authentication/login',
    REFRESH_TOKENS: 'api/authentication/refresh-tokens',
    UPDATE_PASSWORD: (id: string) => `api/authentication/${id}/updatePassword`,
    FORGET_PASSWORD: 'api/authentication/forgetPassword',
    VERIFY_OTP: 'api/authentication/verify-otp',
    RESET_PASSWORD: 'api/authentication/reset-password',
    LOGOUT: 'api/authentication/logout',
  },
  DASHBOARD: {
    STATS_BOOK: 'api/stats/total-books',
    STATS_TOPIC: 'api/stats/total-topics',
    TOPIC: 'api/topics',
    BOOK: 'api/books',
  },
  BOOKS: {
    BASE: 'api/books',
    BY_ID: (_id: string) => `api/books/${_id}`,
  },
  TOPICS: {
    BASE: 'api/topics',
    BY_ID: (_id: string) => `api/topics/${_id}`,
  },
  BOOK_ISSUES: {
    BASE: 'api/book-issue',
    ISSUE: 'api/book-issue/issue',
    RETURN: 'api/book-issue/return',
    BY_USER: (userId: string) => `api/book-issue/user/${userId}`,
  },
};
