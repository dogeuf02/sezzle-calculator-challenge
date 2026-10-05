import { useReducer } from 'react';
import { executeBinaryOperation, executeUnaryOperation } from '../services/calculatorApi';
import { BinaryOperation, CalculatorApiError } from '../services/types';
import { formatResultValue } from '../utils/formatDisplayValue';

export interface CalculatorState {
  display: string;
  previousOperand: number | null;
  operation: BinaryOperation | null;
  waitingForSecondOperand: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: CalculatorState = {
  display: '0',
  previousOperand: null,
  operation: null,
  waitingForSecondOperand: false,
  isLoading: false,
  error: null,
};

type Action =
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'INPUT_DIGIT'; digit: string }
  | { type: 'INPUT_DECIMAL' }
  | { type: 'DELETE_LAST_DIGIT' }
  | { type: 'PREPARE_OPERATION'; operation: BinaryOperation }
  | { type: 'SET_RESULT'; result: number; keepOperation?: BinaryOperation }
  | { type: 'SET_PERCENTAGE_DISPLAY'; display: string };

function calculatorReducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'CLEAR_ALL':
      return { ...initialState };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };

    case 'INPUT_DIGIT': {
      if (state.error !== null) {
        return { ...initialState, display: action.digit };
      }
      if (state.waitingForSecondOperand) {
        return {
          ...state,
          display: action.digit,
          waitingForSecondOperand: false,
          error: null,
        };
      }
      return {
        ...state,
        display: state.display === '0' ? action.digit : state.display + action.digit,
        error: null,
      };
    }

    case 'INPUT_DECIMAL': {
      if (state.error !== null) {
        return { ...initialState, display: '0.' };
      }
      if (state.waitingForSecondOperand) {
        return {
          ...state,
          display: '0.',
          waitingForSecondOperand: false,
          error: null,
        };
      }
      if (!state.display.includes('.')) {
        return { ...state, display: state.display + '.' };
      }
      return state;
    }

    case 'DELETE_LAST_DIGIT': {
      if (state.waitingForSecondOperand) return state;
      const nextDisplay =
        state.display.length <= 1 || (state.display.length === 2 && state.display.startsWith('-'))
          ? '0'
          : state.display.slice(0, -1);
      return { ...state, display: nextDisplay, error: null };
    }

    case 'PREPARE_OPERATION': {
      const current = parseFloat(state.display);
      return {
        ...state,
        previousOperand: state.previousOperand === null ? current : state.previousOperand,
        operation: action.operation,
        waitingForSecondOperand: true,
        error: null,
      };
    }

    case 'SET_RESULT':
      return {
        ...state,
        display: formatResultValue(action.result),
        previousOperand: action.keepOperation ? action.result : null,
        operation: action.keepOperation ?? null,
        waitingForSecondOperand: true,
        isLoading: false,
      };

    case 'SET_PERCENTAGE_DISPLAY':
      return {
        ...state,
        display: action.display,
        waitingForSecondOperand: true,
        isLoading: false,
      };

    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const runAsyncCalculation = async (calcFn: () => Promise<number>): Promise<number | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      return await calcFn();
    } catch (err) {
      if (err instanceof CalculatorApiError) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Network error: Unable to reach backend service' });
      }
      return null;
    }
  };

  const clearAll = () => dispatch({ type: 'CLEAR_ALL' });
  const deleteLastDigit = () => dispatch({ type: 'DELETE_LAST_DIGIT' });
  const inputDigit = (digit: string) => dispatch({ type: 'INPUT_DIGIT', digit });
  const inputDecimal = () => dispatch({ type: 'INPUT_DECIMAL' });

  const executeCalculation = async () => {
    if (!state.operation || state.previousOperand === null) return;
    const currentOperand = parseFloat(state.display);
    const result = await runAsyncCalculation(() =>
      executeBinaryOperation(state.operation!, state.previousOperand!, currentOperand)
    );
    if (result !== null) {
      dispatch({ type: 'SET_RESULT', result });
    }
  };

  const setBinaryOperation = async (nextOperation: BinaryOperation) => {
    const currentValue = parseFloat(state.display);

    // Handler % with previous operation
    if (nextOperation === 'percentage' && state.operation !== null && state.previousOperand !== null) {
      if (state.operation === 'add' || state.operation === 'subtract') {
        const percentResult = await runAsyncCalculation(() =>
          executeBinaryOperation('percentage', state.previousOperand!, currentValue)
        );
        if (percentResult !== null) {
          dispatch({ type: 'SET_PERCENTAGE_DISPLAY', display: formatResultValue(percentResult) });
        }
      } else {
        const decimalValue = currentValue / 100;
        dispatch({ type: 'SET_PERCENTAGE_DISPLAY', display: formatResultValue(decimalValue) });
      }
      return;
    }

    // Chained operations 
    if (state.previousOperand !== null && state.operation && !state.waitingForSecondOperand) {
      const result = await runAsyncCalculation(() =>
        executeBinaryOperation(state.operation!, state.previousOperand!, currentValue)
      );
      if (result !== null) {
        dispatch({ type: 'SET_RESULT', result, keepOperation: nextOperation });
      }
      return;
    }

    dispatch({ type: 'PREPARE_OPERATION', operation: nextOperation });
  };

  const executeSquareRoot = async () => {
    const operand = parseFloat(state.display);
    const result = await runAsyncCalculation(() => executeUnaryOperation('sqrt', operand));
    if (result !== null) {
      dispatch({ type: 'SET_RESULT', result });
    }
  };

  return {
    ...state,
    inputDigit,
    inputDecimal,
    setBinaryOperation,
    executeCalculation,
    executeSquareRoot,
    deleteLastDigit,
    clearAll,
  };
}