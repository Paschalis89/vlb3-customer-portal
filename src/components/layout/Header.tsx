import { CircleUserRound, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import { brandingConfig } from '../../config/branding';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar__mobile-brand">
        <strong>{brandingConfig.shortName}</strong>
        <span>Remote</span>
      </div>

      <div className="topbar__status" aria-label="Stato piattaforma">
        <Wifi size={17} />
        <span>Portale operativo</span>
      </div>

      <Link className="topbar__profile" to="/profile" aria-label="Apri profilo">
        <div className="topbar__profile-copy">
          <strong>{user ? `${user.firstName} ${user.lastName}` : 'Utente'}</strong>
          <span>{user?.organizationName ?? 'Organizzazione'}</span>
        </div>
        <CircleUserRound size={30} />
      </Link>
    </header>
  );
}
