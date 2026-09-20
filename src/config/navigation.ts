import {
  Bell,
  Building2,
  History,
  LayoutDashboard,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { CustomerPermission } from '../auth/permissions';

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  mobile: boolean;
  permission?: CustomerPermission;
}

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, mobile: true },
  { label: 'Impianti', path: '/sites', icon: Building2, mobile: true },
  { label: 'Allarmi', path: '/alerts', icon: Bell, mobile: true },
  { label: 'Storico', path: '/history', icon: History, mobile: true },
  {
    label: 'Utenti',
    path: '/users',
    icon: Users,
    mobile: false,
    permission: 'users.read',
  },
  { label: 'Profilo', path: '/profile', icon: UserRound, mobile: true },
];
