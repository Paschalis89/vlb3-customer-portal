export type CustomerRole =
  | 'CUSTOMER_OWNER'
  | 'CUSTOMER_ADMIN'
  | 'CUSTOMER_OPERATOR'
  | 'CUSTOMER_VIEWER';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: CustomerRole;
  organizationId: string;
  organizationName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  user: AuthUser;
}
