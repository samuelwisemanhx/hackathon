# Technical Assumptions

## Repository Structure: Monorepo

Single repository containing both frontend (SvelteKit) and backend API/database logic. Given the tight integration between UI and data models, and the relatively small scope of the application, a monorepo simplifies development and deployment.

## Service Architecture

**Monolithic SvelteKit application with server-side API routes**. The application will use SvelteKit's built-in server capabilities (+server.ts routes) to handle:
- Authentication and session management
- Database operations via Drizzle ORM
- AI API calls to external services (Anthropic/OpenAI)
- Business logic for formatting prompts and parsing responses

This approach leverages SvelteKit's full-stack capabilities, avoiding the complexity of separate frontend/backend services for an MVP.

## Testing Requirements

**Unit testing for critical business logic** including:
- Prompt formatting logic (converting user responses to grader prompt input format)
- Response parsing logic (extracting scores and structured data from AI output)
- Authentication and authorization logic
- Database schema validation

**Integration testing** for key user flows:
- Complete assessment submission and grading workflow
- User registration and login flow
- Progress save/resume functionality

**Manual testing** for UI/UX validation and AI response handling edge cases.

Focus on automated tests for data integrity and business logic; manual validation for user experience and AI integration quality.

## Additional Technical Assumptions and Requests

- **AI Provider**: Use Anthropic Claude API (Sonnet 4.5 or similar) for grading evaluations as recommended in the grader prompt. Fallback to OpenAI GPT-4+ if needed.
- **Session Management**: Use SvelteKit's built-in session handling with secure HTTP-only cookies
- **Database Migrations**: Drizzle Kit for schema migrations and version control
- **Environment Configuration**: Support for local development (SQLite/PostgreSQL) and production (PostgreSQL) environments
- **Error Handling**: Structured error responses from API routes with appropriate user-facing messages for common failures (AI timeout, network issues, validation errors)
- **Deployment Target**: Designed for deployment to Vercel, Netlify, or similar platforms that support SvelteKit with PostgreSQL database connection
- **AI Response Parsing**: Implement robust parsing to handle variations in AI output format while extracting the structured sections (scores, roadmap, etc.)
- **Data Retention**: Store both raw AI responses and parsed structured data for audit trail and future re-parsing if needed

---
