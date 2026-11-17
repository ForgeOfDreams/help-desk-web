import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateTicketInput, TicketCategory, TicketPriority } from '@/entities/ticket';
import { Button, SelectField, TextAreaField, TextField } from '@/shared/ui';

interface CreateTicketFormProps {
  onSubmit: (input: CreateTicketInput) => void;
  submitting?: boolean;
  categories?: TicketCategory[];
}

const priorityOptions = [
  { value: 'low', label: 'Низкий' },
  { value: 'normal', label: 'Обычный' },
  { value: 'high', label: 'Высокий' },
  { value: 'urgent', label: 'Срочный' },
];

export function CreateTicketForm({
  onSubmit,
  submitting = false,
  categories = [],
}: CreateTicketFormProps) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('normal');
  const [categoryId, setCategoryId] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      subject: subject.trim(),
      description: description.trim(),
      priority,
      categoryId: categoryId || null,
    });
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <TextField
        id="ticket-subject"
        label="Тема обращения"
        name="subject"
        placeholder="Например, не работает VPN"
        value={subject}
        onChange={(event) => setSubject(event.currentTarget.value)}
        minLength={5}
        maxLength={160}
        required
      />
      <TextAreaField
        id="ticket-description"
        label="Описание проблемы"
        name="description"
        placeholder="Опишите проблему, что уже проверяли и какой результат ожидали."
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        minLength={10}
        maxLength={10_000}
        rows={6}
        required
      />
      <SelectField
        id="ticket-priority"
        label="Приоритет"
        name="priority"
        options={priorityOptions}
        value={priority}
        onChange={(event) => setPriority(event.currentTarget.value as TicketPriority)}
        required
      />
      {categories.length > 0 ? (
        <SelectField
          id="ticket-category"
          label="Категория"
          name="categoryId"
          placeholder="Без категории"
          options={categories.map((category) => ({ value: category.id, label: category.name }))}
          value={categoryId}
          onChange={(event) => setCategoryId(event.currentTarget.value)}
        />
      ) : null}
      <div className="form-actions">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Создаём…' : 'Создать обращение'}
        </Button>
      </div>
    </form>
  );
}
