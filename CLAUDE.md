# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI Skills Assessment Application built on a SvelteKit 5 foundation. The project is transitioning from a demo SvelteKit app to a full-featured assessment platform with PostgreSQL + Drizzle ORM, Anthropic Claude API integration, and GCP Cloud Run deployment.

**Current State**: Demo SvelteKit 5 application with basic routing examples
**Target State**: Full-stack AI assessment platform per architecture document

## Essential Commands

### Development
```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm start            # Run production build (localhost:3000)
```

### Database (To Be Implemented)
```bash
npm run db:generate  # Generate Drizzle migration
npm run db:push      # Push schema to database (dev)
npm run db:studio    # Open Drizzle Studio
```

### Testing (To Be Implemented)
```bash
npm run test         # Run all tests
```

## Architecture Overview

### Technology Stack
- **Frontend**: SvelteKit 2, Svelte 5 (with runes), TypeScript, Tailwind CSS
- **Backend**: SvelteKit server routes (+server.ts), Node adapter
- **Database**: PostgreSQL 15+ with Drizzle ORM
- **AI Integration**: Anthropic Claude API (Sonnet 4.5)
- **Deployment**: GCP Cloud Run (containerized)

### Monolithic Architecture
Single SvelteKit application with embedded API routes. No separate backend service.
- Frontend pages: `src/routes/*.svelte`
- API endpoints: `src/routes/api/**/*.ts`
- Server-only code: `src/lib/server/`
- Shared utilities: `src/lib/`

### Core Data Models
1. **User** - Email-based identification (MVP: no passwords)
2. **Assessment** - User assessment attempts with status tracking (in_progress → submitted → graded)
3. **AssessmentResponse** - Individual question responses with auto-save support
4. **EvaluationResult** - AI-generated evaluation with parsed scores
5. **EvaluationScore** - Component scores (Prompt Mastery, Technical Understanding, etc.)
6. **EvaluationMetadata** - Overall score, velocity rating, brutal truth feedback
7. **EvaluationRoadmapItem** - 90-day improvement plan periods

### Project Structure Pattern
```
src/
├── lib/
│   ├── server/              # Server-only code (auth, db, services)
│   │   ├── db/              # Drizzle schema and connection
│   │   ├── services/        # Business logic (auth, assessment, evaluation)
│   │   └── repositories/    # Data access layer
│   ├── components/          # Reusable Svelte components
│   ├── stores/              # Svelte 5 rune-based state (*.svelte.ts)
│   ├── types/               # Shared TypeScript types
│   ├── config/              # Question config, AI prompts
│   └── utils/               # Validation (Zod), logging
├── routes/
│   ├── *.svelte             # Page components
│   └── api/**/+server.ts    # REST API endpoints
└── hooks.server.ts          # Auth middleware
```

## Key Implementation Patterns

### State Management
Use Svelte 5 runes (`$state`, `$derived`) - no external state library:
```typescript
// src/lib/stores/assessment.svelte.ts
class AssessmentState {
  currentAssessment = $state<Assessment | null>(null);
  responses = $state<Map<string, string>>(new Map());
  progressPercentage = $derived(() => { /* calculate */ });
}
```

### API Route Pattern
```typescript
// src/routes/api/assessments/+server.ts
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  // locals.user populated by hooks.server.ts
  // Use repository pattern for DB access
  // Return { error: { code, message, details } } for errors
};
```

### Database Access
Always use repository pattern - never raw SQL in routes:
```typescript
// src/lib/server/repositories/assessment.ts
export async function getCurrentAssessment(userId: string) {
  return await db.query.assessments.findFirst({
    where: eq(assessments.userId, userId),
    with: { responses: true }
  });
}
```

### Authentication (MVP Simplified)
Email-only identification with cookie - no passwords initially:
- Cookie: `user_email={email}`
- `src/lib/server/services/auth.ts` - `findOrCreateUser(email)`
- `hooks.server.ts` - Validates cookie and populates `locals.user`

## Critical Development Rules

1. **Type Sharing**: Define types once in `src/lib/types/` - NEVER duplicate
2. **Environment Variables**: Access through validated config objects only
3. **API Errors**: Return standardized `{error: {code, message, details}}` format
4. **Auto-Save**: Use 2-second debounce to prevent database thrashing
5. **AI Timeouts**: Minimum 120s timeout for evaluation requests
6. **Secrets**: Use GCP Secret Manager in production - never commit secrets

## Important Documentation

### Architecture & Requirements
- **Architecture**: `/docs/architecture.md` - Complete technical design, database schema, API specs
- **PRD**: `/docs/prd.md` - Product requirements with detailed epics/stories
- **AI Prompts**: `/docs/prompts/` - Assessment questions and grader prompt

### PRD Epic Structure
1. **Epic 1**: Foundation & Authentication (database, user auth, session management)
2. **Epic 2**: Assessment Experience (6-part questionnaire, auto-save, progress tracking)
3. **Epic 3**: AI Evaluation & Results (Anthropic integration, parsing, results display)

### Key Technical Constraints
- Assessment completion time: 25-35 minutes (requires auto-save + session persistence)
- AI evaluation time: 30-90 seconds (needs user feedback + timeout handling)
- Cloud Run timeout: Up to 60 minutes (sufficient for AI processing)
- MVP auth: Email-only (production auth deferred to post-MVP)

## Development Workflow Guidance

### Starting New Features
1. Check architecture doc (`docs/architecture.md`) for data models and API specs
2. Check PRD (`docs/prd.md`) for acceptance criteria
3. Create types in `src/lib/types/`
4. Implement repository functions in `src/lib/server/repositories/`
5. Implement service logic in `src/lib/server/services/`
6. Create API routes in `src/routes/api/`
7. Build UI components in `src/lib/components/`
8. Create page routes in `src/routes/`

### Working with Database Schema
- Schema definition: `src/lib/server/db/schema.ts` (Drizzle)
- Generate migration: `npm run db:generate`
- Push to dev DB: `npm run db:push`
- Use Drizzle Studio for inspection: `npm run db:studio`

### AI Integration Notes
- Model: Anthropic Claude Sonnet 4.5 (`claude-sonnet-4-5-20250514`)
- Grader prompt: Load from `/docs/prompts/ai-test-grader-prompt.md`
- Assessment input format: PART 1-6 structure from user responses
- Store raw AI response + parsed structured data (for re-parsing if needed)

## Coding Conventions

### Naming
- **Components**: PascalCase (`QuestionTextarea.svelte`)
- **Stores**: camelCase with `.svelte.ts` (`assessmentState.svelte.ts`)
- **API Routes**: kebab-case (`/api/assessments/current`)
- **Database Tables**: snake_case (`assessment_responses`)
- **Types**: PascalCase (`AssessmentResponse`)
- **Functions**: camelCase (`getCurrentAssessment()`)

### File Organization
- Server-only code: `src/lib/server/` (never imported by client)
- Shared code: `src/lib/` (can be imported anywhere)
- Route-specific code: colocated with route files
- Reusable components: `src/lib/components/`

## Deployment Configuration

### SvelteKit Adapter
Using `@sveltejs/adapter-node` for GCP Cloud Run:
- Output: `build/` directory
- Precompression: Enabled (gzip)
- Environment prefix: `APP_` for public variables

### Docker Deployment
Multi-stage build targeting Node 20 Alpine:
```dockerfile
# Build stage → Runtime stage
# Port: 8080 (Cloud Run default)
# CMD: node build/index.js
```

### Environment Variables
```bash
# Database
DB_HOST=localhost (or /cloudsql/... for GCP)
DB_PORT=5432
DB_NAME=ai_assessment
DB_USER=postgres
DB_PASSWORD=***

# AI Provider
ANTHROPIC_API_KEY=sk-ant-api03-***

# Application
PUBLIC_APP_URL=http://localhost:5173
NODE_ENV=development
```

## Testing Strategy

### Test Structure (To Be Implemented)
- **Unit Tests**: Vitest for services, repositories, utilities
- **E2E Tests**: Playwright for complete assessment workflow
- **Test Coverage**: Focus on business logic (prompt formatting, response parsing, auth)

### Critical Test Cases
1. Assessment response formatting for AI API
2. AI response parsing (scores, roadmap extraction)
3. Auto-save debouncing and optimistic locking
4. Progress calculation across 6 assessment parts
5. Complete user flow: register → assess → submit → view results

## Common Pitfalls to Avoid

1. **Don't** mutate Svelte 5 rune state directly (use proper setters)
2. **Don't** make fetch calls from components (use API client service)
3. **Don't** write SQL in API routes (use repositories)
4. **Don't** import server code in client components (use `$lib/server/` boundary)
5. **Don't** forget auto-save debouncing (prevents DB thrashing during assessment)
6. **Don't** trust AI response format (always parse defensively + store raw response)

## Production Readiness Checklist

- [ ] No secrets in code (use Secret Manager)
- [ ] Database indexes on user_id, assessment_id, status
- [ ] Cloud CDN enabled for static assets
- [ ] Cloud Logging capturing errors
- [ ] Connection pooling configured (max 20)
- [ ] Anthropic API rate limiting handled (50 req/min)
- [ ] Session validation on all protected routes
- [ ] SQL injection prevention (Drizzle parameterized queries)
- [ ] XSS prevention (Svelte auto-escaping enabled)

## MVP Limitations (Post-MVP Improvements)

1. **Authentication**: Email-only (no passwords) - must migrate to proper auth
2. **No password reset**: Support via email for MVP
3. **No admin dashboard**: Manual database access for monitoring
4. **Sequential AI processing**: No queue (acceptable for <100 concurrent users)
5. **Single region**: No multi-region deployment
6. **Manual deployment**: CI/CD with GitHub Actions deferred

## Quick Reference Links

- SvelteKit Docs: https://kit.svelte.dev
- Svelte 5 Runes: https://svelte-5-preview.vercel.app/docs/runes
- Drizzle ORM: https://orm.drizzle.team
- Anthropic API: https://docs.anthropic.com/claude/reference/
- GCP Cloud Run: https://cloud.google.com/run/docs
