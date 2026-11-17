import type { InputHTMLAttributes } from 'react';
import Form from 'react-bootstrap/Form';

type BootstrapFieldSize = 'sm' | 'lg';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  id: string;
  label: string;
  hint?: string;
  size?: BootstrapFieldSize;
}

export function TextField({
  id,
  label,
  hint,
  className = '',
  size,
  value,
  ...props
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <Form.Group controlId={id} className="field">
      <Form.Label className="field__label">{label}</Form.Label>
      <Form.Control
        size={size}
        value={value as string | number | string[] | undefined} // <--- Явно приводим тип
        className={['field__control', 'form-control', className].filter(Boolean).join(' ')}
        aria-describedby={hintId}
        {...props}
      />
      {hint ? (
        <Form.Text className="field__hint" id={hintId}>
          {hint}
        </Form.Text>
      ) : null}
    </Form.Group>
  );
}
