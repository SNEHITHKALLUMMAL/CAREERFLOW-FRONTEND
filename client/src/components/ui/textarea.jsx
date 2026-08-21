import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Textarea = forwardRef(({ className, rows = 3, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(
      'w-full resize-y rounded-xl border border-mist/25 bg-white px-3.5 py-2.5 text-sm text-ink',
      'placeholder:text-mist/70 transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:border-signal',
      'dark:border-white/15 dark:bg-white/5 dark:text-white',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export const Select = forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'h-11 w-full rounded-xl border border-mist/25 bg-white px-3.5 text-sm text-ink',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:border-signal',
      'dark:border-white/15 dark:bg-white/5 dark:text-white',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';
