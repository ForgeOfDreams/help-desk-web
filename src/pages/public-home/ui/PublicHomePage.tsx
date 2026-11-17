import { Navigate, Link } from 'react-router';
import { FiArrowRight, FiLifeBuoy } from 'react-icons/fi';
import { useSession } from '@/entities/session';
import { ROUTES } from '@/shared/config';

export function PublicHomePage() {
  const { isAuthenticated } = useSession();
  if (isAuthenticated) return <Navigate to={ROUTES.dashboard} replace />;

  return (
    <section className="public-hero" aria-labelledby="public-home-title">
      <div className="public-hero__content">
        <span className="public-hero__eyebrow">
          <FiLifeBuoy aria-hidden="true" /> Help Desk
        </span>
        <h1 id="public-home-title">Портал поддержки</h1>
        <p>
          Войдите, чтобы просматривать обращения, создавать новые и получать ответы службы
          поддержки.
        </p>
        <div className="public-hero__actions">
          <Link className="button button--primary" to={ROUTES.login}>
            Войти в систему <FiArrowRight aria-hidden="true" />
          </Link>
          <Link className="button button--secondary" to={ROUTES.register}>
            Создать аккаунт
          </Link>
        </div>
      </div>
    </section>
  );
}
