import { Component } from 'react';
import type { ReactNode } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { Button } from './Button';

interface AsyncBoundaryState {
  hasError: boolean;
}

interface AsyncBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

export class AsyncBoundary extends Component<AsyncBoundaryProps, AsyncBoundaryState> {
  state: AsyncBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AsyncBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <section className="load-error" role="alert">
            <h2>Не удалось загрузить страницу</h2>
            <p>Проверьте подключение и повторите загрузку.</p>
            <Button type="button" onClick={() => window.location.reload()}>
              <FiRefreshCw size={15} aria-hidden="true" /> Перезагрузить
            </Button>
          </section>
        )
      );
    }

    return this.props.children;
  }
}
