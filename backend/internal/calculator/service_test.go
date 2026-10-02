package calculator_test

import (
	"errors"
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
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				res, err := svc.Add(tt.a, tt.b)
				if !errors.Is(err, tt.expectedErr) {
					t.Fatalf("expected error %v, got %v", tt.expectedErr, err)
				}
				if res != tt.expected {
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
			{"division by zero", 10, 0, 0, calculator.ErrDivisionByZero},
		}

		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				res, err := svc.Divide(tt.a, tt.b)
				if !errors.Is(err, tt.expectedErr) {
					t.Fatalf("expected error %v, got %v", tt.expectedErr, err)
				}
				if res != tt.expected {
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
				if res != tt.expected {
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

	t.Run("Power", func(t *testing.T) {
		res, err := svc.Power(2, 3)
		if err != nil || res != 8 {
			t.Fatalf("expected 8, got %v (err: %v)", res, err)
		}

		_, err = svc.Power(-4, 0.5)
		if !errors.Is(err, calculator.ErrInvalidExponent) {
			t.Fatalf("expected ErrInvalidExponent, got %v", err)
		}
	})
}
