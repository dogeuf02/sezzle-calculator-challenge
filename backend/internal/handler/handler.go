package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/dogeuf02/sezzle-calculator-challenge/backend/internal/calculator"
)

type CalculatorHandler struct {
	service calculator.Calculator
}

func NewCalculatorHandler(svc calculator.Calculator) *CalculatorHandler {
	return &CalculatorHandler{service: svc}
}

func (h *CalculatorHandler) writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func (h *CalculatorHandler) writeError(w http.ResponseWriter, status int, errCode, message string) {
	h.writeJSON(w, status, ErrorResponse{
		Error:   errCode,
		Message: message,
	})
}

func (h *CalculatorHandler) parseBinary(w http.ResponseWriter, r *http.Request) (*BinaryRequest, bool) {
	if r.Method != http.MethodPost {
		h.writeError(w, http.StatusMethodNotAllowed, "method_not_allowed", "Method not allowed")
		return nil, false
	}

	var req BinaryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.writeError(w, http.StatusBadRequest, "invalid_payload", "Malformed JSON body")
		return nil, false
	}

	if req.A == nil || req.B == nil {
		h.writeError(w, http.StatusBadRequest, "missing_operands", "Both 'a' and 'b' parameters are required")
		return nil, false
	}

	return &req, true
}

func (h *CalculatorHandler) parseUnary(w http.ResponseWriter, r *http.Request) (*UnaryRequest, bool) {
	if r.Method != http.MethodPost {
		h.writeError(w, http.StatusMethodNotAllowed, "method_not_allowed", "Method not allowed")
		return nil, false
	}

	var req UnaryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.writeError(w, http.StatusBadRequest, "invalid_payload", "Malformed JSON body")
		return nil, false
	}

	if req.A == nil {
		h.writeError(w, http.StatusBadRequest, "missing_operands", "Parameter 'a' is required")
		return nil, false
	}

	return &req, true
}

func (h *CalculatorHandler) handleDomainError(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, calculator.ErrDivisionByZero):
		h.writeError(w, http.StatusUnprocessableEntity, "division_by_zero", err.Error())
	case errors.Is(err, calculator.ErrNegativeSquareRoot):
		h.writeError(w, http.StatusUnprocessableEntity, "negative_square_root", err.Error())
	case errors.Is(err, calculator.ErrInvalidExponent):
		h.writeError(w, http.StatusUnprocessableEntity, "invalid_exponent", err.Error())
	case errors.Is(err, calculator.ErrResultOverflow):
		h.writeError(w, http.StatusUnprocessableEntity, "math_overflow", err.Error())
	default:
		h.writeError(w, http.StatusInternalServerError, "internal_error", "An unexpected error occurred")
	}
}

func (h *CalculatorHandler) Add(w http.ResponseWriter, r *http.Request) {
	req, ok := h.parseBinary(w, r)
	if !ok {
		return
	}
	res, err := h.service.Add(*req.A, *req.B)
	if err != nil {
		h.handleDomainError(w, err)
		return
	}
	h.writeJSON(w, http.StatusOK, CalculationResponse{Result: res})
}

func (h *CalculatorHandler) Subtract(w http.ResponseWriter, r *http.Request) {
	req, ok := h.parseBinary(w, r)
	if !ok {
		return
	}
	res, err := h.service.Subtract(*req.A, *req.B)
	if err != nil {
		h.handleDomainError(w, err)
		return
	}
	h.writeJSON(w, http.StatusOK, CalculationResponse{Result: res})
}

func (h *CalculatorHandler) Multiply(w http.ResponseWriter, r *http.Request) {
	req, ok := h.parseBinary(w, r)
	if !ok {
		return
	}
	res, err := h.service.Multiply(*req.A, *req.B)
	if err != nil {
		h.handleDomainError(w, err)
		return
	}
	h.writeJSON(w, http.StatusOK, CalculationResponse{Result: res})
}

func (h *CalculatorHandler) Divide(w http.ResponseWriter, r *http.Request) {
	req, ok := h.parseBinary(w, r)
	if !ok {
		return
	}
	res, err := h.service.Divide(*req.A, *req.B)
	if err != nil {
		h.handleDomainError(w, err)
		return
	}
	h.writeJSON(w, http.StatusOK, CalculationResponse{Result: res})
}

func (h *CalculatorHandler) Power(w http.ResponseWriter, r *http.Request) {
	req, ok := h.parseBinary(w, r)
	if !ok {
		return
	}
	res, err := h.service.Power(*req.A, *req.B)
	if err != nil {
		h.handleDomainError(w, err)
		return
	}
	h.writeJSON(w, http.StatusOK, CalculationResponse{Result: res})
}

func (h *CalculatorHandler) Percentage(w http.ResponseWriter, r *http.Request) {
	req, ok := h.parseBinary(w, r)
	if !ok {
		return
	}
	res, err := h.service.Percentage(*req.A, *req.B)
	if err != nil {
		h.handleDomainError(w, err)
		return
	}
	h.writeJSON(w, http.StatusOK, CalculationResponse{Result: res})
}

func (h *CalculatorHandler) Sqrt(w http.ResponseWriter, r *http.Request) {
	req, ok := h.parseUnary(w, r)
	if !ok {
		return
	}
	res, err := h.service.Sqrt(*req.A)
	if err != nil {
		h.handleDomainError(w, err)
		return
	}
	h.writeJSON(w, http.StatusOK, CalculationResponse{Result: res})
}
