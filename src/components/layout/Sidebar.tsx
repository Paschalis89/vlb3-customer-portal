import { Activity } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { appConfig } from '../../config/app';
import { brandingConfig } from '../../config/branding';
import { navigationItems } from '../../config/navigation';
import { usePermissions } from '../../hooks/usePermissions';

export function Sidebar() {
  const { can } = usePermissions();
  const visibleItems = navigationItems.filter(
    (item) => !item.permission || can(item.permission),
  );

  return (
    <aside className="sidebar" aria-label="Navigazione principale">
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon" aria-hidden="true">
          <Activity size={22} />
        </div>
        <div>
          <strong>{brandingConfig.appName}</strong>
          <span>Customer Portal</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <span>Portale clienti</span>
        <small>v{appConfig.version}</small>
      </div>
    </aside>
  );
}
