export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: null | {
    id: string;
    email: string;
  };
} 