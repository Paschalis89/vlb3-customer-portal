import { LoaderCircle } from 'lucide-react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function GuestOnlyRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <main className="auth-loading-page" aria-live="polite">
        <LoaderCircle className="spin" size={28} />
        <span>Caricamento...</span>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
