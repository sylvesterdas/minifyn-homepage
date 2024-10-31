import { 
  LayoutDashboard, 
  Link2, 
  BarChart2,
  User,
  Key,
  CreditCard
} from 'lucide-react';

export const MENU_ITEMS = [
  { 
    key: 'Overview',
    path: '/dashboard',
    icon: LayoutDashboard
  },
  { 
    key: 'My Links',
    path: '/dashboard/links',
    icon: Link2
  },
  { 
    key: 'Analytics',
    path: '/dashboard/analytics',
    icon: BarChart2
  }
];

export const SETTINGS_ITEMS = [
  { 
    key: 'Account',
    path: '/dashboard/settings/account',
    icon: User
  },
  { 
    key: 'API Keys',
    path: '/dashboard/settings/api-keys',
    icon: Key
  },
  { 
    key: 'Subscription',
    path: '/dashboard/settings/subscription',
    icon: CreditCard
  }
];