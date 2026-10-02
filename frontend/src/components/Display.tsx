import React from 'react';
import './Display.css';

interface DisplayProps {
  value: string;
  previousOperand: number | null;
  operation: string | null;
  error: string | null;
  isLoading: boolean;
}

const operationSymbols: Record<string, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
  power: '^',
  percentage: '%',
};

export const Display: React.FC<DisplayProps> = ({
  value,
  previousOperand,
  operation,
  error,
  isLoading,
}) => {
  return (
    <div className="calculator-display-container">
      <div className="calculator-equation-preview">
        {previousOperand !== null && operation ? (
          <span>{`${previousOperand} ${operationSymbols[operation] || operation}`}</span>
        ) : (
          <span>&nbsp;</span>
        )}
      </div>

      <div className="calculator-main-display">
        {isLoading ? (
          <span className="display-loading">Calculating...</span>
        ) : (
          <span className="display-value">{value}</span>
        )}
      </div>

      {error && (
        <div className="calculator-error-banner" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};