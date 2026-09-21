import type { LoginCredentials, LoginResult } from '../types/auth';
import { getDemoUserByEmail, recordDemoUserLogin } from './users';

export const DEMO_PASSWORD = 'Demo123!';

export const DEMO_LOGIN = {
  email: 'owner@demo.vlb3.local',
  password: DEMO_PASSWORD,
} as const;

const DEMO_DELAY_MS = 450;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function demoLogin(credentials: LoginCredentials): Promise<LoginResult> {
  await wait(DEMO_DELAY_MS);

  const user = getDemoUserByEmail(credentials.email);

  if (!user || credentials.password !== DEMO_PASSWORD) {
    throw new Error('Email o password non corretti.');
  }

  if (user.status === 'INVITED') {
    throw new Error('L’invito non è stato ancora accettato.');
  }

  if (user.status === 'DISABLED') {
    throw new Error('Questo account è stato disattivato.');
  }

  const authUser = recordDemoUserLogin(user.id);

  if (!authUser) {
    throw new Error('Accesso non disponibile per questo account.');
  }

  return { user: authUser };
}

export async function demoLogout(): Promise<void> {
  await wait(180);
}
