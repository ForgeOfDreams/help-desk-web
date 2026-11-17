import type { TextareaHTMLAttributes } from 'react';
import Form from 'react-bootstrap/Form';

interface TextAreaFieldProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size' | 'value' | 'defaultValue'
> {
  id: string;
  label: string;
  hint?: string;
  /** React Bootstrap sizing, not the native HTML character-count attribute. */
  size?: 'sm' | 'lg';
  /** Text-area values are strings or numbers; readonly string arrays are not valid here. */
  value?: string | number;
  defaultValue?: string | number;
}

export function TextAreaField({ id, label, hint, className = '', ...props }: TextAreaFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <Form.Group controlId={id} className="field">
      <Form.Label className="field__label">{label}</Form.Label>
      <Form.Control
        as="textarea"
        className={['field__control', 'field__control--textarea', 'form-control', className]
          .filter(Boolean)
          .join(' ')}
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
