import type { SelectHTMLAttributes } from 'react';
import Form from 'react-bootstrap/Form';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  id: string;
  label: string;
  options: SelectOption[];
  hint?: string;
  placeholder?: string;
  /** React Bootstrap sizing, not the native HTML option-count attribute. */
  size?: 'sm' | 'lg';
}

export function SelectField({
  id,
  label,
  options,
  hint,
  placeholder,
  className = '',
  ...props
}: SelectFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <Form.Group controlId={id} className="field">
      <Form.Label className="field__label">{label}</Form.Label>
      <Form.Select
        className={['field__control', 'form-select', className].filter(Boolean).join(' ')}
        aria-describedby={hintId}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      {hint ? (
        <Form.Text className="field__hint" id={hintId}>
          {hint}
        </Form.Text>
      ) : null}
    </Form.Group>
  );
}
