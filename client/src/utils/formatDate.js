export function formatDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

export function formatDateRange(start, end) {
  if (!start) return '';
  return `${formatDate(start)} – ${end ? formatDate(end) : 'Present'}`;
}
