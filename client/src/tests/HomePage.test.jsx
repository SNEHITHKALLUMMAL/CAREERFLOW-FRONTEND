import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from '@/pages/Home/HomePage';

describe('HomePage', () => {
  it('renders the hero headline', () => {
    render(<HomePage />);
    expect(
      screen.getByRole('heading', { name: /turn your skills into an offer letter/i })
    ).toBeInTheDocument();
  });

  it('renders the readiness journey steps', () => {
    render(<HomePage />);
    expect(screen.getByText(/placement ready/i)).toBeInTheDocument();
  });
});
