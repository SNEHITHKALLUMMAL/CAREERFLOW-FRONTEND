import { formatDateRange, formatDate } from '@/utils/formatDate';

const workEntryFields = [
  { name: 'company', label: 'Company', type: 'text', required: true },
  { name: 'role', label: 'Role', type: 'text', required: true },
  { name: 'startDate', label: 'Start date', type: 'date', required: true },
  { name: 'endDate', label: 'End date (leave blank if ongoing)', type: 'date' },
  { name: 'description', label: 'Description', type: 'textarea' },
];

export const RESOURCE_CONFIG = {
  education: {
    title: 'Education',
    emptyMessage: 'No education added yet.',
    itemTitle: (i) => i.degree,
    itemSubtitle: (i) =>
      `${i.institution}${i.startYear ? ` · ${i.startYear}${i.endYear ? `–${i.endYear}` : ''}` : ''}`,
    fields: [
      {
        name: 'degree',
        label: 'Degree',
        type: 'text',
        required: true,
        placeholder: 'B.Tech Computer Science',
      },
      { name: 'institution', label: 'Institution', type: 'text', required: true },
      { name: 'startYear', label: 'Start year', type: 'number', required: true },
      { name: 'endYear', label: 'End year', type: 'number' },
      { name: 'cgpa', label: 'CGPA (out of 10)', type: 'number', step: '0.01' },
    ],
  },

  skills: {
    title: 'Skills',
    emptyMessage: 'No skills added yet.',
    itemTitle: (i) => i.name,
    itemSubtitle: (i) => i.proficiency,
    fields: [
      { name: 'name', label: 'Skill', type: 'text', required: true, placeholder: 'React' },
      {
        name: 'proficiency',
        label: 'Proficiency',
        type: 'select',
        options: ['beginner', 'intermediate', 'advanced'],
      },
    ],
  },

  languages: {
    title: 'Languages',
    emptyMessage: 'No languages added yet.',
    itemTitle: (i) => i.name,
    itemSubtitle: (i) => i.proficiency,
    fields: [
      { name: 'name', label: 'Language', type: 'text', required: true, placeholder: 'Malayalam' },
      {
        name: 'proficiency',
        label: 'Proficiency',
        type: 'select',
        options: ['basic', 'conversational', 'fluent', 'native'],
      },
    ],
  },

  projects: {
    title: 'Projects',
    emptyMessage: 'No projects added yet.',
    itemTitle: (i) => i.title,
    itemSubtitle: (i) => (i.techStack || []).join(', '),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      {
        name: 'techStack',
        label: 'Tech stack (comma-separated)',
        type: 'tags',
        placeholder: 'React, Node, MongoDB',
      },
      { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
      { name: 'liveUrl', label: 'Live URL', type: 'url' },
      { name: 'startDate', label: 'Start date', type: 'date' },
      { name: 'endDate', label: 'End date', type: 'date' },
    ],
  },

  internships: {
    title: 'Internships',
    emptyMessage: 'No internships added yet.',
    itemTitle: (i) => `${i.role} at ${i.company}`,
    itemSubtitle: (i) => formatDateRange(i.startDate, i.endDate),
    fields: workEntryFields,
  },

  experience: {
    title: 'Work experience',
    emptyMessage: 'No work experience added yet.',
    itemTitle: (i) => `${i.role} at ${i.company}`,
    itemSubtitle: (i) => formatDateRange(i.startDate, i.endDate),
    fields: workEntryFields,
  },

  certifications: {
    title: 'Certifications',
    emptyMessage: 'No certifications added yet.',
    itemTitle: (i) => i.title,
    itemSubtitle: (i) => i.issuer,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'issuer', label: 'Issuer', type: 'text', required: true },
      { name: 'issueDate', label: 'Issue date', type: 'date' },
      { name: 'certificateUrl', label: 'Certificate URL', type: 'url' },
    ],
  },

  achievements: {
    title: 'Achievements',
    emptyMessage: 'No achievements added yet.',
    itemTitle: (i) => i.title,
    itemSubtitle: (i) => formatDate(i.date),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'date', label: 'Date', type: 'date' },
    ],
  },
};

/** Ordered so the profile page renders sections in a sensible reading order. */
export const STUDENT_ARRAY_FIELDS = [
  'education',
  'skills',
  'languages',
  'projects',
  'internships',
  'experience',
  'certifications',
  'achievements',
];
