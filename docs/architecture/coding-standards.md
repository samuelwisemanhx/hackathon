# Coding Standards

## Critical Fullstack Rules

- **Type Sharing:** Always define types in `src/lib/types/` and import - NEVER duplicate type definitions

- **API Calls:** Frontend NEVER makes direct fetch calls - use API client service in `src/lib/services/api.ts`

- **Environment Variables:** Access only through validated config objects - NEVER use `process.env` directly

- **Error Handling:** All API routes must use try-catch and return `{error: {code, message, details}}` format

- **State Updates:** Use Svelte 5 runes (`$state`, `$derived`) - NEVER mutate state directly

- **Database Queries:** All database access through repository pattern - NEVER write raw SQL in API routes

- **Secrets:** API keys MUST be in GCP Secret Manager for production - NEVER commit secrets

- **Auto-Save Debouncing:** Always use 2-second debounce to prevent database thrashing

## Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `QuestionTextarea.svelte` |
| Stores | camelCase.svelte.ts | - | `assessmentState.svelte.ts` |
| API Routes | kebab-case | - | `/api/assessments/current` |
| Database Tables | snake_case | - | `assessment_responses` |
| Types | PascalCase | PascalCase | `AssessmentResponse` |
| Functions | camelCase | camelCase | `getCurrentAssessment()` |

---
