import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import BootstrapButton from 'react-bootstrap/Button';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: 'sm' | 'lg';
}

const bootstrapVariants: Record<
  ButtonVariant,
  'primary' | 'outline-secondary' | 'link' | 'danger'
> = {
  primary: 'primary',
  secondary: 'outline-secondary',
  ghost: 'link',
  danger: 'danger',
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  fullWidth = false,
  size,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const classes = ['button', `button--${variant}`, fullWidth ? 'button--full-width' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <BootstrapButton
      variant={bootstrapVariants[variant]}
      className={classes}
      size={size}
      {...props}
    >
      {children}
    </BootstrapButton>
  );
}
