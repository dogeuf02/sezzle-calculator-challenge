package handler

// BinaryRequest defines the contract for two-operand operations.
type BinaryRequest struct {
	A *float64 `json:"a"`
	B *float64 `json:"b"`
}

// UnaryRequest defines the contract for single-operand operations.
type UnaryRequest struct {
	A *float64 `json:"a"`
}

// CalculationResponse defines a successful calculation payload.
type CalculationResponse struct {
	Result float64 `json:"result"`
}

// ErrorResponse defines standard error payloads.
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}
