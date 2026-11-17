export interface CurrentUser {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
  createdAt?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
}

export interface AuthContextValue {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (credentials: LoginCredentials) => Promise<CurrentUser>;
  signOut: () => void;
}
