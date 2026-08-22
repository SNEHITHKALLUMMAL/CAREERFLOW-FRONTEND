import { describe, it, expect } from 'vitest';
import { RESOURCE_CONFIG, STUDENT_ARRAY_FIELDS } from '@/config/studentResourceFields';

const SAMPLE_ITEM = {
  _id: '1',
  degree: 'B.Tech',
  institution: 'MIT',
  startYear: 2020,
  endYear: 2024,
  name: 'React',
  proficiency: 'advanced',
  title: 'CareerFlow',
  techStack: ['React', 'Node'],
  company: 'Acme',
  role: 'SWE Intern',
  startDate: '2023-06-01',
  endDate: '2023-08-01',
  issuer: 'Coursera',
  date: '2023-01-01',
};

describe('RESOURCE_CONFIG', () => {
  it('has a config entry for every field in STUDENT_ARRAY_FIELDS', () => {
    for (const field of STUDENT_ARRAY_FIELDS) {
      expect(RESOURCE_CONFIG[field]).toBeDefined();
    }
  });

  it.each(STUDENT_ARRAY_FIELDS)(
    '%s config has a title, fields, and working itemTitle/itemSubtitle',
    (field) => {
      const config = RESOURCE_CONFIG[field];

      expect(typeof config.title).toBe('string');
      expect(config.title.length).toBeGreaterThan(0);
      expect(Array.isArray(config.fields)).toBe(true);
      expect(config.fields.length).toBeGreaterThan(0);

      // Every required field must have a name, label, and type.
      for (const f of config.fields) {
        expect(f.name).toBeTruthy();
        expect(f.label).toBeTruthy();
        expect(f.type).toBeTruthy();
      }

      // itemTitle/itemSubtitle must not throw against a representative item.
      expect(() => config.itemTitle(SAMPLE_ITEM)).not.toThrow();
      expect(() => config.itemSubtitle(SAMPLE_ITEM)).not.toThrow();
      expect(typeof config.itemTitle(SAMPLE_ITEM)).toBe('string');
    }
  );

  it('select fields always declare their options', () => {
    for (const field of STUDENT_ARRAY_FIELDS) {
      for (const f of RESOURCE_CONFIG[field].fields) {
        if (f.type === 'select') {
          expect(Array.isArray(f.options)).toBe(true);
          expect(f.options.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
