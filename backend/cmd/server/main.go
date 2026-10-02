package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/dogeuf02/sezzle-calculator-challenge/backend/internal/calculator"
	"github.com/dogeuf02/sezzle-calculator-challenge/backend/internal/handler"
	"github.com/dogeuf02/sezzle-calculator-challenge/backend/internal/middleware"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	calcService := calculator.NewService()
	calcHandler := handler.NewCalculatorHandler(calcService)

	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"healthy"}`))
	})

	// Dedicated arithmetic endpoints
	mux.HandleFunc("POST /api/v1/add", calcHandler.Add)
	mux.HandleFunc("POST /api/v1/subtract", calcHandler.Subtract)
	mux.HandleFunc("POST /api/v1/multiply", calcHandler.Multiply)
	mux.HandleFunc("POST /api/v1/divide", calcHandler.Divide)
	mux.HandleFunc("POST /api/v1/power", calcHandler.Power)
	mux.HandleFunc("POST /api/v1/percentage", calcHandler.Percentage)
	mux.HandleFunc("POST /api/v1/sqrt", calcHandler.Sqrt)

	// Wrap mux with CORS middleware
	app := middleware.CORS(mux)

	log.Printf("Calculator microservice running on port :%s", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), app); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
