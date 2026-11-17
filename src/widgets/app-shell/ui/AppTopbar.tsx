import Navbar from 'react-bootstrap/Navbar';
import { FiShield } from 'react-icons/fi';
import { useSession } from '@/entities/session';

export function AppTopbar() {
  const { user } = useSession();

  return (
    <Navbar as="header" className="topbar">
      <div className="topbar__context">
        <FiShield size={16} aria-hidden="true" className="topbar__status-icon" />
        <span>Портал поддержки</span>
        <span className="topbar__separator">/</span>
        <span className="topbar__muted">{user?.displayName || user?.email}</span>
      </div>
      <span className="topbar__session">
        <span aria-hidden="true" /> Активная сессия
      </span>
    </Navbar>
  );
}
