import { describe, it, expect } from 'vitest';
import { formatDate, formatDateRange } from '@/utils/formatDate';

describe('formatDate', () => {
  it('formats a valid date string as "Mon YYYY"', () => {
    expect(formatDate('2024-03-15')).toMatch(/Mar 2024/);
  });

  it('returns an empty string for falsy input', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('returns an empty string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});

describe('formatDateRange', () => {
  it('shows "Present" when there is no end date', () => {
    expect(formatDateRange('2023-01-01', null)).toMatch(/Present/);
  });

  it('shows both formatted dates when an end date is present', () => {
    const result = formatDateRange('2022-06-01', '2023-06-01');
    expect(result).toMatch(/Jun 2022/);
    expect(result).toMatch(/Jun 2023/);
  });

  it('returns an empty string when there is no start date', () => {
    expect(formatDateRange(null, '2023-06-01')).toBe('');
  });
});
