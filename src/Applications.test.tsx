import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Applications from './Applications';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockApplicationsData = [
  {
    guid: '1',
    loan_amount: 25000,
    first_name: 'John',
    last_name: 'Doe',
    company: 'Tech Corp',
    email: 'john.doe@techcorp.com',
    date_created: '2021-08-10',
    expiry_date: '2021-12-02',
  },
  {
    guid: '2',
    loan_amount: 50000,
    first_name: 'Jane',
    last_name: 'Smith',
    company: 'Finance Ltd',
    email: 'jane.smith@finance.com',
    date_created: '2021-09-15',
    expiry_date: '2022-01-15',
  },
];

const mockApplicationsPage2 = [
  {
    guid: '3',
    loan_amount: 75000,
    first_name: 'Bob',
    last_name: 'Johnson',
    company: 'Startup Inc',
    email: 'bob@startup.com',
    date_created: '2021-10-01',
    expiry_date: '2022-02-01',
  },
];

describe('Applications Component', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders applications on initial load', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockApplicationsData),
      headers: {
        get: (header: string) =>
          header === 'Link'
            ? '<http://localhost:3001/api/applications?_page=2&_limit=5>; rel="next"'
            : null,
      },
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    render(<Applications />);

    // Wait for applications to load
    await waitFor(() => {
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText('Finance Ltd')).toBeInTheDocument();
    });

    // Check if Load More button is present
    expect(screen.getByText('Load More')).toBeInTheDocument();

    // Verify API was called with correct parameters
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/applications?_page=1&_limit=5'
    );
  });

  it('displays formatted loan amounts with pound sign', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockApplicationsData),
      headers: {
        get: () => null,
      },
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    render(<Applications />);

    await waitFor(() => {
      expect(screen.getByText('£25,000')).toBeInTheDocument();
      expect(screen.getByText('£50,000')).toBeInTheDocument();
    });
  });

  it('displays formatted dates', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockApplicationsData),
      headers: {
        get: () => null,
      },
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    render(<Applications />);

    await waitFor(() => {
      expect(screen.getByText('10-08-2021')).toBeInTheDocument();
      expect(screen.getByText('02-12-2021')).toBeInTheDocument();
    });
  });

  it('loads more applications when Load More button is clicked', async () => {
    // First request (initial load)
    const mockResponse1 = {
      ok: true,
      json: () => Promise.resolve(mockApplicationsData),
      headers: {
        get: (header: string) =>
          header === 'Link'
            ? '<http://localhost:3001/api/applications?_page=2&_limit=5>; rel="next"'
            : null,
      },
    };

    // Second request (load more)
    const mockResponse2 = {
      ok: true,
      json: () => Promise.resolve(mockApplicationsPage2),
      headers: {
        get: () => null, // No more pages
      },
    };

    mockFetch
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    render(<Applications />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    // Click Load More button
    const loadMoreButton = screen.getByText('Load More');
    fireEvent.click(loadMoreButton);

    // Wait for new applications to load
    await waitFor(() => {
      expect(screen.getByText('Startup Inc')).toBeInTheDocument();
    });

    // Verify both API calls were made
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      'http://localhost:3001/api/applications?_page=1&_limit=5'
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3001/api/applications?_page=2&_limit=5'
    );

    // Load More button should be hidden when no more pages
    expect(screen.queryByText('Load More')).not.toBeInTheDocument();
  });

  it('hides Load More button when no more pages available', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockApplicationsData),
      headers: {
        get: () => null, // No Link header means no more pages
      },
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    render(<Applications />);

    await waitFor(() => {
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    // Load More button should not be present
    expect(screen.queryByText('Load More')).not.toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFetch.mockRejectedValueOnce(new Error('API Error'));

    render(<Applications />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching applications:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('displays error message and hides applications when fetch fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    render(<Applications />);

    await waitFor(() => {
      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();
      expect(screen.getByText('Network Error')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    // Applications table should not be visible
    expect(screen.queryByText('Tech Corp')).not.toBeInTheDocument();
    expect(screen.queryByText('Load More')).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('retries fetch when retry button is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // First call fails
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    // Second call succeeds
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockApplicationsData),
      headers: {
        get: () => null,
      },
    };
    mockFetch.mockResolvedValueOnce(mockResponse);

    render(<Applications />);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    // Wait for applications to load after retry
    await waitFor(() => {
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText('Finance Ltd')).toBeInTheDocument();
    });

    // Error message should be gone
    expect(
      screen.queryByText('Oops! Something went wrong')
    ).not.toBeInTheDocument();

    expect(mockFetch).toHaveBeenCalledTimes(2);
    consoleSpy.mockRestore();
  });

  it('renders email as clickable mailto link', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockApplicationsData),
      headers: {
        get: () => null,
      },
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    render(<Applications />);

    await waitFor(() => {
      const emailLink = screen.getByText('john.doe@techcorp.com');
      expect(emailLink).toBeInTheDocument();
      expect(emailLink.closest('a')).toHaveAttribute(
        'href',
        'mailto:john.doe@techcorp.com'
      );
    });
  });
});
