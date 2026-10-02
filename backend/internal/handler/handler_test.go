package handler_test

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/dogeuf02/sezzle-calculator-challenge/backend/internal/calculator"
	"github.com/dogeuf02/sezzle-calculator-challenge/backend/internal/handler"
)

func TestCalculatorHandlers(t *testing.T) {
	svc := calculator.NewService()
	h := handler.NewCalculatorHandler(svc)

	tests := []struct {
		name           string
		method         string
		endpoint       string
		body           string
		handlerFunc    func(http.ResponseWriter, *http.Request)
		expectedStatus int
	}{
		// Success cases
		{"Add Success", http.MethodPost, "/api/v1/add", `{"a": 10.5, "b": 4.5}`, h.Add, http.StatusOK},
		{"Subtract Success", http.MethodPost, "/api/v1/subtract", `{"a": 10, "b": 4}`, h.Subtract, http.StatusOK},
		{"Multiply Success", http.MethodPost, "/api/v1/multiply", `{"a": 6, "b": 7}`, h.Multiply, http.StatusOK},
		{"Divide Success", http.MethodPost, "/api/v1/divide", `{"a": 20, "b": 4}`, h.Divide, http.StatusOK},
		{"Power Success", http.MethodPost, "/api/v1/power", `{"a": 2, "b": 3}`, h.Power, http.StatusOK},
		{"Percentage Success", http.MethodPost, "/api/v1/percentage", `{"a": 200, "b": 15}`, h.Percentage, http.StatusOK},
		{"Sqrt Success", http.MethodPost, "/api/v1/sqrt", `{"a": 49}`, h.Sqrt, http.StatusOK},

		// Domain Errors (422)
		{"Divide by Zero", http.MethodPost, "/api/v1/divide", `{"a": 10, "b": 0}`, h.Divide, http.StatusUnprocessableEntity},
		{"Negative Sqrt", http.MethodPost, "/api/v1/sqrt", `{"a": -9}`, h.Sqrt, http.StatusUnprocessableEntity},
		{"Invalid Power", http.MethodPost, "/api/v1/power", `{"a": -4, "b": 0.5}`, h.Power, http.StatusUnprocessableEntity},

		// Validation Errors (400)
		{"Missing Binary Operand B", http.MethodPost, "/api/v1/add", `{"a": 10}`, h.Add, http.StatusBadRequest},
		{"Missing Unary Operand A", http.MethodPost, "/api/v1/sqrt", `{}`, h.Sqrt, http.StatusBadRequest},
		{"Malformed JSON", http.MethodPost, "/api/v1/add", `{"a": "not-a-number"}`, h.Add, http.StatusBadRequest},
		{"Malformed Unary JSON", http.MethodPost, "/api/v1/sqrt", `invalid`, h.Sqrt, http.StatusBadRequest},

		// Method Not Allowed (405)
		{"Method Not Allowed GET", http.MethodGet, "/api/v1/add", ``, h.Add, http.StatusMethodNotAllowed},
		{"Unary Method Not Allowed GET", http.MethodGet, "/api/v1/sqrt", ``, h.Sqrt, http.StatusMethodNotAllowed},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, tt.endpoint, bytes.NewBufferString(tt.body))
			w := httptest.NewRecorder()

			tt.handlerFunc(w, req)

			if w.Code != tt.expectedStatus {
				t.Fatalf("endpoint %s expected status %d, got %d", tt.endpoint, tt.expectedStatus, w.Code)
			}
		})
	}
}
