import { Link } from 'react-router';
import { ROUTES } from '@/shared/config';

export function NotFoundPage() {
  return (
    <div className="page-stack page-stack--narrow">
      <section className="surface-card not-found-card">
        <span className="not-found-card__code">404</span>
        <h1>Страница не найдена</h1>
        <p>Такого адреса нет в Help Desk. Проверьте URL или вернитесь к обзору.</p>
        <Link className="button button--primary" to={ROUTES.home}>
          На главную
        </Link>
      </section>
    </div>
  );
}
