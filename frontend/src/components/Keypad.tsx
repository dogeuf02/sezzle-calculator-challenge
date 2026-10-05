import React from 'react';
import { BinaryOperation } from '../services/types';
import './Keypad.css';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onBinaryOperation: (op: BinaryOperation) => void;
  onSqrt: () => void;
  onClear: () => void;
  onDelete: () => void;
  onCalculate: () => void;
  disabled: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onDecimal,
  onBinaryOperation,
  onSqrt,
  onClear,
  onDelete,
  onCalculate,
  disabled,
}) => {
  return (
    <div className="calculator-keypad-grid">
      {/* Row 1 */}
      <button className="btn btn-action" onClick={onClear} disabled={disabled}>C</button>
      <button className="btn btn-action" onClick={onDelete} disabled={disabled} aria-label="Backspace">⌫</button>
      <button className="btn btn-action" onClick={onSqrt} disabled={disabled}>√</button>
      <button className="btn btn-op" onClick={() => onBinaryOperation('divide')} disabled={disabled}>÷</button>

      {/* Row 2 */}
      <button className="btn btn-num" onClick={() => onDigit('7')} disabled={disabled}>7</button>
      <button className="btn btn-num" onClick={() => onDigit('8')} disabled={disabled}>8</button>
      <button className="btn btn-num" onClick={() => onDigit('9')} disabled={disabled}>9</button>
      <button className="btn btn-op" onClick={() => onBinaryOperation('multiply')} disabled={disabled}>×</button>

      {/* Row 3 */}
      <button className="btn btn-num" onClick={() => onDigit('4')} disabled={disabled}>4</button>
      <button className="btn btn-num" onClick={() => onDigit('5')} disabled={disabled}>5</button>
      <button className="btn btn-num" onClick={() => onDigit('6')} disabled={disabled}>6</button>
      <button className="btn btn-op" onClick={() => onBinaryOperation('subtract')} disabled={disabled}>−</button>

      {/* Row 4 */}
      <button className="btn btn-num" onClick={() => onDigit('1')} disabled={disabled}>1</button>
      <button className="btn btn-num" onClick={() => onDigit('2')} disabled={disabled}>2</button>
      <button className="btn btn-num" onClick={() => onDigit('3')} disabled={disabled}>3</button>
      <button className="btn btn-op" onClick={() => onBinaryOperation('add')} disabled={disabled}>+</button>

      {/* Row 5 */}
      <button className="btn btn-action" onClick={() => onBinaryOperation('percentage')} disabled={disabled}>%</button>
      <button className="btn btn-action" onClick={() => onBinaryOperation('power')} disabled={disabled}>xʸ</button>
      <button className="btn btn-num" onClick={() => onDigit('0')} disabled={disabled}>0</button>
      <button className="btn btn-num" onClick={onDecimal} disabled={disabled}>.</button>
      <button className="btn btn-equals btn-span-4" onClick={onCalculate} disabled={disabled}>=</button>
    </div>
  );
};