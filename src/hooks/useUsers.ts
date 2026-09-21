import { useCallback, useEffect, useState } from 'react';
import {
  getCustomerUsers,
  inviteCustomerUser,
  setCustomerUserStatus,
  updateCustomerUser,
} from '../api/users';
import type { AuthUser } from '../types/auth';
import type {
  CustomerUser,
  CustomerUsersData,
  InviteCustomerUserInput,
  SetCustomerUserStatusInput,
  UpdateCustomerUserInput,
} from '../types/user';

interface UseUsersResult {
  data: CustomerUsersData | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  mutatingUserId: string | null;
  isInviting: boolean;
  refresh: () => Promise<void>;
  invite: (input: InviteCustomerUserInput) => Promise<CustomerUser>;
  update: (userId: string, input: UpdateCustomerUserInput) => Promise<CustomerUser>;
  setStatus: (userId: string, input: SetCustomerUserStatusInput) => Promise<CustomerUser>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Non è stato possibile caricare gli utenti aziendali.';
}

export function useUsers(actor: AuthUser | null): UseUsersResult {
  const [data, setData] = useState<CustomerUsersData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mutatingUserId, setMutatingUserId] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);

  const load = useCallback(
    async (background = false) => {
      if (!actor) {
        setData(null);
        setIsLoading(false);
        return;
      }

      if (background) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        setData(await getCustomerUsers(actor));
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        if (background) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [actor],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load(data !== null);
  }, [data, load]);

  const replaceUser = useCallback((user: CustomerUser) => {
    setData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        generatedAt: new Date().toISOString(),
        users: current.users.map((item) => (item.id === user.id ? user : item)),
      };
    });
  }, []);

  const invite = useCallback(
    async (input: InviteCustomerUserInput) => {
      if (!actor) {
        throw new Error('Sessione non disponibile.');
      }

      setIsInviting(true);
      try {
        const user = await inviteCustomerUser(actor, input);
        setData((current) =>
          current
            ? {
                ...current,
                generatedAt: new Date().toISOString(),
                users: [...current.users, user],
              }
            : current,
        );
        return user;
      } finally {
        setIsInviting(false);
      }
    },
    [actor],
  );

  const update = useCallback(
    async (userId: string, input: UpdateCustomerUserInput) => {
      if (!actor) {
        throw new Error('Sessione non disponibile.');
      }

      setMutatingUserId(userId);
      try {
        const user = await updateCustomerUser(actor, userId, input);
        replaceUser(user);
        return user;
      } finally {
        setMutatingUserId(null);
      }
    },
    [actor, replaceUser],
  );

  const setStatus = useCallback(
    async (userId: string, input: SetCustomerUserStatusInput) => {
      if (!actor) {
        throw new Error('Sessione non disponibile.');
      }

      setMutatingUserId(userId);
      try {
        const user = await setCustomerUserStatus(actor, userId, input);
        replaceUser(user);
        return user;
      } finally {
        setMutatingUserId(null);
      }
    },
    [actor, replaceUser],
  );

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    mutatingUserId,
    isInviting,
    refresh,
    invite,
    update,
    setStatus,
  };
}
