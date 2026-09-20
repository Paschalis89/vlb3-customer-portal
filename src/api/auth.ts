import { appConfig } from '../config/app';
import { demoLogin, demoLogout } from '../demo/auth';
import type { AuthUser, LoginCredentials, LoginResult } from '../types/auth';
import { apiRequest } from './client';

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  if (appConfig.demoMode) {
    return demoLogin(credentials);
  }

  return apiRequest<LoginResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function logout(): Promise<void> {
  if (appConfig.demoMode) {
    return demoLogout();
  }

  await apiRequest<void>('/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser(): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/me');
}
