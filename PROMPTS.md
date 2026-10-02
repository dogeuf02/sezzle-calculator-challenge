# AI Prompt Log

This document records the primary prompts used during the development of the Sezzle Technical Assessment.

## Phase 0: Architecture & Scaffolding
- Discussed and refined architectural trade-offs: Decoupled client-server design vs monolithic architectures.
- Evaluated and defined dedicated REST endpoint design (`/add`, `/subtract`, `/multiply`, `/divide`, `/power`, `/sqrt`, `/percentage`) over a single generic action handler for strict type safety and fault isolation.
- Generated project structure, sequence diagrams, and initial monorepo configuration.