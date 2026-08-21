import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ' +
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-ink ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-signal text-white shadow-sm hover:bg-signal-dark',
        secondary:
          'bg-signal-light text-signal-dark hover:bg-signal-light/70 dark:bg-white/10 dark:text-white dark:hover:bg-white/15',
        outline:
          'border border-mist/30 bg-transparent hover:bg-mist/10 dark:border-white/15 dark:hover:bg-white/5',
        ghost: 'bg-transparent hover:bg-mist/10 dark:hover:bg-white/5',
      },
      size: {
        sm: 'h-9 px-3.5',
        md: 'h-11 px-5',
        lg: 'h-12 px-7 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { buttonVariants };
