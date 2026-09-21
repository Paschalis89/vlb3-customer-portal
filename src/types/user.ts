import type { CustomerRole } from './auth';

export type CustomerUserStatus = 'ACTIVE' | 'INVITED' | 'DISABLED';

export type AssignableCustomerRole = Exclude<CustomerRole, 'CUSTOMER_OWNER'>;

export interface CustomerUser {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: CustomerRole;
  status: CustomerUserStatus;
  createdAt: string;
  updatedAt: string;
  invitedAt?: string;
  lastLoginAt?: string;
}

export interface CustomerUsersData {
  users: CustomerUser[];
  generatedAt: string;
}

export interface InviteCustomerUserInput {
  firstName: string;
  lastName: string;
  email: string;
  role: AssignableCustomerRole;
}

export interface UpdateCustomerUserInput {
  firstName: string;
  lastName: string;
  role: AssignableCustomerRole;
}

export interface SetCustomerUserStatusInput {
  status: Extract<CustomerUserStatus, 'ACTIVE' | 'DISABLED'>;
}
