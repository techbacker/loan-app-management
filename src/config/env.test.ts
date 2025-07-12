import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock import.meta.env before importing the module
vi.stubGlobal('import.meta', {
  env: {
    VITE_LOAN_APPLICATION_ENDPOINT: undefined,
  },
});

import { config, getApiEndpoint } from './env';

describe('Environment Configuration', () => {
  beforeEach(() => {
    vi.stubGlobal('import.meta', {
      env: {
        VITE_LOAN_APPLICATION_ENDPOINT: undefined,
      },
    });
  });

  it('should use default value when environment variable is not set', () => {
    expect(config.api.loanApplicationEndpoint).toBe(
      'http://localhost:3001/api/applications'
    );
  });

  it('getApiEndpoint should return the endpoint', () => {
    const endpoint = getApiEndpoint();
    expect(endpoint).toBe('http://localhost:3001/api/applications');
  });

  it('should have the correct structure', () => {
    expect(config).toHaveProperty('api');
    expect(config.api).toHaveProperty('loanApplicationEndpoint');
    expect(typeof config.api.loanApplicationEndpoint).toBe('string');
  });

  it('getApiEndpoint should return a string', () => {
    const endpoint = getApiEndpoint();
    expect(typeof endpoint).toBe('string');
    expect(endpoint.length).toBeGreaterThan(0);
  });
});
