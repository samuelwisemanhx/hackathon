# Tech Stack

This is the DEFINITIVE technology selection for the entire project. This table is the single source of truth - all development must use these exact versions.

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.x | Type-safe frontend development | Prevents runtime errors, improves IDE support, essential for large forms with complex validation |
| Frontend Framework | SvelteKit | 2.x | Full-stack web framework | PRD requirement (NFR1), provides SSR, routing, API routes, and excellent DX |
| UI Component Library | shadcn-svelte | latest | Accessible, customizable components | Radix-based primitives ensure WCAG AA compliance (PRD requirement), Tailwind integration |
| State Management | Svelte 5 Runes | Built-in | Reactive state management | Native Svelte 5 reactivity eliminates need for external state library, perfect for form state tracking |
| CSS Framework | Tailwind CSS | 3.x | Utility-first styling | Rapid UI development, responsive design utilities, small bundle size with purging |
| Backend Language | TypeScript | 5.x | Type-safe backend development | Shared types between frontend/backend, prevents API contract mismatches |
| Backend Framework | SvelteKit (server routes) | 2.x | API endpoint handling | PRD specifies monolithic architecture (NFR2), +server.ts routes provide REST API capabilities |
| API Style | REST | - | HTTP API design | Simple request/response for assessment CRUD, no real-time requirements, form actions for progressive enhancement |
| Database | PostgreSQL | 15.x+ | Relational data storage | PRD requirement (NFR2), robust ACID compliance for assessment data integrity |
| ORM | Drizzle ORM | latest | Type-safe database access | PRD requirement (NFR2), excellent TypeScript support, lightweight, supports migrations |
| Authentication | Email-only (MVP) | - | Temporary user identification | Simplified for MVP - no passwords, no sessions, just email in cookie. Production auth post-MVP. |
| Frontend Testing | Vitest | latest | Component and unit testing | Native Vite integration, fast execution, compatible with SvelteKit |
| Backend Testing | Vitest | latest | API and business logic testing | Unified testing framework for frontend and backend, TypeScript support |
| E2E Testing | Playwright | latest | End-to-end user flows | PRD requires testing complete assessment workflow (Story 1.4, 2.7), cross-browser support |
| Build Tool | Vite | 5.x | Development server and bundler | Built into SvelteKit, fast HMR, optimized production builds |
| Bundler | Vite | 5.x | Module bundling | Integrated with SvelteKit, handles code splitting and tree shaking |
| IaC Tool | Terraform (optional) | latest | GCP infrastructure as code | Optional for MVP - manual GCP console setup acceptable, Terraform recommended for production |
| CI/CD | GitHub Actions | - | Automated testing and deployment | Free for public repos, native GCP integration via Workload Identity, can run Playwright tests |
| Monitoring | Cloud Logging + Cloud Monitoring | - | Application logs and metrics | Native GCP integration, captures Cloud Run logs, custom metrics for assessment completion rates |
| Logging | Pino | latest | Structured JSON logging | High-performance logging library, structured logs for Cloud Logging analysis |
| AI Provider | Anthropic Claude | Sonnet 4.5 | Assessment evaluation | PRD requirement (Technical Assumptions), recommended in grader prompt documentation |
| Form Validation | Zod | latest | Schema validation | Type-safe validation shared between client and server, integrates with SvelteKit form actions |

---
