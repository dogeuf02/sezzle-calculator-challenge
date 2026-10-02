# AI Prompt Log

This document records the key prompts and technical discussions held with AI tools during the design, architecture, and implementation of the Sezzle Technical Assessment.

---

## Phase 0: System Architecture & Design Trade-offs

### 1. Architectural Strategy & Technology Stack
* **Prompt:**  
  > *"I am starting this project to build a full-stack calculator with a React (TypeScript) frontend and a Go backend service. I plan to use a decoupled layered architecture without a persistent database. Is this a sound approach, and how should we structure the overall system flow?"*
* **Context & Decision:** Evaluated client-server separation vs. monolithic setups. Decided on a clean layered architecture with a decoupled React SPA and an independent Go REST service.

### 2. Architecture Diagram & Sequence Flow
* **Prompt:**  
  > *"Generate Mermaid diagrams detailing the component architecture and the sequence flow for client-server communication between the frontend and backend."*
* **Context & Decision:** Established baseline sequence and component diagrams to document request lifecycles and boundaries before starting implementation.

---

## Phase 1: API Design & Granular Routing

### 1. Dedicated Semantic Endpoints vs. Generic Handler
* **Prompt:**  
  > *"I want dedicated REST endpoints (/add, /subtract, /divide, /multiply, etc.) rather than a generic /calculate endpoint with operation flags in the payload, as I believe this improves maintainability and bug isolation. Is this design sound?"*
* **Context & Decision:** Confirmed that dedicated REST routes enhance type safety, simplify payload validation per operation (unary vs. binary), and isolate runtime errors cleanly.

### 2. Advanced Mathematical Operations Support
* **Prompt:**  
  > *"I want to support Exponentiation, Square Root, and Percentage as well. How should the request/response payloads and edge-case validations (e.g., negative square roots, division by zero) be structured across these endpoints?"*
* **Context & Decision:** Designed clear DTO contracts distinguishing unary operations (`sqrt`, `percentage`) from binary operations (`power`, `divide`), enforcing explicit edge-case handling at the handler level.

---

## Phase 2: Go Idiomatic Structure & Testing Strategy

### 1. Package Layout & Test Colocation
* **Prompt:**  
  > *"Regarding folder structure in Go: should unit tests be placed in an external /tests directory or alongside the domain packages?"*
* **Context & Decision:** Kept unit tests (`*_test.go`) directly inside `internal/calculator` adhering to Go conventions, allowing white-box testing of domain logic while preserving package cohesion.

### 2. Test Cases & Coverage Verification
* **Prompt:**  
  > *"Generate table-driven tests in Go covering standard arithmetic operations and edge cases: division by zero, negative square roots, and precision handling for floating points."*
* **Context & Decision:** Implemented nested table-driven test suites (`TestCalculatorService` and `TestCalculatorHandlers`), verifying business logic, error boundaries, and HTTP response statuses.