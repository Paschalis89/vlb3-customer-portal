import { Outlet } from 'react-router-dom';
import { NetworkStatusBanner } from '../pwa/NetworkStatusBanner';
import { BottomNavigation } from './BottomNavigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <Header />
        <NetworkStatusBanner />
        <main className="app-content">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}
