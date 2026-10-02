export type BinaryOperation = 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'percentage';
export type UnaryOperation = 'sqrt';

export type OperationType = BinaryOperation | UnaryOperation;

export interface BinaryRequest {
  a: number;
  b: number;
}

export interface UnaryRequest {
  a: number;
}

export interface CalculationResponse {
  result: number;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}

export class CalculatorApiError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'CalculatorApiError';
    this.code = code;
    this.status = status;
  }
}