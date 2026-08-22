import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AIToolCard({
  title,
  description,
  onSubmit,
  isPending,
  submitLabel = 'Generate',
  children,
  result,
}) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <form onSubmit={onSubmit} className="mt-4 space-y-3" noValidate>
        {children}
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Thinking...' : submitLabel}
        </Button>
      </form>
      {result && (
        <div className="mt-4 space-y-3 border-t border-mist/15 pt-4 dark:border-white/10">
          {result}
        </div>
      )}
    </Card>
  );
}
