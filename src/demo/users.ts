import { hasPermission } from '../auth/permissions';
import {
  isAssignableCustomerRole,
  isValidEmail,
  normalizeCustomerUserEmail,
} from '../lib/users';
import type { AuthUser } from '../types/auth';
import type {
  CustomerUser,
  CustomerUsersData,
  InviteCustomerUserInput,
  SetCustomerUserStatusInput,
  UpdateCustomerUserInput,
} from '../types/user';

const STORAGE_KEY = 'vlb3-demo-customer-users-v1';
const DEMO_DELAY_MS = 360;

const seedUsers: CustomerUser[] = [
  {
    id: 'demo-user-owner',
    organizationId: 'demo-organization',
    email: 'owner@demo.vlb3.local',
    firstName: 'Mario',
    lastName: 'Rossi',
    role: 'CUSTOMER_OWNER',
    status: 'ACTIVE',
    createdAt: '2026-08-12T08:00:00.000Z',
    updatedAt: '2026-09-20T08:00:00.000Z',
    lastLoginAt: '2026-09-20T07:58:00.000Z',
  },
  {
    id: 'demo-user-admin',
    organizationId: 'demo-organization',
    email: 'admin@demo.vlb3.local',
    firstName: 'Anna',
    lastName: 'Bianchi',
    role: 'CUSTOMER_ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-08-18T09:20:00.000Z',
    updatedAt: '2026-09-18T10:00:00.000Z',
    lastLoginAt: '2026-09-19T14:12:00.000Z',
  },
  {
    id: 'demo-user-operator',
    organizationId: 'demo-organization',
    email: 'operator@demo.vlb3.local',
    firstName: 'Luca',
    lastName: 'Verdi',
    role: 'CUSTOMER_OPERATOR',
    status: 'ACTIVE',
    createdAt: '2026-08-24T07:45:00.000Z',
    updatedAt: '2026-09-17T16:40:00.000Z',
    lastLoginAt: '2026-09-20T16:40:00.000Z',
  },
  {
    id: 'demo-user-viewer',
    organizationId: 'demo-organization',
    email: 'viewer@demo.vlb3.local',
    firstName: 'Giulia',
    lastName: 'Neri',
    role: 'CUSTOMER_VIEWER',
    status: 'ACTIVE',
    createdAt: '2026-09-01T11:30:00.000Z',
    updatedAt: '2026-09-16T12:10:00.000Z',
    lastLoginAt: '2026-09-18T09:05:00.000Z',
  },
];

function wait(ms = DEMO_DELAY_MS): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function cloneUsers(users: CustomerUser[]): CustomerUser[] {
  return users.map((user) => ({ ...user }));
}

function readUsersFromStorage(): CustomerUser[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return cloneUsers(seedUsers);
    }

    const parsed = JSON.parse(stored) as CustomerUser[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return cloneUsers(seedUsers);
    }

    return parsed.map((user) => ({ ...user }));
  } catch {
    return cloneUsers(seedUsers);
  }
}

function writeUsersToStorage(users: CustomerUser[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `demo-user-${crypto.randomUUID()}`;
  }

  return `demo-user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function assertCanReadUsers(actor: AuthUser): void {
  if (!hasPermission(actor.role, 'users.read')) {
    throw new Error('Non hai i permessi per visualizzare gli utenti aziendali.');
  }
}

function assertCanManageUsers(actor: AuthUser): void {
  if (!hasPermission(actor.role, 'users.manage')) {
    throw new Error('Non hai i permessi per gestire gli utenti aziendali.');
  }
}

function findTarget(users: CustomerUser[], actor: AuthUser, userId: string): CustomerUser {
  const target = users.find((user) => user.id === userId);

  if (!target || target.organizationId !== actor.organizationId) {
    throw new Error('Utente non trovato.');
  }

  return target;
}

function assertTargetCanBeManaged(actor: AuthUser, target: CustomerUser): void {
  if (target.role === 'CUSTOMER_OWNER') {
    throw new Error('Il ruolo Owner è protetto e non può essere modificato dal portale.');
  }

  if (target.id === actor.id) {
    throw new Error('Non puoi modificare il tuo account da questa schermata.');
  }
}

function toAuthUser(user: CustomerUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    organizationId: user.organizationId,
    organizationName: 'Azienda Agricola Demo',
  };
}

export function getDemoUserById(userId: string): CustomerUser | null {
  return readUsersFromStorage().find((user) => user.id === userId) ?? null;
}

export function getDemoUserByEmail(email: string): CustomerUser | null {
  const normalizedEmail = normalizeCustomerUserEmail(email);
  return (
    readUsersFromStorage().find(
      (user) => normalizeCustomerUserEmail(user.email) === normalizedEmail,
    ) ?? null
  );
}

export function getDemoAuthUserById(userId: string): AuthUser | null {
  const user = getDemoUserById(userId);

  if (!user || user.status !== 'ACTIVE') {
    return null;
  }

  return toAuthUser(user);
}

export function recordDemoUserLogin(userId: string): AuthUser | null {
  const users = readUsersFromStorage();
  const index = users.findIndex((user) => user.id === userId);
  const currentUser = index >= 0 ? users[index] : undefined;

  if (!currentUser || currentUser.status !== 'ACTIVE') {
    return null;
  }

  const timestamp = new Date().toISOString();
  const updatedUser: CustomerUser = {
    ...currentUser,
    lastLoginAt: timestamp,
    updatedAt: timestamp,
  };
  users[index] = updatedUser;
  writeUsersToStorage(users);

  return toAuthUser(updatedUser);
}

export async function demoGetCustomerUsers(actor: AuthUser): Promise<CustomerUsersData> {
  await wait(240);
  assertCanReadUsers(actor);

  return {
    users: readUsersFromStorage()
      .filter((user) => user.organizationId === actor.organizationId)
      .sort((first, second) => {
        if (first.role === 'CUSTOMER_OWNER') return -1;
        if (second.role === 'CUSTOMER_OWNER') return 1;
        return `${first.firstName} ${first.lastName}`.localeCompare(
          `${second.firstName} ${second.lastName}`,
          'it',
        );
      }),
    generatedAt: new Date().toISOString(),
  };
}

export async function demoInviteCustomerUser(
  actor: AuthUser,
  input: InviteCustomerUserInput,
): Promise<CustomerUser> {
  await wait();
  assertCanManageUsers(actor);

  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = normalizeCustomerUserEmail(input.email);

  if (!firstName || !lastName) {
    throw new Error('Nome e cognome sono obbligatori.');
  }

  if (!isValidEmail(email)) {
    throw new Error('Inserisci un indirizzo email valido.');
  }

  if (!isAssignableCustomerRole(input.role)) {
    throw new Error('Il ruolo selezionato non può essere assegnato.');
  }

  const users = readUsersFromStorage();
  const duplicate = users.some(
    (user) => normalizeCustomerUserEmail(user.email) === email,
  );

  if (duplicate) {
    throw new Error('Esiste già un utente con questo indirizzo email.');
  }

  const timestamp = new Date().toISOString();
  const user: CustomerUser = {
    id: createId(),
    organizationId: actor.organizationId,
    email,
    firstName,
    lastName,
    role: input.role,
    status: 'INVITED',
    createdAt: timestamp,
    updatedAt: timestamp,
    invitedAt: timestamp,
  };

  users.push(user);
  writeUsersToStorage(users);
  return { ...user };
}

export async function demoUpdateCustomerUser(
  actor: AuthUser,
  userId: string,
  input: UpdateCustomerUserInput,
): Promise<CustomerUser> {
  await wait();
  assertCanManageUsers(actor);

  if (!isAssignableCustomerRole(input.role)) {
    throw new Error('Il ruolo Owner non può essere assegnato dal portale.');
  }

  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();

  if (!firstName || !lastName) {
    throw new Error('Nome e cognome sono obbligatori.');
  }

  const users = readUsersFromStorage();
  const target = findTarget(users, actor, userId);
  assertTargetCanBeManaged(actor, target);

  const index = users.findIndex((user) => user.id === target.id);
  const updated: CustomerUser = {
    ...target,
    firstName,
    lastName,
    role: input.role,
    updatedAt: new Date().toISOString(),
  };

  users[index] = updated;
  writeUsersToStorage(users);
  return { ...updated };
}

export async function demoSetCustomerUserStatus(
  actor: AuthUser,
  userId: string,
  input: SetCustomerUserStatusInput,
): Promise<CustomerUser> {
  await wait();
  assertCanManageUsers(actor);

  const users = readUsersFromStorage();
  const target = findTarget(users, actor, userId);
  assertTargetCanBeManaged(actor, target);

  const index = users.findIndex((user) => user.id === target.id);
  const updated: CustomerUser = {
    ...target,
    status: input.status,
    updatedAt: new Date().toISOString(),
  };

  users[index] = updated;
  writeUsersToStorage(users);
  return { ...updated };
}
