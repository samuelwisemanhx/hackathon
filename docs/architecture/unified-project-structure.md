# Unified Project Structure

```text
ai-skills-assessment/
├── .github/workflows/
│   └── deploy.yml                # GCP Cloud Run deployment
├── drizzle/migrations/           # Generated SQL migrations
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn-svelte components
│   │   │   ├── assessment/       # Assessment UI
│   │   │   ├── evaluation/       # Results display
│   │   │   ├── layout/           # Header, Footer
│   │   │   └── shared/           # Shared utilities
│   │   ├── server/
│   │   │   ├── db/
│   │   │   │   ├── schema.ts     # Drizzle schema
│   │   │   │   └── index.ts      # DB connection
│   │   │   ├── services/
│   │   │   │   ├── auth.ts       # Email identification
│   │   │   │   ├── assessment.ts # Assessment logic
│   │   │   │   └── evaluation.ts # AI evaluation
│   │   │   └── repositories/
│   │   │       ├── user.ts
│   │   │       ├── assessment.ts
│   │   │       └── evaluation.ts
│   │   ├── services/
│   │   │   └── api.ts            # Frontend API client
│   │   ├── stores/
│   │   │   ├── assessment.svelte.ts
│   │   │   └── user.svelte.ts
│   │   ├── types/
│   │   │   └── index.ts          # Shared TypeScript types
│   │   ├── config/
│   │   │   ├── questions.ts      # Assessment questions
│   │   │   └── grader-prompt.ts  # AI grader prompt
│   │   └── utils/
│   │       ├── validation.ts     # Zod schemas
│   │       └── logger.ts         # Pino logger
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte          # Email entry
│   │   ├── dashboard/
│   │   ├── assessment/
│   │   └── api/
│   ├── hooks.server.ts           # Auth middleware
│   └── app.d.ts
├── static/
├── tests/
├── .env.example
├── Dockerfile                    # Cloud Run deployment
├── package.json
├── drizzle.config.ts
├── svelte.config.js
├── tailwind.config.js
└── README.md
```

---
