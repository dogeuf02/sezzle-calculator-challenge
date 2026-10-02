package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/dogeuf02/sezzle-calculator-challenge/backend/internal/middleware"
)

func TestCORSMiddleware(t *testing.T) {
	dummyHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	corsWrapped := middleware.CORS(dummyHandler)

	t.Run("Preflight OPTIONS request", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodOptions, "/api/v1/add", nil)
		w := httptest.NewRecorder()

		corsWrapped.ServeHTTP(w, req)

		if w.Code != http.StatusNoContent {
			t.Errorf("expected status 204 No Content for OPTIONS, got %d", w.Code)
		}

		if origin := w.Header().Get("Access-Control-Allow-Origin"); origin != "*" {
			t.Errorf("expected Access-Control-Allow-Origin to be '*', got '%s'", origin)
		}

		if methods := w.Header().Get("Access-Control-Allow-Methods"); methods != "POST, GET, OPTIONS" {
			t.Errorf("unexpected Access-Control-Allow-Methods: %s", methods)
		}
	})

	t.Run("Standard POST request passes through", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/v1/add", nil)
		w := httptest.NewRecorder()

		corsWrapped.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Errorf("expected status 200 OK, got %d", w.Code)
		}

		if origin := w.Header().Get("Access-Control-Allow-Origin"); origin != "*" {
			t.Errorf("expected Access-Control-Allow-Origin to be '*', got '%s'", origin)
		}
	})
}
