import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest, setApiAccessToken } from '@/shared/api';
import type { AuthContextValue, CurrentUser, LoginCredentials, LoginResponse } from './types';

const SessionContext = createContext<AuthContextValue | null>(null);

function normalizeCurrentUser(value: CurrentUser): CurrentUser {
  if (!value || typeof value.id !== 'string' || typeof value.email !== 'string') {
    throw new Error('API returned an invalid current-user response.');
  }

  return {
    id: value.id,
    email: value.email,
    displayName: typeof value.displayName === 'string' ? value.displayName : value.email,
    roles: Array.isArray(value.roles)
      ? value.roles.filter((role): role is string => typeof role === 'string')
      : [],
    createdAt: value.createdAt ?? null,
  };
}

export function SessionProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<CurrentUser | null>(null);

  const signOut = useCallback(() => {
    setApiAccessToken(null);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    const handleUnauthorized = () => signOut();
    window.addEventListener('helpdesk:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('helpdesk:unauthorized', handleUnauthorized);
  }, [signOut]);

  const signIn = useCallback(
    async (credentials: LoginCredentials) => {
      queryClient.clear();
      setApiAccessToken(null);
      setUser(null);

      const response = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: credentials,
      });

      if (typeof response.token !== 'string' || response.token.length === 0) {
        throw new Error('API login response does not contain an access token.');
      }

      setApiAccessToken(response.token);
      try {
        const currentUser = normalizeCurrentUser(await apiRequest<CurrentUser>('/me'));
        setUser(currentUser);
        return currentUser;
      } catch (error) {
        setApiAccessToken(null);
        setUser(null);
        throw error;
      }
    },
    [queryClient],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.roles.includes('ROLE_ADMIN') ?? false,
      signIn,
      signOut,
    }),
    [user, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): AuthContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider.');
  }
  return context;
}
