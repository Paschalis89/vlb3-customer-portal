import { appConfig } from '../config/app';
import {
  demoGetCustomerUsers,
  demoInviteCustomerUser,
  demoSetCustomerUserStatus,
  demoUpdateCustomerUser,
} from '../demo/users';
import type { AuthUser } from '../types/auth';
import type {
  CustomerUser,
  CustomerUsersData,
  InviteCustomerUserInput,
  SetCustomerUserStatusInput,
  UpdateCustomerUserInput,
} from '../types/user';
import { apiRequest } from './client';

export async function getCustomerUsers(actor: AuthUser): Promise<CustomerUsersData> {
  if (appConfig.demoMode) {
    return demoGetCustomerUsers(actor);
  }

  return apiRequest<CustomerUsersData>('/customer/users');
}

export async function inviteCustomerUser(
  actor: AuthUser,
  input: InviteCustomerUserInput,
): Promise<CustomerUser> {
  if (appConfig.demoMode) {
    return demoInviteCustomerUser(actor, input);
  }

  return apiRequest<CustomerUser>('/customer/users/invitations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateCustomerUser(
  actor: AuthUser,
  userId: string,
  input: UpdateCustomerUserInput,
): Promise<CustomerUser> {
  if (appConfig.demoMode) {
    return demoUpdateCustomerUser(actor, userId, input);
  }

  return apiRequest<CustomerUser>(`/customer/users/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function setCustomerUserStatus(
  actor: AuthUser,
  userId: string,
  input: SetCustomerUserStatusInput,
): Promise<CustomerUser> {
  if (appConfig.demoMode) {
    return demoSetCustomerUserStatus(actor, userId, input);
  }

  return apiRequest<CustomerUser>(`/customer/users/${encodeURIComponent(userId)}/status`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
