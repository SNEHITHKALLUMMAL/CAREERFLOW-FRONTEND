import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Combines conditional class names and resolves Tailwind class conflicts. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
