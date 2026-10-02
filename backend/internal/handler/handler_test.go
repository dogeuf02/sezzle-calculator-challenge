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

	t.Run("POST /api/v1/add - Success", func(t *testing.T) {
		body := bytes.NewBufferString(`{"a": 10.5, "b": 4.5}`)
		req := httptest.NewRequest(http.MethodPost, "/api/v1/add", body)
		w := httptest.NewRecorder()

		h.Add(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected status 200, got %d", w.Code)
		}
	})

	t.Run("POST /api/v1/divide - Division by Zero", func(t *testing.T) {
		body := bytes.NewBufferString(`{"a": 10, "b": 0}`)
		req := httptest.NewRequest(http.MethodPost, "/api/v1/divide", body)
		w := httptest.NewRecorder()

		h.Divide(w, req)

		if w.Code != http.StatusUnprocessableEntity {
			t.Fatalf("expected status 422, got %d", w.Code)
		}
	})

	t.Run("POST /api/v1/add - Missing Operand", func(t *testing.T) {
		body := bytes.NewBufferString(`{"a": 10}`)
		req := httptest.NewRequest(http.MethodPost, "/api/v1/add", body)
		w := httptest.NewRecorder()

		h.Add(w, req)

		if w.Code != http.StatusBadRequest {
			t.Fatalf("expected status 400, got %d", w.Code)
		}
	})

	t.Run("POST /api/v1/sqrt - Negative Input", func(t *testing.T) {
		body := bytes.NewBufferString(`{"a": -9}`)
		req := httptest.NewRequest(http.MethodPost, "/api/v1/sqrt", body)
		w := httptest.NewRecorder()

		h.Sqrt(w, req)

		if w.Code != http.StatusUnprocessableEntity {
			t.Fatalf("expected status 422, got %d", w.Code)
		}
	})
}
