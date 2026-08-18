import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAddItem, useUpdateItem, useRemoveItem } from '@/hooks/useStudentProfile';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, FieldError } from '@/components/ui/input';
import { Textarea, Select } from '@/components/ui/textarea';

function toFormValues(item, fields) {
  const values = {};
  for (const f of fields) {
    let value = item?.[f.name];
    if (f.type === 'date' && value) value = new Date(value).toISOString().slice(0, 10);
    if (f.type === 'tags') value = Array.isArray(value) ? value.join(', ') : '';
    values[f.name] = value ?? '';
  }
  return values;
}

function toPayload(values, fields) {
  const payload = {};
  for (const f of fields) {
    let value = values[f.name];
    if (value === '' || value === undefined) continue; // omit empty optional fields entirely
    if (f.type === 'number') value = Number(value);
    if (f.type === 'tags') {
      value = value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    payload[f.name] = value;
  }
  return payload;
}

function ItemForm({ field, config, item, onDone }) {
  const isEdit = Boolean(item);
  const addMutation = useAddItem(field);
  const updateMutation = useUpdateItem(field);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: toFormValues(item, config.fields) });

  const onSubmit = async (values) => {
    const payload = toPayload(values, config.fields);
    if (isEdit) {
      await updateMutation.mutateAsync({ itemId: item._id, payload });
    } else {
      await addMutation.mutateAsync(payload);
    }
    onDone();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 rounded-xl border border-mist/20 p-4 dark:border-white/10"
      noValidate
    >
      {config.fields.map((f) => {
        const inputId = `${field}-${f.name}`;
        const validation = { required: f.required ? `${f.label} is required` : false };

        return (
          <div key={f.name}>
            <Label htmlFor={inputId}>{f.label}</Label>
            {f.type === 'textarea' ? (
              <Textarea id={inputId} {...register(f.name, validation)} />
            ) : f.type === 'select' ? (
              <Select id={inputId} {...register(f.name)}>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                id={inputId}
                type={f.type === 'tags' ? 'text' : f.type}
                step={f.step}
                placeholder={f.placeholder}
                {...register(f.name, validation)}
              />
            )}
            <FieldError>{errors[f.name]?.message}</FieldError>
          </div>
        );
      })}

      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isEdit ? 'Save changes' : 'Add'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function SubResourceEditor({ field, config, items }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const removeMutation = useRemoveItem(field);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <CardTitle>{config.title}</CardTitle>
        {!adding && (
          <Button size="sm" variant="secondary" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {adding && <ItemForm field={field} config={config} onDone={() => setAdding(false)} />}

        {items.length === 0 && !adding && (
          <p className="text-sm text-mist">{config.emptyMessage}</p>
        )}

        {items.map((item) =>
          editingId === item._id ? (
            <ItemForm
              key={item._id}
              field={field}
              config={config}
              item={item}
              onDone={() => setEditingId(null)}
            />
          ) : (
            <div
              key={item._id}
              className="flex items-start justify-between gap-3 rounded-xl border border-mist/15 p-3 dark:border-white/10"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{config.itemTitle(item)}</p>
                {config.itemSubtitle(item) && (
                  <p className="truncate text-xs text-mist">{config.itemSubtitle(item)}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setEditingId(item._id)}
                  aria-label={`Edit ${config.itemTitle(item)}`}
                  className="rounded-lg p-1.5 text-mist hover:bg-mist/10 dark:hover:bg-white/5"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeMutation.mutate(item._id)}
                  aria-label={`Remove ${config.itemTitle(item)}`}
                  className="rounded-lg p-1.5 text-mist hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </Card>
  );
}
