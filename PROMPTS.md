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

### 3. Package Layout & Test Colocation
* **Prompt:**  
  > *"Regarding folder structure in Go: should unit tests be placed in an external /tests directory or alongside the domain packages?"*
* **Context & Decision:** Kept unit tests (`*_test.go`) directly inside `internal/calculator` adhering to Go conventions, allowing white-box testing of domain logic while preserving package cohesion.

### 4. Test Cases & Coverage Verification
* **Prompt:**  
  > *"Generate table-driven tests in Go covering standard arithmetic operations and edge cases: division by zero, negative square roots, and precision handling for floating points."*
* **Context & Decision:** Implemented nested table-driven test suites (`TestCalculatorService` and `TestCalculatorHandlers`), verifying business logic, error boundaries, and HTTP response statuses.

---

## Phase 2: Frontend Architecture, State Management & UI

### 1. Calculator State Machine & Async Lifecycle
* **Prompt:**  
  > *"Design a robust calculator state machine in React using TypeScript. It must handle current display value, stored previous operands, active pending operations, network loading states, and global error banners (e.g., displaying server-side errors such as 'Cannot divide by zero')."*
* **Context & Decision:** Created a custom hook / state machine decoupling arithmetic input logic and network synchronization from visual presentation, ensuring graceful degradation during network errors.

### 2. UI/UX Theming & Responsive Layout
* **Prompt:**  
  > *"Structure the calculator UI layout using a minimalist, rounded, and responsive container with a clean color palette(#6232A6   #56308C   #482973   #382859   #F27405). Ensure proper contrast, flexbox alignment, and mobile responsiveness."*
* **Context & Decision:** Implemented a component hierarchy separating the display screen, error indicators, and responsive button grid, applying consistent spacing and border radii using the sezzle color palette.

### 3. Input Manipulation & Backspace Functionality
* **Prompt:**  
  > *"Implement a backspace/delete button in the calculator state machine to allow users to edit their input without clearing the entire calculation state"*
* **Context & Decision:** Added an action handler to slice the current display string, resetting to '0' when empty and preserving previous operand memory if an operation is pending.

### 4. Test Environment Setup
* **Prompt:**  
  > *"Configure Vitest and React Testing Library."*
* **Context & Decision:** Configured Vitest with jsdom in `vite.config.ts` and set up test matchers with `@testing-library/jest-dom` for component testing.

### 5. Component Rendering & Basic Actions
* **Prompt:**  
  > *"Test component rendering and basic user actions (entering digits, clicking clear)."*
* **Context & Decision:** Added unit tests verifying key click interactions, display text updates, and clear button behavior to ensure UI state updates correctly.

### 6. Error Handling Verification
* **Prompt:**  
  > *"Test error state rendering when the API returns an error response."*
* **Context & Decision:** Mocked API failure scenarios (like division by zero) to verify that error messages render in the UI error banner as expected.

---

## Phase 3: Containerization & Multi-Service Orchestration

### 1. Backend Multi-Stage Dockerfile
* **Prompt:**  
  > *"Write a multi-stage Dockerfile for the Go backend"*
* **Context & Decision:** Created an optimized, lightweight Docker container separating the build toolchain from the runtime image, drastically reducing the attack surface and overall image size.

### 2. Frontend Multi-Stage Dockerfile with Nginx
* **Prompt:**  
  > *"Write a multi-stage Dockerfile for the React frontend"*
* **Context & Decision:** Packaged the compiled Vite distribution into a lightweight Nginx web server, ensuring fast static file serving and consistent HTTP headers.

### 3. Orchestration & Cold-Boot Verification
* **Prompt:**  
  > *"Write a root docker-compose.yml to orchestrate the Go backend and React frontend with port mappings (8080:8080 and 3000:80)."*
* **Context & Decision:** Configured single-command local orchestration via Docker Compose, guaranteeing reproducible execution for evaluators without local runtime dependencies.

## Phase 4: Documentation & Submission Polish

### 1. IEEE 754 Floating-Point Normalization
* **Prompt:**  
  > *"Fix precision issues 0.1 + 0.2 = 0.3"*
* **Context & Decision:** Applied rounding and normalization logic in both the Go service layer and the React display state to eliminate binary floating-point representation artifacts.

### 2. UI Display Clamping for Repeating Decimals
* **Prompt:**  
  > *"Limit repeating decimals like 1/3 to 8 decimal places so the text fits nicely inside the screen."*
* **Context & Decision:** Formatted display values to clamp periodic decimals to a clean 8–10 decimal limit, preventing overflow on smaller screen sizes.

### 3. Visual Identity & Favicon Generation
* **Prompt:**  
  > *"Make a minimalist, modern vector app icon for a browser favicon, featuring a bold, stylized mathematical symbol or calculator glyph. Flat design, clean lines, high contrast, vibrant purple (#6232A6) and accent orange (#F27405), perfectly centered on a solid plain white background. No text, no photorealism, no 3D effects, 2D vector graphic style, sharp edges, 1:1 square ratio."*
* **Context & Decision:** Created an SVG vector icon matching the application's color theme to replace default framework assets.

### 4. Comprehensive Technical Documentation
* **Prompt:**  
  > *"Write a README following these instructions: Project overview and architecture explanation, Prerequisites (Go, Node, Docker versions), How to run locally (with and without Docker), How to execute tests and view coverage reports, Concrete curl examples for every endpoint, and an explicit section on Design Decisions & Trade-offs (explaining dedicated operation endpoints, layered separation, error codes)."*
* **Context & Decision:** Generated a production-grade README matching all evaluation criteria specified in the technical assessment.

## Phase 5: Bug Fixes

### 1. Error State Reset on Digit Input
* **Prompt:**  
  > *"When the calculator hits an error like `40 / 0` and shows 'Error', typing another number should reset the calculator and start fresh with that digit instead of showing '40/<number>'. What should I change?"*
* **Context & Decision:** Fixed a UX issue where active error states locked or corrupted subsequent input concatenation. Pressing any numerical key after an error now resets the accumulator and clears domain error flags immediately.

### 2. Preventing Display Overflow & Large Number Formatting
* **Prompt:**  
  > *"Large calculations like `30^10` and long decimal sequences are overflowing the screen. Provide a simple TypeScript formatting helper to switch to scientific notation when exceeding 12 characters, and add responsive CSS clamp styling for the display."*
* **Context & Decision:** Added numerical normalization on the client using exponential notation for numbers exceeding display thresholds, combined with CSS fluid typography (`clamp`) to keep layouts responsive across screen sizes.

### 3. Chained Arithmetic Operations
* **Prompt:**  
  > *"When entering sequential operations like `5 + 5 + 3 =`, pressing the second `+` resets the screen to 3 instead of computing the running total of 10. How should I update `performOperation` to accepting concecutive operands?"*
* **Context & Decision:** Implemented immediate intermediate resolution in the frontend state machine. Entering a new operator with a pending expression resolves the active calculation against the backend and updates the accumulator prior to storing the next operation.

### 4. Exponentiation Operator Persistence
* **Prompt:**  
  > *"In an expression like `5 ^ 2 * 2`, pressing `*` computes `5 ^ 2 = 25`, but the calculator drops the `*` operator so I have to click it twice. How do I make sure evaluating the power operation retains the new operator as the pending operation?"*
* **Context & Decision:** Corrected an asynchronous state timing bug where evaluating an in-flight exponentiation wiped the operator buffer instead of setting the newly clicked symbol (`*`) as the next pending operation.

### 5. Contextual Percentage Calculation
* **Prompt:**  
  > *"How do standard pocket calculators handle `80 - 30%`? If I hit `%`, it should calculate 30% of 80 giving 24 and keep the minus operation pending so pressing `=` results in 56, instead of just dividing 30 by 100. How can I handle this in my React state machine?"*
* **Context & Decision:** Treated the percentage action as a contextual display modifier in the UI rather than a standard binary operator, computing intermediate percentage values relative to the initial operand while preserving the active arithmetic operation.

### 6. Architecture & Separation of Concerns for Percentage
* **Prompt:**  
  > *"My Go backend has a stateless percentage endpoint `(a * b) / 100`. Should I modify the backend to support expressions like `80 - 30%`, or should the Go API remain purely stateless and modify the React front?"*
* **Context & Decision:** Decided against adding stateful session logic to the Go backend. Maintained the backend as a pure, stateless mathematical service while delegating interaction orchestration entirely to the React client.

### 7. Calculator Conventions vs. Mathematical Rigor
* **Prompt:**  
  > *"Looking at cases like `100 / 50%`, does not follow the `80 - 30%` rule. Is because it follows another logic? and does it justify adding more conditions to the handlePendingPercentage?"*
* **Context & Decision:** Confirmed that calculator percentage functionality represents an accounting and UX convention rather than an algebraic operator, confirming the choice to handle it client-side without altering core REST contracts.

### 8. Unit Test Suite Expansion for Percentage Logic
* **Prompt:**  
  > *"Generate a comprehensive test suite for `useCalculator` hook covering edge cases: relative percentages for addition (100 + 20%), subtraction (80 - 30%), scaling factor for multiplication/division (100 * 50%), standalone percentage operations, chained evaluations, and backspace deletions."*
* **Context & Decision:** Expanded Vitest coverage across the hook layer to lock down standard calculator UX conventions and prevent regressions across multi-step operation queues.

### 9. State Synchronization and Closure Race Conditions
* **Prompt:**  
  > *"Vitest reports expected 'percentage' to be called with [100, 20], received [100, 0]. The UI works manually, but sequential `inputDigit` calls inside testing `act()` blocks receive stale state. Why is the operand defaulting to zero?"*
* **Context & Decision:** Identified that React's asynchronous render cycle and closure staleness during rapid sequential `act()` batches caused `waitingForSecondOperand` and display updates to lag behind synchronous assertions.

### 10. Architecture Review: Mutable References vs. State Reducer
* **Prompt:**  
  > *"Is relying on `useRef` to immediately synchronize UI state flags an architectural best practice in React, or should this state transition pipeline be refactored?"*
* **Context & Decision:** Evaluated trade-offs between a pragmatic `useRef` patch and an idiomatic state machine. Rejected the mutable reference approach to avoid splitting the single source of truth, choosing instead to migrate the hook architecture to `useReducer`.

### 11. Transition from Multi-useState to Centralized useReducer
* **Prompt:**  
  > *"Refactor `useCalculator.ts` from multiple isolated `useState` hooks into a pure `useReducer` state machine while preserving the existing public interface and external component contracts."*
* **Context & Decision:** Consolidated state into a deterministic, action-driven reducer (`INPUT_DIGIT`, `PREPARE_OPERATION`, `SET_RESULT`, etc.). Eliminated closure desynchronization, made state transitions purely testable, and brought all 36 frontend test cases to green.