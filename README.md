# Sezzle Full-Stack Calculator

A full-stack calculator application developed as part of the **Sezzle Technical Assessment**.

The application uses a **React + TypeScript** frontend and a **Go REST API** backend. The frontend communicates with the backend through HTTP/JSON endpoints.

The implementation focuses on the assessment priorities:

- Correctness
- Clarity
- Maintainability
- Testability
- Input validation
- Clean architecture
- Responsive UI
- Clear API contracts

---

## Architecture

The application follows a decoupled client-server architecture.

The frontend is responsible for the user interface and interaction, while the Go backend handles the calculator domain logic, validation, and REST API communication.

### Component Diagram

![Component Diagram](./docs/diagrams/components.png)

The component diagram illustrates the main frontend and backend components and their responsibilities.

### Sequence Diagram

![Sequence Diagram](./docs/diagrams/sequence.png)

The sequence diagram illustrates the flow of a calculator operation from the user's interaction with the frontend through the REST API and calculator service, and finally back to the UI.

---

## Visual Design

### Color Palette

![Color Palette](./docs/assets/colorPalette.png)

The color palette defines the visual language used throughout the calculator interface.

---

## Table of Contents

- [Architecture](#architecture)
  - [Component Diagram](#component-diagram)
  - [Sequence Diagram](#sequence-diagram)
- [Visual Design](#visual-design)
  - [Color Palette](#color-palette)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Running Locally](#running-locally)
  - [Docker Compose](#option-1--docker-compose)
  - [Native Development](#option-2--native-development)
- [API Reference](#api-reference)
  - [Addition](#1-addition)
  - [Subtraction](#2-subtraction)
  - [Multiplication](#3-multiplication)
  - [Division](#4-division)
  - [Exponentiation](#5-exponentiation)
  - [Square Root](#6-square-root)
  - [Percentage](#7-percentage)
  - [Health Check](#8-health-check)
- [Validation and Error Handling](#validation-and-error-handling)
- [Design Decisions](#design-decisions)
- [Testing](#testing)
- [Coverage](#coverage)
- [Docker](#docker)
- [Assumptions](#assumptions)
- [AI Usage](#ai-usage)
- [Quick Start](#quick-start)

---

# Features

The calculator supports the required arithmetic operations from the assessment as well as the optional advanced operations.

### Required Operations

- Addition
- Subtraction
- Multiplication
- Division

### Optional Operations

- Exponentiation
- Square root
- Percentage

### Additional Features

- React + TypeScript frontend
- RESTful Go backend
- Input validation
- Server-side mathematical validation
- Division-by-zero handling
- Negative square-root validation
- Floating-point result normalization
- JSON API responses
- HTTP error handling
- Responsive calculator interface
- Backend unit tests
- HTTP handler tests
- Frontend tests
- Test coverage reports
- Docker Compose support
- Health-check endpoint
- Layered backend architecture

---

# Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Static typing |
| Vite | Development server and build tooling |
| Vitest | Frontend testing |
| React Testing Library | UI testing |

## Backend

| Technology | Purpose |
|---|---|
| Go | Backend implementation |
| `net/http` | HTTP server and REST API |
| `net/http/httptest` | HTTP handler testing |
| Go table-driven tests | Domain and behavior testing |

## Infrastructure

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Running frontend and backend together |
| cURL | API testing |

No database is required because the calculator service is stateless.

---

# Project Structure

```text
.
├── backend/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go
│   │
│   ├── internal/
│   │   ├── calculator/
│   │   │   └── ...
│   │   │
│   │   ├── handler/
│   │   │   ├── dto.go
│   │   │   └── ...
│   │   │
│   │   └── middleware/
│   │       └── ...
│   │
│   ├── go.mod
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── ...
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── docs/
│   ├── assets/
│   │   └── colorPalette.png
│   │
│   └── Diagrams/
│       ├── components.png
│       └── sequence.png
│
├── prompt.md
├── docker-compose.yml
└── README.md
```

---

# Prerequisites

Make sure the following are installed before running the project.

| Requirement | Version |
|---|---|
| Go | 1.21+ |
| Node.js | 18+ |
| npm | Compatible with Node.js |
| Docker | 24+ |
| Docker Compose | V2 |
| cURL | Any recent version |

Verify the installed versions:

```bash
go version
node -v
npm -v
docker --version
docker compose version
curl --version
```

---

# Running Locally

There are two ways to run the application.

## Option 1 — Docker Compose

Docker Compose is the easiest way to start both services.

From the project root:

```bash
docker compose up --build
```

The application will be available at:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Health Check | http://localhost:8080/healthz |

To run the containers in the background:

```bash
docker compose up --build -d
```

To stop the application:

```bash
docker compose down
```

To stop the application and remove volumes:

```bash
docker compose down -v
```

---

## Option 2 — Native Development

The frontend and backend can also be run independently.

### Start the Backend

Open a terminal:

```bash
cd backend
go run cmd/server/main.go
```

The backend will start at:

```text
http://localhost:8080
```

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will normally be available at:

```text
http://localhost:5173
```

---

# API Reference

The backend exposes a REST API using JSON request and response bodies.

## Base URL

```text
http://localhost:8080/api/v1
```

Binary operations accept:

```json
{
  "a": 10,
  "b": 5
}
```

Unary operations accept:

```json
{
  "a": 49
}
```

---

## 1. Addition

### `POST /api/v1/add`

Calculates:

```text
a + b
```

### Request

```bash
curl -X POST http://localhost:8080/api/v1/add \
  -H "Content-Type: application/json" \
  -d '{"a":10.5,"b":4.5}'
```

### Response

**200 OK**

```json
{
  "result": 15
}
```

---

## 2. Subtraction

### `POST /api/v1/subtract`

Calculates:

```text
a - b
```

### Request

```bash
curl -X POST http://localhost:8080/api/v1/subtract \
  -H "Content-Type: application/json" \
  -d '{"a":20,"b":7.5}'
```

### Response

**200 OK**

```json
{
  "result": 12.5
}
```

---

## 3. Multiplication

### `POST /api/v1/multiply`

Calculates:

```text
a × b
```

### Request

```bash
curl -X POST http://localhost:8080/api/v1/multiply \
  -H "Content-Type: application/json" \
  -d '{"a":6,"b":7}'
```

### Response

**200 OK**

```json
{
  "result": 42
}
```

---

## 4. Division

### `POST /api/v1/divide`

Calculates:

```text
a / b
```

### Request

```bash
curl -X POST http://localhost:8080/api/v1/divide \
  -H "Content-Type: application/json" \
  -d '{"a":25,"b":5}'
```

### Response

**200 OK**

```json
{
  "result": 5
}
```

### Division by Zero

Division by zero is treated as a mathematical domain error.

```bash
curl -i -X POST http://localhost:8080/api/v1/divide \
  -H "Content-Type: application/json" \
  -d '{"a":10,"b":0}'
```

### Response

**422 Unprocessable Entity**

```json
{
  "error": "division_by_zero",
  "message": "cannot divide by zero"
}
```

---

## 5. Exponentiation

### `POST /api/v1/power`

Calculates:

```text
a^b
```

### Request

```bash
curl -X POST http://localhost:8080/api/v1/power \
  -H "Content-Type: application/json" \
  -d '{"a":2,"b":8}'
```

### Response

**200 OK**

```json
{
  "result": 256
}
```

---

## 6. Square Root

### `POST /api/v1/sqrt`

This is a unary operation and requires only `a`.

### Request

```bash
curl -X POST http://localhost:8080/api/v1/sqrt \
  -H "Content-Type: application/json" \
  -d '{"a":49}'
```

### Response

**200 OK**

```json
{
  "result": 7
}
```

### Negative Input

The API operates on real numbers, so negative values are rejected.

```bash
curl -i -X POST http://localhost:8080/api/v1/sqrt \
  -H "Content-Type: application/json" \
  -d '{"a":-9}'
```

### Response

**422 Unprocessable Entity**

```json
{
  "error": "negative_square_root",
  "message": "cannot calculate square root of a negative number"
}
```

---

## 7. Percentage

### `POST /api/v1/percentage`

Calculates:

```text
(a × b) / 100
```

### Request

```bash
curl -X POST http://localhost:8080/api/v1/percentage \
  -H "Content-Type: application/json" \
  -d '{"a":250,"b":20}'
```

### Response

**200 OK**

```json
{
  "result": 50
}
```

---

## 8. Health Check

### `GET /healthz`

Checks whether the backend service is running.

### Request

```bash
curl http://localhost:8080/healthz
```

### Response

**200 OK**

```json
{
  "status": "healthy"
}
```

---

# API Summary

| Method | Endpoint | Parameters | Description |
|---|---|---|---|
| `POST` | `/api/v1/add` | `a`, `b` | Addition |
| `POST` | `/api/v1/subtract` | `a`, `b` | Subtraction |
| `POST` | `/api/v1/multiply` | `a`, `b` | Multiplication |
| `POST` | `/api/v1/divide` | `a`, `b` | Division |
| `POST` | `/api/v1/power` | `a`, `b` | Exponentiation |
| `POST` | `/api/v1/sqrt` | `a` | Square root |
| `POST` | `/api/v1/percentage` | `a`, `b` | Percentage |
| `GET` | `/healthz` | — | Health check |

---

# Validation and Error Handling

Validation is performed at both the frontend and backend levels.

The frontend provides immediate feedback for invalid user input, while the backend performs server-side validation to ensure that the API remains reliable regardless of the client implementation.

## HTTP Status Codes

| Status | Meaning |
|---|---|
| `200 OK` | Calculation completed successfully |
| `400 Bad Request` | Malformed JSON, missing parameters, or invalid request data |
| `405 Method Not Allowed` | HTTP method is not supported |
| `422 Unprocessable Entity` | Request is valid but violates a mathematical domain rule |
| `500 Internal Server Error` | Unexpected server-side error |

Examples of mathematical domain errors include:

- Division by zero
- Square root of a negative number
- Invalid real-number exponentiation

---

# Design Decisions

## 1. Decoupled Frontend and Backend

The React frontend and Go backend are independent applications.

The frontend is responsible for:

- User interaction
- Calculator UI
- Input handling
- Client-side validation
- Displaying results
- Displaying errors

The backend is responsible for:

- Arithmetic operations
- Server-side validation
- Mathematical domain rules
- HTTP API contracts
- JSON serialization

This separation keeps the calculator domain logic independent from the presentation layer.

---

## 2. Layered Backend Architecture

The backend is divided into clear responsibilities.

```text
HTTP Request
     │
     ▼
┌─────────────────────────┐
│ Transport Layer         │
│ Handler + Middleware    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ DTO / Request Validation│
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Calculator Domain Layer │
│ Arithmetic + Rules      │
└────────────┬────────────┘
             │
             ▼
        Calculation
             │
             ▼
       JSON Response
```

The transport layer does not contain the mathematical implementation itself.

The calculator domain layer does not depend on HTTP, JSON, or frontend concepts.

This makes the domain logic easier to test independently.

---

## 3. Dedicated Operation Endpoints

The API uses dedicated endpoints:

```text
POST /add
POST /subtract
POST /multiply
POST /divide
POST /power
POST /sqrt
POST /percentage
```

instead of a single polymorphic endpoint such as:

```text
POST /calculate
```

with an operation field.

This approach was chosen because each operation can have different validation and domain rules.

For example:

- Addition requires `a` and `b`.
- Division requires `a` and `b` and rejects `b = 0`.
- Square root only requires `a`.
- Square root rejects negative values.

Dedicated endpoints also keep individual handlers focused and make the API contract explicit.

---

## 4. Pointer-Based Request DTOs

The backend uses pointer fields for numeric request values.

Example:

```go
type BinaryRequest struct {
    A *float64 `json:"a"`
    B *float64 `json:"b"`
}
```

This allows the API to distinguish between an explicitly provided zero and an omitted parameter.

For example:

```json
{
  "a": 0,
  "b": 10
}
```

is different from:

```json
{
  "b": 10
}
```

With regular `float64` fields, Go initializes missing numeric fields to their zero value.

Using pointers allows the handler to detect missing values and return an appropriate `400 Bad Request`.

---

## 5. Domain Logic Independent of HTTP

The calculator service operates on numerical values rather than HTTP requests.

The domain layer returns either:

- A calculation result
- A domain error

The HTTP layer translates those errors into API responses.

This separation allows the mathematical functionality to be tested without starting an HTTP server.

---

## 6. Semantic HTTP Status Codes

The API differentiates between malformed requests and mathematically invalid operations.

For example, malformed JSON:

```text
400 Bad Request
```

while a valid request attempting to divide by zero:

```text
422 Unprocessable Entity
```

This makes API responses more meaningful to clients.

---

## 7. Floating-Point Normalization

Floating-point arithmetic can produce representation artifacts.

For example:

```text
0.1 + 0.2
```

may result internally in a value close to:

```text
0.30000000000000004
```

The backend normalizes calculation results to **12 decimal places**.

This provides predictable API responses while avoiding an unnecessary dependency on arbitrary-precision decimal arithmetic for the scope of this assessment.

---

## 8. Stateless Backend

The backend does not use a database or session state.

Every request contains all information required to perform its calculation.

This keeps the service:

- Simple
- Easy to test
- Easy to run locally
- Easy to containerize
- Independent of external infrastructure

Persistent calculation history is outside the scope of the assessment.

---

# Testing

Testing is implemented at both the backend and frontend levels.

## Backend Tests

The Go backend uses:

- Table-driven tests
- Unit tests for calculator operations
- HTTP handler tests
- `net/http/httptest`
- Validation tests
- Mathematical edge-case tests

Run all backend tests:

```bash
cd backend
go test -v ./...
```

---

## Frontend Tests

The React frontend uses:

- Vitest
- React Testing Library

The frontend tests cover key application behavior such as:

- Component rendering
- Calculator interaction
- Keypad input
- API behavior
- Error handling

Run the tests once:

```bash
cd frontend
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

---

# Coverage

Coverage reports can be generated for both layers.

## Backend Coverage

From the backend directory:

```bash
cd backend

go test -coverprofile=coverage.out ./...

go tool cover -html=coverage.out -o coverage.html
```

This generates:

```text
coverage.out
coverage.html
```

The HTML report can be opened in a browser to inspect covered and uncovered code.

You can also display coverage directly in the terminal:

```bash
go test -cover ./...
```

---

## Frontend Coverage

From the frontend directory:

```bash
cd frontend
npm test -- --coverage
```

The generated report provides visibility into tested frontend code paths.

Coverage is treated as a tool for identifying untested behavior rather than as a target percentage by itself.

---

# Docker

Docker Compose allows the frontend and backend to run together.

```text
Docker Compose
│
├── Frontend
│   └── React + TypeScript
│
└── Backend
    └── Go REST API
```

Start the complete application:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up --build -d
```

Check running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs
```

View backend logs:

```bash
docker compose logs backend
```

View frontend logs:

```bash
docker compose logs frontend
```

Stop the application:

```bash
docker compose down
```

---

# Assumptions

The following assumptions were made during implementation:

1. The calculator operates on real numbers represented using Go's `float64`.
2. The backend does not persist calculation history.
3. Each calculation is independent and stateless.
4. Division by zero is treated as a mathematical domain error.
5. Square root operates only on non-negative real numbers.
6. The API normalizes floating-point results to 12 decimal places.
7. The frontend provides user-friendly validation, but the backend remains the source of truth for server-side validation.
8. Authentication and authorization are outside the scope of this assessment.
9. Database persistence is unnecessary for the requested functionality.
10. The application prioritizes correctness and maintainability over additional features outside the assessment requirements.

---

# AI Usage

AI tools were used during development, as explicitly permitted by the Sezzle Technical Assessment instructions.

AI assistance was used as a development aid for:

- Exploring implementation approaches
- Reviewing architecture and separation of concerns
- Identifying edge cases
- Designing test cases
- Reviewing validation and error handling
- Debugging implementation issues
- Reviewing documentation
- Improving code readability

AI-generated suggestions were reviewed and adapted to the project's requirements before being incorporated.

## Development Prompts

The prompts used throughout the development process are documented separately in:

**[prompt.md](./prompt.md)**

The prompt file contains the development prompts used for architecture, implementation, testing, debugging, and documentation.

---

# Development Priorities

The implementation intentionally follows the priorities specified in the assessment:

### Correctness

Arithmetic operations and mathematical edge cases are explicitly handled.

### Clarity

The frontend, transport layer, validation, and calculator domain logic have clearly separated responsibilities.

### Maintainability

The backend avoids unnecessary abstractions and external dependencies for a relatively small service.

### Testability

Domain logic and HTTP behavior can be tested independently.

### Documentation

The repository includes:

- Setup instructions
- API documentation
- Architecture diagrams
- Design decisions
- Testing instructions
- Coverage instructions
- Assumptions
- AI development prompts

### Simplicity

No database, authentication system, or additional infrastructure was introduced because these are not required for the calculator use case.

---

# Quick Start

The fastest way to run the complete application is with Docker Compose.

```bash
git clone <repository-url>

cd <repository-directory>

docker compose up --build
```

Open the frontend:

```text
http://localhost:3000
```

Check the backend:

```text
http://localhost:8080/healthz
```

Or test the API directly:

```bash
curl -X POST http://localhost:8080/api/v1/add \
  -H "Content-Type: application/json" \
  -d '{"a":10,"b":5}'
```

Expected response:

```json
{
  "result": 15
}
```

---

# Repository Contents

The repository includes:

```text
Frontend
├── React
├── TypeScript
├── Vite
└── Tests

Backend
├── Go
├── REST API
├── Calculator Domain
├── Validation
└── Tests

Documentation
├── Component Diagram
├── Sequence Diagram
├── Color Palette
└── AI Development Prompts

Infrastructure
└── Docker Compose
```

The repository contains the complete frontend, backend, tests, documentation, architecture diagrams, Docker configuration, and development prompts required for evaluation.