import { NavLink } from 'react-router-dom';
import { navigationItems } from '../../config/navigation';
import { usePermissions } from '../../hooks/usePermissions';

export function BottomNavigation() {
  const { can } = usePermissions();
  const mobileItems = navigationItems.filter(
    (item) => item.mobile && (!item.permission || can(item.permission)),
  );

  return (
    <nav className="bottom-nav" aria-label="Navigazione mobile">
      {mobileItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `bottom-nav__link${isActive ? ' bottom-nav__link--active' : ''}`
            }
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
