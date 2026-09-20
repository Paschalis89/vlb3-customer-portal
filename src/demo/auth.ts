import type { AuthUser, LoginCredentials, LoginResult } from '../types/auth';

const DEMO_PASSWORD = 'Demo123!';

export const DEMO_LOGIN = {
  email: 'owner@demo.vlb3.local',
  password: DEMO_PASSWORD,
} as const;

export const DEMO_ACCOUNTS: ReadonlyArray<{ user: AuthUser; password: string }> = [
  {
    user: {
      id: 'demo-user-owner',
      email: 'owner@demo.vlb3.local',
      firstName: 'Mario',
      lastName: 'Rossi',
      role: 'CUSTOMER_OWNER',
      organizationId: 'demo-organization',
      organizationName: 'Azienda Agricola Demo',
    },
    password: DEMO_PASSWORD,
  },
  {
    user: {
      id: 'demo-user-admin',
      email: 'admin@demo.vlb3.local',
      firstName: 'Anna',
      lastName: 'Bianchi',
      role: 'CUSTOMER_ADMIN',
      organizationId: 'demo-organization',
      organizationName: 'Azienda Agricola Demo',
    },
    password: DEMO_PASSWORD,
  },
  {
    user: {
      id: 'demo-user-operator',
      email: 'operator@demo.vlb3.local',
      firstName: 'Luca',
      lastName: 'Verdi',
      role: 'CUSTOMER_OPERATOR',
      organizationId: 'demo-organization',
      organizationName: 'Azienda Agricola Demo',
    },
    password: DEMO_PASSWORD,
  },
  {
    user: {
      id: 'demo-user-viewer',
      email: 'viewer@demo.vlb3.local',
      firstName: 'Giulia',
      lastName: 'Neri',
      role: 'CUSTOMER_VIEWER',
      organizationId: 'demo-organization',
      organizationName: 'Azienda Agricola Demo',
    },
    password: DEMO_PASSWORD,
  },
] as const;

const DEMO_DELAY_MS = 450;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function demoLogin(credentials: LoginCredentials): Promise<LoginResult> {
  await wait(DEMO_DELAY_MS);

  const email = credentials.email.trim().toLowerCase();
  const account = DEMO_ACCOUNTS.find(
    (candidate) => candidate.user.email === email && candidate.password === credentials.password,
  );

  if (!account) {
    throw new Error('Email o password non corretti.');
  }

  return { user: account.user };
}

export async function demoLogout(): Promise<void> {
  await wait(180);
}
