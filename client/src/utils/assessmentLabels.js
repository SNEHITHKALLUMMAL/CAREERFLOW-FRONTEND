export const ASSESSMENT_TYPE_LABELS = {
  coding: 'Coding',
  mcq: 'MCQ',
  aptitude: 'Aptitude',
  technical_quiz: 'Technical Quiz',
  soft_skill_quiz: 'Soft Skill Quiz',
};

export const ATTEMPT_STATUS_LABELS = {
  in_progress: 'In progress',
  submitted: 'Pending review',
  graded: 'Graded',
};

export function typeLabel(type) {
  return ASSESSMENT_TYPE_LABELS[type] || type;
}

export function statusLabel(status) {
  return ATTEMPT_STATUS_LABELS[status] || status;
}
