import React from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { Display } from './Display';
import { Keypad } from './Keypad';
import './Calculator.css';

export const Calculator: React.FC = () => {
  const {
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
  } = useCalculator();

  return (
    <main className="calculator-card">
      <header className="calculator-header">
        <h1 className="calculator-title">Sezzle Calc</h1>
      </header>

      <Display
        value={display}
        previousOperand={previousOperand}
        operation={operation}
        error={error}
        isLoading={isLoading}
      />

      <Keypad
        onDigit={inputDigit}
        onDecimal={inputDecimal}
        onBinaryOperation={setBinaryOperation}
        onSqrt={executeSquareRoot}
        onClear={clearAll}
        onDelete={deleteLastDigit}
        onCalculate={executeCalculation}
        disabled={isLoading}
      />
    </main>
  );
};