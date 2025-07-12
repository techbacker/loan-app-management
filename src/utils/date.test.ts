import { describe, it, expect } from 'vitest';
import { formatDate } from './date';

describe('formatDate utility', () => {
  it('formats date string to DD-MM-YYYY with hyphens', () => {
    const dateString = '2021-08-10';
    const result = formatDate(dateString);
    expect(result).toBe('10-08-2021');
  });

  it('formats another date string correctly', () => {
    const dateString = '2021-12-02';
    const result = formatDate(dateString);
    expect(result).toBe('02-12-2021');
  });

  it('handles single digit day and month with leading zeros', () => {
    const dateString = '2021-03-05';
    const result = formatDate(dateString);
    expect(result).toBe('05-03-2021');
  });

  it('handles December dates correctly', () => {
    const dateString = '2022-12-31';
    const result = formatDate(dateString);
    expect(result).toBe('31-12-2022');
  });

  it('handles January dates correctly', () => {
    const dateString = '2022-01-01';
    const result = formatDate(dateString);
    expect(result).toBe('01-01-2022');
  });

  it('handles different year formats', () => {
    const dateString = '2020-06-15';
    const result = formatDate(dateString);
    expect(result).toBe('15-06-2020');
  });

  it('handles ISO date strings', () => {
    const dateString = '2021-09-15T10:30:00.000Z';
    const result = formatDate(dateString);
    expect(result).toBe('15-09-2021');
  });

  it('handles date strings with time', () => {
    const dateString = '2021-11-25 14:30:00';
    const result = formatDate(dateString);
    expect(result).toBe('25-11-2021');
  });

  it('formats edge case dates correctly', () => {
    const leapYear = '2020-02-29';
    expect(formatDate(leapYear)).toBe('29-02-2020');

    const endOfMonth = '2021-04-30';
    expect(formatDate(endOfMonth)).toBe('30-04-2021');
  });

  it('handles various date formats consistently', () => {
    const testCases = [
      { input: '2021-08-10', expected: '10-08-2021' },
      { input: '2021-12-02', expected: '02-12-2021' },
      { input: '2022-01-15', expected: '15-01-2022' },
      { input: '2020-02-29', expected: '29-02-2020' },
      { input: '2021-07-04', expected: '04-07-2021' },
    ];

    testCases.forEach(({ input, expected }) => {
      expect(formatDate(input)).toBe(expected);
    });
  });
});
