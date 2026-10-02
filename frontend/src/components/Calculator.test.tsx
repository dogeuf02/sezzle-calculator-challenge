import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Calculator } from './Calculator';

describe('Calculator Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial display with 0 and calculator title', () => {
    render(<Calculator />);
    expect(screen.getByText('Sezzle Calc')).toBeInTheDocument();
    expect(screen.getByTestId('display-value')).toHaveTextContent('0');
  });

  it('handles user digit inputs, decimal, and backspace correctly', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    // Click 1, 2, ., 5 -> should display 12.5
    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '.' }));
    await user.click(screen.getByRole('button', { name: '5' }));

    expect(screen.getByText('12.5')).toBeInTheDocument();

    // Click backspace -> should remove 5 and display 12.
    const backspaceBtn = screen.getByRole('button', { name: /backspace/i });
    await user.click(backspaceBtn);
    expect(screen.getByText('12.')).toBeInTheDocument();

    // Click Clear (C) -> reset to 0
    await user.click(screen.getByRole('button', { name: 'C' }));
    expect(screen.getByTestId('display-value')).toHaveTextContent('0');
  });

  it('executes a successful calculation via the mocked API', async () => {
    const user = userEvent.setup();

    // Mock successful API response for addition
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 15 }),
    });

    render(<Calculator />);

    // Enter 10 + 5 =
    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/add'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ a: 10, b: 5 }),
      })
    );
  });

  it('displays an error alert banner when the backend returns a 422 error', async () => {
    const user = userEvent.setup();

    // Mock backend returning 422 Division by Zero
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: async () => ({
        error: 'division_by_zero',
        message: 'Cannot divide by zero',
      }),
    });

    render(<Calculator />);

    // Enter 10 / 0 =
    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '÷' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    await waitFor(() => {
      const errorBanner = screen.getByRole('alert');
      expect(errorBanner).toBeInTheDocument();
      expect(errorBanner).toHaveTextContent('Cannot divide by zero');
    });
  });
});