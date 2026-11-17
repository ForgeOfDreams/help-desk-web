import type { PropsWithChildren } from 'react';
import Alert from 'react-bootstrap/Alert';

type CalloutTone = 'info' | 'success' | 'warning';

interface CalloutProps {
  title?: string;
  tone?: CalloutTone;
}

const variants: Record<CalloutTone, 'info' | 'success' | 'warning'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
};

export function Callout({ children, title, tone = 'info' }: PropsWithChildren<CalloutProps>) {
  return (
    <Alert
      className={`callout callout--${tone}`}
      variant={variants[tone]}
      role={tone === 'warning' ? 'alert' : 'status'}
    >
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </Alert>
  );
}
