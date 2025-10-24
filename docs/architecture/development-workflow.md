# Development Workflow

## Local Development Setup

**Prerequisites:**
```bash
node >= 20.x
npm >= 10.x
postgresql >= 15.x
```

**Initial Setup:**
```bash
git clone <repo-url>
cd ai-skills-assessment
npm install

createdb ai_assessment

cp .env.example .env
# Edit .env with DB credentials and ANTHROPIC_API_KEY

npm run db:push
npm run dev
```

**Development Commands:**
```bash
npm run dev                    # Start dev server (localhost:5173)
npm run db:generate            # Generate migration
npm run db:push               # Push schema to DB (dev)
npm run db:studio             # Open Drizzle Studio
npm run test                  # Run all tests
npm run build                 # Production build
npm run preview               # Preview production build
```

**Environment Variables:**
```bash
# .env.example

# Database (Local)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_assessment
DB_USER=postgres
DB_PASSWORD=your_password

# Database (GCP Cloud SQL - Production)
# DB_HOST=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME

# AI Provider
ANTHROPIC_API_KEY=sk-ant-api03-...

# Application
PUBLIC_APP_URL=http://localhost:5173
NODE_ENV=development
```

---
