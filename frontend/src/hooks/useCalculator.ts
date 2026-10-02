import { useState } from 'react';
import { executeBinaryOperation, executeUnaryOperation } from '../services/calculatorApi';
import { BinaryOperation, CalculatorApiError } from '../services/types';

export interface CalculatorState {
  display: string;
  previousOperand: number | null;
  operation: BinaryOperation | null;
  waitingForSecondOperand: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useCalculator() {
  const [display, setDisplay] = useState<string>('0');
  const [previousOperand, setPreviousOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<BinaryOperation | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearAll = () => {
    setDisplay('0');
    setPreviousOperand(null);
    setOperation(null);
    setWaitingForSecondOperand(false);
    setError(null);
  };

        const deleteLastDigit = () => {
    setError(null);

    // Si se acaba de seleccionar un operador, no se borra nada
    if (waitingForSecondOperand) {
        return;
    }

    setDisplay((prev) => {
        // Si ya es un solo dígito o un número negativo de un dígito (ej: "-7")
        if (prev.length <= 1 || (prev.length === 2 && prev.startsWith('-'))) {
        return '0';
        }
        return prev.slice(0, -1);
    });
    };

  
  const inputDigit = (digit: string) => {
    setError(null);
    setDisplay((prev) => {
      if (waitingForSecondOperand) {
        setWaitingForSecondOperand(false);
        return digit;
      }
      return prev === '0' ? digit : prev + digit;
    });
  };

  const inputDecimal = () => {
    setError(null);
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay((prev) => prev + '.');
    }
  };

  const executeCalculation = async () => {
    if (!operation || previousOperand === null) {
      return;
    }

    const currentOperand = parseFloat(display);
    setIsLoading(true);
    setError(null);

    try {
      const result = await executeBinaryOperation(operation, previousOperand, currentOperand);
      setDisplay(String(result));
      setPreviousOperand(null);
      setOperation(null);
      setWaitingForSecondOperand(true);
    } catch (err) {
      if (err instanceof CalculatorApiError) {
        setError(err.message);
      } else {
        setError('Network error: Unable to reach backend service');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setBinaryOperation = (nextOperation: BinaryOperation) => {
    setError(null);
    const currentValue = parseFloat(display);

    if (previousOperand === null) {
      setPreviousOperand(currentValue);
    } else if (operation && !waitingForSecondOperand) {
      // Se evalúa la operación acumulada si se encadenan operadores
      executeCalculation();
      return;
    }

    setOperation(nextOperation);
    setWaitingForSecondOperand(true);
  };

  const executeSquareRoot = async () => {
    const operand = parseFloat(display);
    setIsLoading(true);
    setError(null);

    try {
      const result = await executeUnaryOperation('sqrt', operand);
      setDisplay(String(result));
      setWaitingForSecondOperand(true);
    } catch (err) {
      if (err instanceof CalculatorApiError) {
        setError(err.message);
      } else {
        setError('Network error: Unable to reach backend service');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    display,
    previousOperand,
    operation,
    isLoading,
    error,
    inputDigit,
    inputDecimal,
    setBinaryOperation,
    executeCalculation,
    executeSquareRoot,
    deleteLastDigit,
    clearAll,
  };
}