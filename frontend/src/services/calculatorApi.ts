import {
  BinaryOperation,
  UnaryOperation,
  BinaryRequest,
  UnaryRequest,
  CalculationResponse,
  ApiErrorResponse,
  CalculatorApiError,
} from './types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      throw new CalculatorApiError(
        'Unexpected server response',
        'network_error',
        response.status
      );
    }
    throw new CalculatorApiError(
      errorData.message || 'An error occurred during calculation',
      errorData.error || 'unknown_error',
      response.status
    );
  }
  return response.json() as Promise<T>;
}

export async function executeBinaryOperation(
  operation: BinaryOperation,
  a: number,
  b: number
): Promise<number> {
  const payload: BinaryRequest = { a, b };

  const response = await fetch(`${API_BASE_URL}/${operation}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<CalculationResponse>(response);
  return data.result;
}

export async function executeUnaryOperation(
  operation: UnaryOperation,
  a: number
): Promise<number> {
  const payload: UnaryRequest = { a };

  const response = await fetch(`${API_BASE_URL}/${operation}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<CalculationResponse>(response);
  return data.result;
}