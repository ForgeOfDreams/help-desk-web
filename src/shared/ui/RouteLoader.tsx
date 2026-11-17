import Spinner from 'react-bootstrap/Spinner';

export function RouteLoader() {
  return (
    <div className="route-loader" role="status" aria-live="polite" aria-label="Загрузка страницы">
      <Spinner
        animation="border"
        variant="primary"
        size="sm"
        className="route-loader__spinner"
        aria-hidden="true"
      />
      <span>Загружаем страницу…</span>
    </div>
  );
}
