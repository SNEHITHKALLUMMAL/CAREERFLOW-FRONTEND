import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Card = forwardRef(({ className, glass = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border p-6',
      glass
        ? 'border-white/20 bg-white/60 shadow-glass backdrop-blur-md dark:border-white/10 dark:bg-white/5'
        : 'border-mist/15 bg-white shadow-sm dark:border-white/10 dark:bg-ink',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-display text-lg font-semibold text-ink dark:text-white', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('mt-1.5 text-sm text-mist', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';
