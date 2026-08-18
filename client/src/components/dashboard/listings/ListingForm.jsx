import { useForm } from 'react-hook-form';
import { fieldsForKind } from '@/config/listingKinds';
import { toFormValues, toPayload, getErrorForPath } from '@/utils/nestedForm';
import { Input, Label, FieldError } from '@/components/ui/input';
import { Textarea, Select } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function ListingForm({ kind, initialValues, onSubmit, submitLabel = 'Save' }) {
  const fields = fieldsForKind(kind);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: toFormValues(initialValues, fields) });

  const submit = handleSubmit((values) => onSubmit(toPayload(values, fields)));

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {fields.map((f) => {
        const validation = { required: f.required ? `${f.label} is required` : false };

        if (f.type === 'checkbox') {
          return (
            <label key={f.name} className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register(f.name)} className="h-4 w-4 accent-signal" />
              {f.label}
            </label>
          );
        }

        return (
          <div key={f.name}>
            <Label htmlFor={f.name}>{f.label}</Label>
            {f.type === 'textarea' ? (
              <Textarea id={f.name} rows={5} {...register(f.name, validation)} />
            ) : f.type === 'select' ? (
              <Select id={f.name} {...register(f.name, validation)} defaultValue="">
                <option value="" disabled>
                  Select...
                </option>
                {f.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                id={f.name}
                type={f.type === 'tags' ? 'text' : f.type}
                step={f.step}
                {...register(f.name, validation)}
              />
            )}
            <FieldError>{getErrorForPath(errors, f.name)?.message}</FieldError>
          </div>
        );
      })}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
