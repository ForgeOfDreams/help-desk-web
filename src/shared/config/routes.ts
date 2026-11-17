export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  login: '/login',
  register: '/register',
  verifyEmail: '/verify-email',
  setPassword: '/set-password',
  tickets: '/tickets',
  ticketCreate: '/tickets/new',
  ticketDetails: (ticketId: string) => `/tickets/${encodeURIComponent(ticketId)}`,
  notifications: '/notifications',
  profile: '/profile',
  adminUsers: '/admin/users',
} as const;
