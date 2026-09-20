import { Activity, Bell, Building2, Gauge, Radio, Waves } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { appConfig } from '../config/app';
import { useAuth } from '../hooks/useAuth';

const kpis = [
  { label: 'Impianti', value: '3', icon: Building2 },
  { label: 'Online', value: '2', icon: Radio },
  { label: 'Pompe attive', value: '1', icon: Activity },
  { label: 'Allarmi', value: '0', icon: Bell },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  return hour < 13 ? 'Buongiorno' : 'Buonasera';
}

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={user?.organizationName ?? 'Organizzazione'}
        title={`${getGreeting()}, ${user?.firstName ?? 'utente'}`}
        description="Controlla rapidamente lo stato dei tuoi impianti."
      />

      {appConfig.demoMode ? (
        <div className="demo-banner">
          <Waves size={18} />
          <div>
            <strong>Demo mode attivo</strong>
            <span>I dati mostrati in questo step sono dimostrativi.</span>
          </div>
        </div>
      ) : null}

      <section className="kpi-grid" aria-label="Riepilogo impianti">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <article className="kpi-card" key={kpi.label}>
              <div className="kpi-card__icon">
                <Icon size={20} />
              </div>
              <span>{kpi.label}</span>
              <strong>{kpi.value}</strong>
            </article>
          );
        })}
      </section>

      <section className="section-stack">
        <div className="section-heading">
          <div>
            <span className="section-heading__eyebrow">Panoramica</span>
            <h2>I tuoi impianti</h2>
          </div>
        </div>

        <div className="site-preview-grid">
          <article className="site-preview-card">
            <div className="site-preview-card__header">
              <div>
                <span className="site-preview-card__eyebrow">Pozzo Nord</span>
                <h3>Pompa principale</h3>
              </div>
              <StatusBadge label="ONLINE" tone="success" />
            </div>
            <div className="site-preview-card__metrics">
              <div>
                <span>Stato pompa</span>
                <strong>IN FUNZIONE</strong>
              </div>
              <div>
                <span>Frequenza</span>
                <strong>40.00 Hz</strong>
              </div>
            </div>
          </article>

          <article className="site-preview-card site-preview-card--muted">
            <div className="site-preview-card__header">
              <div>
                <span className="site-preview-card__eyebrow">Prossimo step</span>
                <h3>Dashboard dinamica</h3>
              </div>
              <Gauge size={22} />
            </div>
            <p>
              In STEP 3 collegheremo KPI e impianti al layer demo/API, mantenendo la stessa sessione
              e gli stessi permessi introdotti nello STEP 2.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
