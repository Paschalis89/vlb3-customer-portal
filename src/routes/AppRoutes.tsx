import { Route, Routes } from 'react-router-dom';
import { GuestOnlyRoute } from '../auth/GuestOnlyRoute';
import { PermissionRoute } from '../auth/PermissionRoute';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { AppShell } from '../components/layout/AppShell';
import { AlertsPage } from '../pages/AlertsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { DeviceDetailPage } from '../pages/DeviceDetailPage';
import { HistoryPage } from '../pages/HistoryPage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SiteDetailPage } from '../pages/SiteDetailPage';
import { SitesPage } from '../pages/SitesPage';
import { UsersPage } from '../pages/UsersPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="sites" element={<SitesPage />} />
          <Route path="sites/:siteId" element={<SiteDetailPage />} />
          <Route path="devices/:deviceId" element={<DeviceDetailPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />

          <Route element={<PermissionRoute permission="users.read" />}>
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
