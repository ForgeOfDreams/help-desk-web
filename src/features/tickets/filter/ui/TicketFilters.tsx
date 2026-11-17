import { SelectField, TextField } from '@/shared/ui';

import type { TicketFilterValues } from '../model/types';

interface TicketFiltersProps {
  value: TicketFilterValues;
  onChange: (value: TicketFilterValues) => void;
}

const statusOptions = [
  { value: 'all', label: 'Все статусы' },
  { value: 'new', label: 'Новое' },
  { value: 'open', label: 'Открыто' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'pending', label: 'Ожидает ответа' },
  { value: 'resolved', label: 'Решено' },
  { value: 'closed', label: 'Закрыто' },
];

const priorityOptions = [
  { value: 'all', label: 'Все приоритеты' },
  { value: 'low', label: 'Низкий' },
  { value: 'normal', label: 'Обычный' },
  { value: 'high', label: 'Высокий' },
  { value: 'urgent', label: 'Срочный' },
];

export function TicketFilters({ value, onChange }: TicketFiltersProps) {
  return (
    <section className="filter-panel" aria-label="Фильтры обращений">
      <TextField
        id="ticket-search"
        label="Поиск"
        type="search"
        placeholder="Номер или тема обращения"
        value={value.query}
        onChange={(event) => onChange({ ...value, query: event.currentTarget.value })}
      />
      <SelectField
        id="ticket-status-filter"
        label="Статус"
        value={value.status}
        onChange={(event) =>
          onChange({ ...value, status: event.currentTarget.value as TicketFilterValues['status'] })
        }
        options={statusOptions}
      />
      <SelectField
        id="ticket-priority-filter"
        label="Приоритет"
        value={value.priority}
        onChange={(event) =>
          onChange({
            ...value,
            priority: event.currentTarget.value as TicketFilterValues['priority'],
          })
        }
        options={priorityOptions}
      />
    </section>
  );
}
