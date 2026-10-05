import { describe, it, expect } from 'vitest';
import { formatDisplayValue, formatResultValue } from './formatDisplayValue';

describe('formatDisplayValue', () => {
  it('returns special values directly (Infinity, -Infinity, NaN)', () => {
    expect(formatDisplayValue('Infinity')).toBe('Infinity');
    expect(formatDisplayValue('-Infinity')).toBe('-Infinity');
    expect(formatDisplayValue('NaN')).toBe('NaN');
  });

  it('returns non-numeric strings as is', () => {
    expect(formatDisplayValue('hello')).toBe('hello');
    expect(formatDisplayValue('')).toBe('');
    expect(formatDisplayValue('abc123')).toBe('abc123');
  });

  it('preserves numbers ending with decimal point while user is typing', () => {
    expect(formatDisplayValue('12.')).toBe('12.');
    expect(formatDisplayValue('0.')).toBe('0.');
    expect(formatDisplayValue('-5.')).toBe('-5.');
  });

  it('formats regular numbers within standard range correctly', () => {
    expect(formatDisplayValue('0')).toBe('0');
    expect(formatDisplayValue('123')).toBe('123');
    expect(formatDisplayValue('-456')).toBe('-456');
    expect(formatDisplayValue('3.14159')).toBe('3.14159');
  });

  it('formats very large numbers (>= 1e11) into scientific exponential notation', () => {
    const formatted = formatDisplayValue('100000000000');
    expect(formatted).toBe('1e+11');

    const formattedLarge = formatDisplayValue('123456789012');
    expect(formattedLarge).toBe('1.2346e+11');
  });

  it('formats negative very large numbers into scientific notation', () => {
    const formatted = formatDisplayValue('-100000000000');
    expect(formatted).toBe('-1e+11');
  });

  it('formats very small numbers (< 1e-6 and != 0) into scientific notation', () => {
    const formatted = formatDisplayValue('0.0000005');
    expect(formatted).toBe('5e-7');

    const formattedSmall = formatDisplayValue('-0.0000001234');
    expect(formattedSmall).toBe('-1.234e-7');
  });

  it('does not format 0 into scientific notation', () => {
    expect(formatDisplayValue('0')).toBe('0');
    expect(formatDisplayValue('0.0')).toBe('0.0');
  });

  it('truncates decimal parts beyond 12 digits using parseFloat(num.toFixed(12))', () => {
    // 13 decimal places
    const input = '0.1234567890123';
    expect(formatDisplayValue(input)).toBe('0.123456789012');

    // 14 decimal places with rounding
    const inputRounding = '0.1234567890129';
    expect(formatDisplayValue(inputRounding)).toBe('0.123456789013');
  });

  it('handles exponential input strings properly', () => {
    expect(formatDisplayValue('1e5')).toBe('1e5');
    expect(formatDisplayValue('1.5e12')).toBe('1.5e+12');
  });
});

describe('formatResultValue', () => {
  it('handles NaN and Infinities', () => {
    expect(formatResultValue(NaN)).toBe('NaN');
    expect(formatResultValue(Infinity)).toBe('Infinity');
    expect(formatResultValue(-Infinity)).toBe('-Infinity');
  });

  it('formats large numbers (>= 1e11) to scientific notation', () => {
    expect(formatResultValue(1e11)).toBe('1e+11');
    expect(formatResultValue(1.5e12)).toBe('1.5e+12');
    expect(formatResultValue(-2e11)).toBe('-2e+11');
  });

  it('formats very small numbers (< 1e-6 and !== 0) to scientific notation', () => {
    expect(formatResultValue(0.0000005)).toBe('5e-7');
    expect(formatResultValue(-0.0000002)).toBe('-2e-7');
  });

  it('normalizes standard results within 15 precision digits', () => {
    expect(formatResultValue(42)).toBe('42');
    expect(formatResultValue(0)).toBe('0');
    expect(formatResultValue(-15.5)).toBe('-15.5');
    // Binary floating point resolution (e.g., 0.1 + 0.2)
    expect(formatResultValue(0.1 + 0.2)).toBe('0.3');
  });

  it('formats standard decimal results correctly without unnecessary scientific notation', () => {
    expect(formatResultValue(123456.789)).toBe('123456.789');
  });
});
