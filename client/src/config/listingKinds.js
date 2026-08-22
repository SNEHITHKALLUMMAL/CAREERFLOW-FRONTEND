export const LISTING_KINDS = {
  job: {
    label: 'Job',
    pluralLabel: 'Jobs',
    apiBase: 'jobs',
    routeBase: '/dashboard/jobs',
    extraFields: [
      {
        name: 'jobType',
        label: 'Job type',
        type: 'select',
        options: ['full-time', 'part-time', 'contract'],
        required: true,
      },
      { name: 'salaryRange.min', label: 'Salary min', type: 'number' },
      { name: 'salaryRange.max', label: 'Salary max', type: 'number' },
    ],
  },
  internship: {
    label: 'Internship',
    pluralLabel: 'Internships',
    apiBase: 'internships',
    routeBase: '/dashboard/internships',
    extraFields: [
      { name: 'durationMonths', label: 'Duration (months)', type: 'number', required: true },
      { name: 'stipend', label: 'Stipend', type: 'number' },
    ],
  },
};

/** Fields common to both jobs and internships, in form order. */
export const COMMON_LISTING_FIELDS = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'requiredSkills', label: 'Required skills (comma-separated)', type: 'tags' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'isRemote', label: 'Remote', type: 'checkbox' },
];

export const ELIGIBILITY_FIELDS = [
  { name: 'eligibility.minCgpa', label: 'Minimum CGPA', type: 'number', step: '0.1' },
  {
    name: 'eligibility.allowedDepartments',
    label: 'Allowed departments (comma-separated)',
    type: 'tags',
  },
  { name: 'eligibility.graduationYear', label: 'Graduation year', type: 'number' },
  { name: 'applicationDeadline', label: 'Application deadline', type: 'date' },
];

export function fieldsForKind(kind) {
  return [...COMMON_LISTING_FIELDS, ...LISTING_KINDS[kind].extraFields, ...ELIGIBILITY_FIELDS];
}
