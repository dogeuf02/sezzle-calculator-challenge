package calculator_test

import (
	"errors"
	"math"
	"testing"

	"github.com/dogeuf02/sezzle-calculator-challenge/backend/internal/calculator"
)

func TestCalculatorService(t *testing.T) {
	svc := calculator.NewService()

	t.Run("Add", func(t *testing.T) {
		tests := []struct {
			name        string
			a, b        float64
			expected    float64
			expectedErr error
		}{
			{"positive numbers", 10, 5, 15, nil},
			{"negative numbers", -10, -5, -15, nil},
			{"floating point", 0.1, 0.2, 0.30000000000000004, nil},
			{"overflow check", math.MaxFloat64, math.MaxFloat64, 0, calculator.ErrResultOverflow},
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				res, err := svc.Add(tt.a, tt.b)
				if !errors.Is(err, tt.expectedErr) {
					t.Fatalf("expected error %v, got %v", tt.expectedErr, err)
				}
				if tt.expectedErr == nil && res != tt.expected {
					t.Errorf("expected %v, got %v", tt.expected, res)
				}
			})
		}
	})

	t.Run("Subtract", func(t *testing.T) {
		tests := []struct {
			name        string
			a, b        float64
			expected    float64
			expectedErr error
		}{
			{"standard subtraction", 10, 4, 6, nil},
			{"negative result", 4, 10, -6, nil},
			{"subtract negative", 5, -5, 10, nil},
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				res, err := svc.Subtract(tt.a, tt.b)
				if !errors.Is(err, tt.expectedErr) {
					t.Fatalf("expected error %v, got %v", tt.expectedErr, err)
				}
				if res != tt.expected {
					t.Errorf("expected %v, got %v", tt.expected, res)
				}
			})
		}
	})

	t.Run("Multiply", func(t *testing.T) {
		tests := []struct {
			name        string
			a, b        float64
			expected    float64
			expectedErr error
		}{
			{"standard multiplication", 6, 7, 42, nil},
			{"multiply by zero", 100, 0, 0, nil},
			{"multiply negatives", -4, -5, 20, nil},
			{"overflow check", math.MaxFloat64, 2, 0, calculator.ErrResultOverflow},
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				res, err := svc.Multiply(tt.a, tt.b)
				if !errors.Is(err, tt.expectedErr) {
					t.Fatalf("expected error %v, got %v", tt.expectedErr, err)
				}
				if tt.expectedErr == nil && res != tt.expected {
					t.Errorf("expected %v, got %v", tt.expected, res)
				}
			})
		}
	})

	t.Run("Divide", func(t *testing.T) {
		tests := []struct {
			name        string
			a, b        float64
			expected    float64
			expectedErr error
		}{
			{"valid division", 10, 2, 5, nil},
			{"negative division", -10, 2, -5, nil},
			{"division by zero", 10, 0, 0, calculator.ErrDivisionByZero},
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				res, err := svc.Divide(tt.a, tt.b)
				if !errors.Is(err, tt.expectedErr) {
					t.Fatalf("expected error %v, got %v", tt.expectedErr, err)
				}
				if tt.expectedErr == nil && res != tt.expected {
					t.Errorf("expected %v, got %v", tt.expected, res)
				}
			})
		}
	})

	t.Run("Power", func(t *testing.T) {
		tests := []struct {
			name        string
			a, b        float64
			expected    float64
			expectedErr error
		}{
			{"integer power", 2, 3, 8, nil},
			{"power of zero", 5, 0, 1, nil},
			{"invalid complex power", -4, 0.5, 0, calculator.ErrInvalidExponent},
			{"overflow power", 1e200, 2, 0, calculator.ErrResultOverflow},
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				res, err := svc.Power(tt.a, tt.b)
				if !errors.Is(err, tt.expectedErr) {
					t.Fatalf("expected error %v, got %v", tt.expectedErr, err)
				}
				if tt.expectedErr == nil && res != tt.expected {
					t.Errorf("expected %v, got %v", tt.expected, res)
				}
			})
		}
	})

	t.Run("Sqrt", func(t *testing.T) {
		tests := []struct {
			name        string
			a           float64
			expected    float64
			expectedErr error
		}{
			{"valid sqrt", 25, 5, nil},
			{"zero sqrt", 0, 0, nil},
			{"negative sqrt", -4, 0, calculator.ErrNegativeSquareRoot},
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				res, err := svc.Sqrt(tt.a)
				if !errors.Is(err, tt.expectedErr) {
					t.Fatalf("expected error %v, got %v", tt.expectedErr, err)
				}
				if tt.expectedErr == nil && res != tt.expected {
					t.Errorf("expected %v, got %v", tt.expected, res)
				}
			})
		}
	})

	t.Run("Percentage", func(t *testing.T) {
		res, err := svc.Percentage(200, 15)
		if err != nil || res != 30 {
			t.Fatalf("expected 30, got %v (err: %v)", res, err)
		}
	})
}
