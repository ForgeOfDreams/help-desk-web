import { describe, expect, it } from 'vitest';
import { parseApiCollection } from './collection';

describe('parseApiCollection', () => {
  it('normalizes an API Platform Hydra collection', () => {
    const result = parseApiCollection<{ id: string }>({
      'hydra:member': [{ id: 'ticket-1' }],
      'hydra:totalItems': 8,
    });

    expect(result.items).toEqual([{ id: 'ticket-1' }]);
    expect(result.totalItems).toBe(8);
  });

  it('supports a plain JSON array', () => {
    expect(parseApiCollection([1, 2, 3])).toEqual({ items: [1, 2, 3], totalItems: 3 });
  });

  it('returns an empty collection for unexpected payloads', () => {
    expect(parseApiCollection(null)).toEqual({ items: [], totalItems: null });
  });
});
