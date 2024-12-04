export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'doctor';
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  displayName: string;
}
