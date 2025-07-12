import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  it('renders default error message when no message prop is provided', () => {
    render(<ErrorMessage />);

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('Something went wrong. Please try again.')
    ).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('renders custom error message when message prop is provided', () => {
    const customMessage = 'Custom error message for testing';
    render(<ErrorMessage message={customMessage} />);

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders retry button when onRetry prop is provided', () => {
    const mockRetry = vi.fn();
    render(<ErrorMessage onRetry={mockRetry} />);

    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toBeEnabled();
  });
});
