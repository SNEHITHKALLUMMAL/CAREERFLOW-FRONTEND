export function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function setPath(obj, path, value) {
  const keys = path.split('.');
  let cursor = obj;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
    } else {
      cursor[key] = cursor[key] || {};
      cursor = cursor[key];
    }
  });
  return obj;
}

/** Builds react-hook-form defaultValues (possibly nested) from an existing record, for editing. */
export function toFormValues(record, fields) {
  const values = {};
  for (const f of fields) {
    let value = record ? getPath(record, f.name) : undefined;
    if (f.type === 'date' && value) value = new Date(value).toISOString().slice(0, 10);
    if (f.type === 'tags') value = Array.isArray(value) ? value.join(', ') : '';
    if (f.type === 'checkbox') value = Boolean(value);
    if (value === undefined) value = f.type === 'checkbox' ? false : '';
    setPath(values, f.name, value);
  }
  return values;
}

/** Builds an API payload (nested) from form values, converting types and omitting empty optionals. */
export function toPayload(values, fields) {
  const payload = {};
  for (const f of fields) {
    let value = getPath(values, f.name);

    if (f.type === 'checkbox') {
      setPath(payload, f.name, Boolean(value));
      continue;
    }
    if (value === '' || value === undefined) continue;

    if (f.type === 'number') value = Number(value);
    if (f.type === 'tags') {
      value = value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    setPath(payload, f.name, value);
  }
  return payload;
}

/** react-hook-form's `errors` object mirrors dotted field names as nested objects. */
export function getErrorForPath(errors, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], errors);
}
