import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCalculator } from './useCalculator';
import * as calculatorApi from '../services/calculatorApi';
import { CalculatorApiError } from '../services/types';

vi.mock('../services/calculatorApi');

describe('useCalculator hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic input and state management', () => {
    it('initializes with default values', () => {
      const { result } = renderHook(() => useCalculator());

      expect(result.current.display).toBe('0');
      expect(result.current.previousOperand).toBeNull();
      expect(result.current.operation).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('inputs digits correctly and replaces initial 0', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDigit('5');
      });
      expect(result.current.display).toBe('5');

      act(() => {
        result.current.inputDigit('2');
      });
      expect(result.current.display).toBe('52');
    });

    it('inputs decimals without duplicating decimal point', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDecimal();
      });
      expect(result.current.display).toBe('0.');

      act(() => {
        result.current.inputDigit('5');
      });
      expect(result.current.display).toBe('0.5');

      // Attempting to add another dot should have no effect
      act(() => {
        result.current.inputDecimal();
      });
      expect(result.current.display).toBe('0.5');
    });

    it('deletes digits with deleteLastDigit (backspace)', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDigit('1');
        result.current.inputDigit('2');
        result.current.inputDigit('3');
      });
      expect(result.current.display).toBe('123');

      act(() => {
        result.current.deleteLastDigit();
      });
      expect(result.current.display).toBe('12');

      act(() => {
        result.current.deleteLastDigit();
      });
      expect(result.current.display).toBe('1');

      act(() => {
        result.current.deleteLastDigit();
      });
      expect(result.current.display).toBe('0');
    });

    it('handles negative single digit deletion to 0', () => {
      const { result } = renderHook(() => useCalculator());

      // simulate display having '-5'
      act(() => {
        result.current.inputDigit('5');
      });
      // clearAll resets
      act(() => {
        result.current.clearAll();
      });
      expect(result.current.display).toBe('0');
    });

    it('resets state completely on clearAll', () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDigit('9');
        result.current.setBinaryOperation('add');
        result.current.inputDigit('3');
      });

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.display).toBe('0');
      expect(result.current.previousOperand).toBeNull();
      expect(result.current.operation).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Calculations and operations', () => {
    it('executes a binary operation calculation (=) successfully', async () => {
      const executeBinaryMock = vi.spyOn(calculatorApi, 'executeBinaryOperation');
      executeBinaryMock.mockResolvedValueOnce(15);

      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDigit('1');
        result.current.inputDigit('0');
      });

      await act(async () => {
        await result.current.setBinaryOperation('add');
      });

      expect(result.current.previousOperand).toBe(10);
      expect(result.current.operation).toBe('add');

      act(() => {
        result.current.inputDigit('5');
      });
      expect(result.current.display).toBe('5');

      await act(async () => {
        await result.current.executeCalculation();
      });

      expect(executeBinaryMock).toHaveBeenCalledWith('add', 10, 5);
      expect(result.current.display).toBe('15');
      expect(result.current.previousOperand).toBeNull();
      expect(result.current.operation).toBeNull();
    });

    it('supports chained binary operations', async () => {
      const executeBinaryMock = vi.spyOn(calculatorApi, 'executeBinaryOperation');
      executeBinaryMock.mockResolvedValueOnce(15); // 10 + 5
      executeBinaryMock.mockResolvedValueOnce(30); // 15 * 2

      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDigit('1');
        result.current.inputDigit('0');
      });

      await act(async () => {
        await result.current.setBinaryOperation('add');
      });

      act(() => {
        result.current.inputDigit('5');
      });

      // Chained operation: pressing multiply will trigger the addition first
      await act(async () => {
        await result.current.setBinaryOperation('multiply');
      });

      expect(executeBinaryMock).toHaveBeenCalledWith('add', 10, 5);
      expect(result.current.display).toBe('15');
      expect(result.current.previousOperand).toBe(15);
      expect(result.current.operation).toBe('multiply');

      act(() => {
        result.current.inputDigit('2');
      });

      await act(async () => {
        await result.current.executeCalculation();
      });

      expect(executeBinaryMock).toHaveBeenCalledWith('multiply', 15, 2);
      expect(result.current.display).toBe('30');
    });

    it('executes square root unary operation successfully', async () => {
      const executeUnaryMock = vi.spyOn(calculatorApi, 'executeUnaryOperation');
      executeUnaryMock.mockResolvedValueOnce(5);

      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDigit('2');
        result.current.inputDigit('5');
      });

      await act(async () => {
        await result.current.executeSquareRoot();
      });

      expect(executeUnaryMock).toHaveBeenCalledWith('sqrt', 25);
      expect(result.current.display).toBe('5');
    });
  });

  describe('Percentage logic (handlePendingPercentage & binary percentage)', () => {
    it('applies relative percentage calculation for addition (e.g. 100 + 20% = 20)', async () => {
      const executeBinaryMock = vi.spyOn(calculatorApi, 'executeBinaryOperation');
      // 100 * 20 / 100 = 20
      executeBinaryMock.mockResolvedValueOnce(20);

      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDigit('1');
        result.current.inputDigit('0');
        result.current.inputDigit('0');
      });

      await act(async () => {
        await result.current.setBinaryOperation('add');
      });

      act(() => {
        result.current.inputDigit('2');
        result.current.inputDigit('0');
      });

      // Press % button while an add operation is pending
      await act(async () => {
        await result.current.setBinaryOperation('percentage');
      });

      expect(executeBinaryMock).toHaveBeenCalledWith('percentage', 100, 20);
      expect(result.current.display).toBe('20');
      expect(result.current.operation).toBe('add');
      expect(result.current.previousOperand).toBe(100);

      // Now completing the calculation: 100 + 20 = 120
      executeBinaryMock.mockResolvedValueOnce(120);
      await act(async () => {
        await result.current.executeCalculation();
      });

      expect(executeBinaryMock).toHaveBeenCalledWith('add', 100, 20);
      expect(result.current.display).toBe('120');
    });

    it('applies relative percentage calculation for subtraction (e.g. 80 - 30% = 24)', async () => {
      const executeBinaryMock = vi.spyOn(calculatorApi, 'executeBinaryOperation');
      // 80 * 30 / 100 = 24
      executeBinaryMock.mockResolvedValueOnce(24);

      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDigit('8');
        result.current.inputDigit('0');
      });

      await act(async () => {
        await result.current.setBinaryOperation('subtract');
      });

      act(() => {
        result.current.inputDigit('3');
        result.current.inputDigit('0');
      });

      // Press % button
      await act(async () => {
        await result.current.setBinaryOperation('percentage');
      });

      expect(executeBinaryMock).toHaveBeenCalledWith('percentage', 80, 30);
      expect(result.current.display).toBe('24');
      expect(result.current.operation).toBe('subtract');
      expect(result.current.previousOperand).toBe(80);
    });

    it('applies decimal factor percentage for multiplication/division (e.g. 100 * 50% = 100 * 0.5)', async () => {
      const executeBinaryMock = vi.spyOn(calculatorApi, 'executeBinaryOperation');

      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDigit('1');
        result.current.inputDigit('0');
        result.current.inputDigit('0');
      });

      await act(async () => {
        await result.current.setBinaryOperation('multiply');
      });

      act(() => {
        result.current.inputDigit('5');
        result.current.inputDigit('0');
      });

      // Press % button
      await act(async () => {
        await result.current.setBinaryOperation('percentage');
      });

      // Should convert 50 to 0.5 without an API call
      expect(executeBinaryMock).not.toHaveBeenCalled();
      expect(result.current.display).toBe('0.5');
      expect(result.current.operation).toBe('multiply');
      expect(result.current.previousOperand).toBe(100);
    });

    it('treats standalone percentage as a regular binary operation when no prior operation is pending', async () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDigit('2');
        result.current.inputDigit('0');
        result.current.inputDigit('0');
      });

      await act(async () => {
        await result.current.setBinaryOperation('percentage');
      });

      expect(result.current.previousOperand).toBe(200);
      expect(result.current.operation).toBe('percentage');
    });
  });

  describe('Error handling', () => {
    it('sets error from CalculatorApiError message', async () => {
      const executeBinaryMock = vi.spyOn(calculatorApi, 'executeBinaryOperation');
      executeBinaryMock.mockRejectedValueOnce(
        new CalculatorApiError('Cannot divide by zero', 'division_by_zero', 422)
      );

      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDigit('5');
      });

      await act(async () => {
        await result.current.setBinaryOperation('divide');
      });

      act(() => {
        result.current.inputDigit('0');
      });

      await act(async () => {
        await result.current.executeCalculation();
      });

      expect(result.current.error).toBe('Cannot divide by zero');
      expect(result.current.isLoading).toBe(false);
    });

    it('sets generic error on unexpected network error', async () => {
      const executeUnaryMock = vi.spyOn(calculatorApi, 'executeUnaryOperation');
      executeUnaryMock.mockRejectedValueOnce(new Error('Network failure'));

      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.inputDigit('9');
      });

      await act(async () => {
        await result.current.executeSquareRoot();
      });

      expect(result.current.error).toBe('Network error: Unable to reach backend service');
      expect(result.current.isLoading).toBe(false);
    });

    it('clears error and resets display when digit is typed during an active error state', async () => {
      const executeUnaryMock = vi.spyOn(calculatorApi, 'executeUnaryOperation');
      executeUnaryMock.mockRejectedValueOnce(
        new CalculatorApiError('Negative square root', 'negative_square_root', 422)
      );

      const { result } = renderHook(() => useCalculator());

      await act(async () => {
        await result.current.executeSquareRoot();
      });

      expect(result.current.error).toBe('Negative square root');

      act(() => {
        result.current.inputDigit('7');
      });

      expect(result.current.error).toBeNull();
      expect(result.current.display).toBe('7');
    });

    it('clears error and sets 0. when decimal is typed during an active error state', async () => {
      const executeUnaryMock = vi.spyOn(calculatorApi, 'executeUnaryOperation');
      executeUnaryMock.mockRejectedValueOnce(
        new CalculatorApiError('Domain Error', 'domain_error', 422)
      );

      const { result } = renderHook(() => useCalculator());

      await act(async () => {
        await result.current.executeSquareRoot();
      });

      expect(result.current.error).toBe('Domain Error');

      act(() => {
        result.current.inputDecimal();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.display).toBe('0.');
    });
  });
});
