import type { PropsWithChildren, ReactNode } from 'react';
import { FiInbox } from 'react-icons/fi';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon = <FiInbox aria-hidden="true" />,
  children,
}: PropsWithChildren<EmptyStateProps>) {
  return (
    <section className="empty-state" aria-labelledby="empty-state-title">
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <h2 id="empty-state-title">{title}</h2>
      <p>{description}</p>
      {children ? <div className="empty-state__actions">{children}</div> : null}
    </section>
  );
}
