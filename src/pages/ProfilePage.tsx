import { LogOut, Mail, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { customerRoleLabels } from '../auth/permissions';
import { PageHeader } from '../components/ui/PageHeader';
import { brandingConfig } from '../config/branding';
import { useAuth } from '../hooks/useAuth';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, isSubmitting } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Account"
        title="Profilo"
        description="Informazioni personali e impostazioni dell'account."
      />

      <div className="profile-grid">
        <article className="content-card">
          <span className="content-card__label">Account cliente</span>
          <h2>{user ? `${user.firstName} ${user.lastName}` : 'Utente'}</h2>
          <div className="detail-list">
            <div>
              <span>Email</span>
              <strong>{user?.email ?? '-'}</strong>
            </div>
            <div>
              <span>Azienda</span>
              <strong>{user?.organizationName ?? '-'}</strong>
            </div>
            <div>
              <span>Ruolo</span>
              <strong>{user ? customerRoleLabels[user.role] : '-'}</strong>
            </div>
          </div>

          <button
            className="button button--secondary profile-logout"
            type="button"
            onClick={() => void handleLogout()}
            disabled={isSubmitting}
          >
            <LogOut size={18} />
            {isSubmitting ? 'Uscita...' : 'Esci'}
          </button>
        </article>

        <article className="content-card">
          <span className="content-card__label">Supporto</span>
          <h2>Hai bisogno di aiuto?</h2>
          <div className="support-row">
            <Mail size={19} />
            <span>{brandingConfig.supportEmail}</span>
          </div>
          <div className="support-row">
            <ShieldCheck size={19} />
            <span>Accesso protetto e permessi separati per ruolo cliente</span>
          </div>
        </article>
      </div>
    </div>
  );
}
