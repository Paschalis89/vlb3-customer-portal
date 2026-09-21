import type { AuthUser } from '../types/auth';

export const DEMO_SESSION_KEY = 'vlb3-customer-portal.demo-session';

export function readDemoSession(): AuthUser | null {
  const stored = window.localStorage.getItem(DEMO_SESSION_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
    return null;
  }
}

export function writeDemoSession(user: AuthUser): void {
  window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
}

export function clearDemoSession(): void {
  window.localStorage.removeItem(DEMO_SESSION_KEY);
}
