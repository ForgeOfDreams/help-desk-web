import Nav from 'react-bootstrap/Nav';
import { FiBell, FiFilePlus, FiGrid, FiInbox, FiLogOut, FiUser, FiUsers } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { Link, NavLink, useNavigate } from 'react-router';
import { useSession } from '@/entities/session';
import { appConfig, ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui';

interface NavigationItem {
  to: string;
  label: string;
  icon: IconType;
  end?: boolean;
}

const primaryNavigation: NavigationItem[] = [
  { to: ROUTES.dashboard, label: 'Обзор', icon: FiGrid, end: true },
  { to: ROUTES.tickets, label: 'Обращения', icon: FiInbox },
  { to: ROUTES.notifications, label: 'Уведомления', icon: FiBell },
];

function NavigationLinks({ items }: { items: NavigationItem[] }) {
  return items.map(({ to, label, icon: Icon, end }) => (
    <Nav.Link key={to} as={NavLink} to={to} end={end} className="app-nav-link">
      <Icon size={17} aria-hidden="true" className="nav-link__icon" />
      <span>{label}</span>
    </Nav.Link>
  ));
}

export function AppSidebar() {
  const { user, isAdmin, signOut } = useSession();
  const navigate = useNavigate();
  const initials = (user?.displayName || user?.email || 'U').slice(0, 1).toLocaleUpperCase();

  function handleSignOut() {
    signOut();
    navigate(ROUTES.login, { replace: true });
  }

  return (
    <aside className="sidebar">
      <Link className="brand" to={ROUTES.dashboard} aria-label={`${appConfig.appName} — обзор`}>
        <span className="brand__mark" aria-hidden="true">
          HD
        </span>
        <span className="brand__copy">
          <strong>{appConfig.appName}</strong>
          <small>SUPPORT WORKSPACE</small>
        </span>
      </Link>

      <Nav as="nav" className="sidebar__nav" aria-label="Рабочая область">
        <span className="sidebar__label">Рабочая область</span>
        <NavigationLinks items={primaryNavigation} />
        <Nav.Link as={NavLink} to={ROUTES.ticketCreate} className="app-nav-link">
          <FiFilePlus size={17} aria-hidden="true" className="nav-link__icon" />
          <span>Новое обращение</span>
        </Nav.Link>
      </Nav>

      <Nav as="nav" className="sidebar__nav sidebar__nav--account" aria-label="Учётная запись">
        <span className="sidebar__label">Аккаунт</span>
        <NavigationLinks items={[{ to: ROUTES.profile, label: 'Профиль', icon: FiUser }]} />
        {isAdmin ? (
          <NavigationLinks
            items={[{ to: ROUTES.adminUsers, label: 'Пользователи', icon: FiUsers }]}
          />
        ) : null}
      </Nav>

      <div className="sidebar__bottom">
        <span className="sidebar__avatar" aria-hidden="true">
          {initials}
        </span>
        <div className="sidebar__identity">
          <strong>{user?.displayName || 'Пользователь'}</strong>
          <small>{user?.email}</small>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="sidebar__logout"
          onClick={handleSignOut}
          aria-label="Выйти"
        >
          <FiLogOut size={16} aria-hidden="true" />
        </Button>
      </div>
    </aside>
  );
}
