import { describe, it, expect } from 'vitest';
import { typeLabel, statusLabel } from '@/utils/assessmentLabels';

describe('typeLabel', () => {
  it('maps known assessment types to readable labels', () => {
    expect(typeLabel('mcq')).toBe('MCQ');
    expect(typeLabel('soft_skill_quiz')).toBe('Soft Skill Quiz');
  });

  it('falls back to the raw value for an unknown type', () => {
    expect(typeLabel('something_new')).toBe('something_new');
  });
});

describe('statusLabel', () => {
  it('maps known attempt statuses to readable labels', () => {
    expect(statusLabel('in_progress')).toBe('In progress');
    expect(statusLabel('graded')).toBe('Graded');
  });

  it('falls back to the raw value for an unknown status', () => {
    expect(statusLabel('mystery')).toBe('mystery');
  });
});
