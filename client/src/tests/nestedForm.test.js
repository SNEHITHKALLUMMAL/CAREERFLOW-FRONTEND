import { describe, it, expect } from 'vitest';
import { getPath, setPath, toFormValues, toPayload, getErrorForPath } from '@/utils/nestedForm';

describe('getPath / setPath', () => {
  it('reads a nested value by dot path', () => {
    expect(getPath({ a: { b: { c: 42 } } }, 'a.b.c')).toBe(42);
  });

  it('returns undefined for a missing path without throwing', () => {
    expect(getPath({ a: {} }, 'a.b.c')).toBeUndefined();
    expect(getPath(null, 'a.b')).toBeNull();
  });

  it('writes a nested value, creating intermediate objects', () => {
    const obj = {};
    setPath(obj, 'a.b.c', 42);
    expect(obj).toEqual({ a: { b: { c: 42 } } });
  });

  it('writes a top-level value for a non-nested path', () => {
    const obj = {};
    setPath(obj, 'title', 'Hello');
    expect(obj).toEqual({ title: 'Hello' });
  });
});

describe('toFormValues', () => {
  const fields = [
    { name: 'title', type: 'text' },
    { name: 'isRemote', type: 'checkbox' },
    { name: 'requiredSkills', type: 'tags' },
    { name: 'applicationDeadline', type: 'date' },
    { name: 'eligibility.minCgpa', type: 'number' },
  ];

  it('builds defaultValues from an existing record, converting types for display', () => {
    const record = {
      title: 'SWE Intern',
      isRemote: true,
      requiredSkills: ['React', 'Node'],
      applicationDeadline: '2026-06-15T00:00:00.000Z',
      eligibility: { minCgpa: 8 },
    };

    const values = toFormValues(record, fields);

    expect(values.title).toBe('SWE Intern');
    expect(values.isRemote).toBe(true);
    expect(values.requiredSkills).toBe('React, Node');
    expect(values.applicationDeadline).toBe('2026-06-15');
    expect(values.eligibility.minCgpa).toBe(8);
  });

  it('produces sensible empty defaults when there is no existing record (create mode)', () => {
    const values = toFormValues(undefined, fields);
    expect(values.title).toBe('');
    expect(values.isRemote).toBe(false);
    expect(values.requiredSkills).toBe('');
  });
});

describe('toPayload', () => {
  const fields = [
    { name: 'title', type: 'text' },
    { name: 'isRemote', type: 'checkbox' },
    { name: 'requiredSkills', type: 'tags' },
    { name: 'eligibility.minCgpa', type: 'number' },
  ];

  it('converts a comma-separated tags string back into an array', () => {
    const payload = toPayload(
      { title: 'X', isRemote: false, requiredSkills: 'React, Node, MongoDB' },
      fields
    );
    expect(payload.requiredSkills).toEqual(['React', 'Node', 'MongoDB']);
  });

  it('converts number strings to numbers, including nested paths', () => {
    const payload = toPayload(
      { title: 'X', isRemote: false, eligibility: { minCgpa: '8.5' } },
      fields
    );
    expect(payload.eligibility.minCgpa).toBe(8.5);
  });

  it('omits empty optional fields entirely rather than sending empty strings', () => {
    const payload = toPayload({ title: 'X', isRemote: false, requiredSkills: '' }, fields);
    expect(payload).not.toHaveProperty('requiredSkills');
  });

  it('always includes checkbox fields, even when false', () => {
    const payload = toPayload({ title: 'X', isRemote: false }, fields);
    expect(payload.isRemote).toBe(false);
  });
});

describe('getErrorForPath', () => {
  it('resolves a nested react-hook-form error object by dot path', () => {
    const errors = { eligibility: { minCgpa: { message: 'Too low' } } };
    expect(getErrorForPath(errors, 'eligibility.minCgpa').message).toBe('Too low');
  });

  it('returns undefined when there is no error at that path', () => {
    expect(getErrorForPath({}, 'title')).toBeUndefined();
  });
});
