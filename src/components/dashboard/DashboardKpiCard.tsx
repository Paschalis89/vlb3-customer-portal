import type { LucideIcon } from 'lucide-react';

export type DashboardKpiTone = 'primary' | 'success' | 'warning' | 'danger';

interface DashboardKpiCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: DashboardKpiTone;
  helperText?: string;
}

export function DashboardKpiCard({
  label,
  value,
  icon: Icon,
  tone = 'primary',
  helperText,
}: DashboardKpiCardProps) {
  return (
    <article className={`kpi-card kpi-card--${tone}`}>
      <div className="kpi-card__icon" aria-hidden="true">
        <Icon size={20} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      {helperText ? <small>{helperText}</small> : null}
    </article>
  );
}
