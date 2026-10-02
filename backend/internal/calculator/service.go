package calculator

import (
	"errors"
	"math"
)

const precisionFactor = 1e12

var (
	ErrDivisionByZero     = errors.New("cannot divide by zero")
	ErrNegativeSquareRoot = errors.New("cannot calculate square root of a negative number")
	ErrInvalidExponent    = errors.New("result is not a real number")
	ErrResultOverflow     = errors.New("calculation resulted in overflow or underflow")
)

// Calculator defines the contract for all arithmetic operations.
type Calculator interface {
	Add(a, b float64) (float64, error)
	Subtract(a, b float64) (float64, error)
	Multiply(a, b float64) (float64, error)
	Divide(a, b float64) (float64, error)
	Power(a, b float64) (float64, error)
	Sqrt(a float64) (float64, error)
	Percentage(a, b float64) (float64, error)
}

type service struct{}

// NewService returns a new instance of Calculator.
func NewService() Calculator {
	return &service{}
}

func (s *service) Add(a, b float64) (float64, error) {
	res := a + b
	if math.IsInf(res, 0) || math.IsNaN(res) {
		return 0, ErrResultOverflow
	}
	return roundPrecision(res), nil
}

func (s *service) Subtract(a, b float64) (float64, error) {
	res := a - b
	if math.IsInf(res, 0) || math.IsNaN(res) {
		return 0, ErrResultOverflow
	}
	return roundPrecision(res), nil
}

func (s *service) Multiply(a, b float64) (float64, error) {
	res := a * b
	if math.IsInf(res, 0) || math.IsNaN(res) {
		return 0, ErrResultOverflow
	}
	return roundPrecision(res), nil
}

func (s *service) Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, ErrDivisionByZero
	}
	res := a / b
	if math.IsInf(res, 0) || math.IsNaN(res) {
		return 0, ErrResultOverflow
	}
	return roundPrecision(res), nil
}

func (s *service) Power(a, b float64) (float64, error) {
	res := math.Pow(a, b)
	if math.IsNaN(res) {
		return 0, ErrInvalidExponent
	}
	if math.IsInf(res, 0) {
		return 0, ErrResultOverflow
	}
	return roundPrecision(res), nil
}

func (s *service) Sqrt(a float64) (float64, error) {
	if a < 0 {
		return 0, ErrNegativeSquareRoot
	}
	res := math.Sqrt(a)
	if math.IsNaN(res) || math.IsInf(res, 0) {
		return 0, ErrResultOverflow
	}
	return roundPrecision(res), nil
}

func (s *service) Percentage(a, b float64) (float64, error) {
	res := (a * b) / 100.0
	if math.IsInf(res, 0) || math.IsNaN(res) {
		return 0, ErrResultOverflow
	}
	return roundPrecision(res), nil
}

func roundPrecision(val float64) float64 {
	if math.IsInf(val, 0) || math.IsNaN(val) {
		return val
	}
	// Round to 12 decimal places to eliminate binary float artifacts (e.g. 0.30000000000000004 -> 0.3)
	return math.Round(val*precisionFactor) / precisionFactor
}
