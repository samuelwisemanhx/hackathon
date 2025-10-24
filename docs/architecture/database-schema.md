# Database Schema

PostgreSQL database schema with Drizzle ORM definitions.

## Drizzle Schema Definitions

```typescript
// src/lib/server/db/schema.ts
import { pgTable, uuid, varchar, timestamp, text, integer, decimal, pgEnum } from 'drizzle-orm/pg-core';

export const assessmentStatusEnum = pgEnum('assessment_status', [
  'in_progress', 'submitted', 'graded'
]);

export const velocityRatingEnum = pgEnum('velocity_rating', [
  'LOW', 'MEDIUM', 'HIGH'
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const assessments = pgTable('assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: assessmentStatusEnum('status').notNull().default('in_progress'),
  version: varchar('version', { length: 50 }).notNull().default('v1.0'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  submittedAt: timestamp('submitted_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const assessmentResponses = pgTable('assessment_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  assessmentId: uuid('assessment_id').notNull().references(() => assessments.id, { onDelete: 'cascade' }),
  partNumber: integer('part_number').notNull(),
  questionId: varchar('question_id', { length: 100 }).notNull(),
  responseText: text('response_text').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const evaluationResults = pgTable('evaluation_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  assessmentId: uuid('assessment_id').notNull().unique().references(() => assessments.id, { onDelete: 'cascade' }),
  rawResponse: text('raw_response').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const evaluationScores = pgTable('evaluation_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  evaluationId: uuid('evaluation_id').notNull().references(() => evaluationResults.id, { onDelete: 'cascade' }),
  componentName: varchar('component_name', { length: 100 }).notNull(),
  score: decimal('score', { precision: 4, scale: 2 }).notNull(),
  weight: decimal('weight', { precision: 3, scale: 2 }).notNull(),
  level: varchar('level', { length: 50 }).notNull(),
  justification: text('justification').notNull(),
  nextLevelGuidance: text('next_level_guidance').notNull()
});

export const evaluationMetadata = pgTable('evaluation_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  evaluationId: uuid('evaluation_id').notNull().unique().references(() => evaluationResults.id, { onDelete: 'cascade' }),
  overallScore: decimal('overall_score', { precision: 4, scale: 2 }).notNull(),
  velocityRating: velocityRatingEnum('velocity_rating').notNull(),
  velocityAnalysis: text('velocity_analysis').notNull(),
  brutalTruth: text('brutal_truth').notNull(),
  criticalBottleneck: varchar('critical_bottleneck', { length: 200 }).notNull(),
  bottleneckWhy: text('bottleneck_why').notNull(),
  bottleneckCriteria: text('bottleneck_criteria').notNull(),
  immediateAction: text('immediate_action').notNull()
});

export const evaluationRoadmap = pgTable('evaluation_roadmap', {
  id: uuid('id').primaryKey().defaultRandom(),
  evaluationId: uuid('evaluation_id').notNull().references(() => evaluationResults.id, { onDelete: 'cascade' }),
  weekRange: varchar('week_range', { length: 50 }).notNull(),
  competency: varchar('competency', { length: 200 }).notNull(),
  focus: varchar('focus', { length: 200 }).notNull(),
  exercise: text('exercise').notNull(),
  successCriteria: text('success_criteria').notNull(),
  timeInvestment: varchar('time_investment', { length: 100 }).notNull()
});
```

## Database Configuration

```typescript
// src/lib/server/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ai_assessment',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });
```

---
