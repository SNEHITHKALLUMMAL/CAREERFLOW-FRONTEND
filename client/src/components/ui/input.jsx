import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Input = forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'h-11 w-full rounded-xl border border-mist/25 bg-white px-3.5 text-sm text-ink',
      'placeholder:text-mist/70 transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:border-signal',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'dark:border-white/15 dark:bg-white/5 dark:text-white',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const Label = forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('mb-1.5 block text-sm font-medium text-ink dark:text-white', className)}
    {...props}
  />
));
Label.displayName = 'Label';

export const FieldError = ({ children }) => {
  if (!children) return null;
  return <p className="mt-1.5 text-sm text-red-500">{children}</p>;
};
