import type { PropsWithChildren, ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
}: PropsWithChildren<PageHeaderProps>) {
  return (
    <header className="page-heading">
      <div className="page-heading__copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="page-heading__description">{description}</p> : null}
        {children}
      </div>
      {actions ? <div className="page-heading__actions">{actions}</div> : null}
    </header>
  );
}
