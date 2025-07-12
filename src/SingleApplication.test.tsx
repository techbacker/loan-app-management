import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import SingleApplication from './SingleApplication';

vi.mock('./SingleApplication.module.css', () => ({
  default: {
    SingleApplication: 'SingleApplication',
    cell: 'cell',
    emailCell: 'emailCell',
  },
}));

const mockApplication = {
  guid: '8a8f6cbc-77a1-4086-8968-a57816f4ff60',
  loan_amount: 37597,
  first_name: 'Miles',
  last_name: 'Espinoza',
  company: 'Qnekt',
  email: 'milesespinoza@qnekt.com',
  date_created: '2021-08-10',
  expiry_date: '2021-12-02',
};

describe('SingleApplication Component', () => {
  it('renders all application fields correctly', () => {
    render(<SingleApplication application={mockApplication} />);

    // Check company
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Qnekt')).toBeInTheDocument();

    // Check name
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Miles Espinoza')).toBeInTheDocument();

    // Check email
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('milesespinoza@qnekt.com')).toBeInTheDocument();

    // Check loan amount
    expect(screen.getByText('Loan Amount')).toBeInTheDocument();
    expect(screen.getByText('£37,597')).toBeInTheDocument();

    // Check application date
    expect(screen.getByText('Application Date')).toBeInTheDocument();
    expect(screen.getByText('10-08-2021')).toBeInTheDocument();

    // Check expiry date
    expect(screen.getByText('Expiry date')).toBeInTheDocument();
    expect(screen.getByText('02-12-2021')).toBeInTheDocument();
  });

  it('formats loan amount with pound sign and commas', () => {
    const applicationWithLargeLoan = {
      ...mockApplication,
      loan_amount: 1234567,
    };

    render(<SingleApplication application={applicationWithLargeLoan} />);

    expect(screen.getByText('£1,234,567')).toBeInTheDocument();
  });

  it('handles small loan amounts correctly', () => {
    const applicationWithSmallLoan = {
      ...mockApplication,
      loan_amount: 999,
    };

    render(<SingleApplication application={applicationWithSmallLoan} />);

    expect(screen.getByText('£999')).toBeInTheDocument();
  });

  it('renders email as clickable mailto link', () => {
    render(<SingleApplication application={mockApplication} />);

    const emailLink = screen.getByRole('link', {
      name: 'milesespinoza@qnekt.com',
    });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:milesespinoza@qnekt.com');
  });

  it('renders email link with correct styling classes', () => {
    render(<SingleApplication application={mockApplication} />);

    const emailCell = screen
      .getByText('milesespinoza@qnekt.com')
      .closest('div');
    expect(emailCell).toHaveClass('cell', 'emailCell');
  });

  it('displays formatted dates using the utility function', () => {
    render(<SingleApplication application={mockApplication} />);

    // Verify that the formatted dates are displayed correctly
    expect(screen.getByText('10-08-2021')).toBeInTheDocument();
    expect(screen.getByText('02-12-2021')).toBeInTheDocument();
  });

  it('handles missing optional properties gracefully', () => {
    const applicationWithMissingData = {
      ...mockApplication,
      first_name: undefined,
      last_name: undefined,
      date_created: undefined,
      expiry_date: undefined,
    };

    render(<SingleApplication application={applicationWithMissingData} />);

    // Should still render labels
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Application Date')).toBeInTheDocument();
    expect(screen.getByText('Expiry date')).toBeInTheDocument();

    // Should handle undefined values gracefully
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Qnekt')).toBeInTheDocument();
  });

  it('renders proper semantic structure with labels and content', () => {
    render(<SingleApplication application={mockApplication} />);

    // Check that all labels are rendered as sub elements
    const labels = screen.getAllByText(
      /Company|Name|Email|Loan Amount|Application Date|Expiry date/
    );
    expect(labels).toHaveLength(6);

    // Check that the main container exists
    const container = screen.getByText('Qnekt').closest('div');
    expect(container).toBeInTheDocument();
  });

  it('handles different email formats correctly', () => {
    const applicationWithDifferentEmail = {
      ...mockApplication,
      email: 'test.user+tag@example.co.uk',
    };

    render(<SingleApplication application={applicationWithDifferentEmail} />);

    const emailLink = screen.getByRole('link', {
      name: 'test.user+tag@example.co.uk',
    });
    expect(emailLink).toHaveAttribute(
      'href',
      'mailto:test.user+tag@example.co.uk'
    );
  });

  it('displays full name correctly when both first and last names are provided', () => {
    render(<SingleApplication application={mockApplication} />);

    expect(screen.getByText('Miles Espinoza')).toBeInTheDocument();
  });

  it('handles single name gracefully', () => {
    const applicationWithOnlyFirstName = {
      ...mockApplication,
      first_name: 'Miles',
      last_name: undefined,
    };

    render(<SingleApplication application={applicationWithOnlyFirstName} />);

    // Should still render the first name
    expect(screen.getByText(/Miles/)).toBeInTheDocument();
  });

  it('renders zero loan amount correctly', () => {
    const applicationWithZeroLoan = {
      ...mockApplication,
      loan_amount: 0,
    };

    render(<SingleApplication application={applicationWithZeroLoan} />);

    expect(screen.getByText('£0')).toBeInTheDocument();
  });
});
