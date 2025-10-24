# Epic 3: AI Evaluation & Results

Integrate AI-powered evaluation using the grader prompt, implement response parsing and structured data extraction, build results display UI, and provide assessment history functionality. This epic completes the value proposition by delivering personalized evaluations and enabling users to track improvement over time.

---

## Story 3.1: Evaluation Results Data Schema

As a **developer**,
I want **database schema for storing evaluation results**,
so that **I can persist both raw AI responses and parsed structured data**.

**Acceptance Criteria:**

1. Evaluation_results table created with fields: id (UUID), assessment_id (FK unique), raw_response (text), created_at, updated_at
2. Evaluation_scores table created with fields: id (UUID), evaluation_id (FK), component_name (string), score (decimal), weight (decimal), justification (text), next_level_guidance (text)
3. Evaluation_metadata table created with fields: id (UUID), evaluation_id (FK), overall_score (decimal), velocity_rating (enum: LOW/MEDIUM/HIGH), velocity_analysis (text), brutal_truth (text), critical_bottleneck (text), bottleneck_why (text), bottleneck_criteria (text), immediate_action (text)
4. Evaluation_roadmap table created with fields: id (UUID), evaluation_id (FK), week_range (string), competency (string), focus (string), exercise (text), success_criteria (text), time_investment (string)
5. All tables have appropriate foreign key constraints and indexes
6. Migration script creates tables successfully
7. Schema supports one evaluation per assessment with cascade delete rules
8. Drizzle schema types exported for application use

---

## Story 3.2: AI API Integration and Prompt Formatting

As a **developer**,
I want **to format assessment responses and send them to the AI API with the grader prompt**,
so that **I can generate evaluation results**.

**Acceptance Criteria:**

1. Assessment response formatter converts database responses into required input format (PART 1 through PART 6 structure)
2. Grader prompt text is loaded from `/docs/prompts/ai-test-grader-prompt.md` or configured constant
3. POST `/api/assessments/:id/evaluate` endpoint triggers evaluation for submitted assessment
4. AI API client configured for Anthropic Claude (Sonnet 4.5) with proper authentication
5. Request includes both the grader prompt system instructions and formatted user assessment responses
6. API client handles timeouts (120 second timeout minimum given evaluation complexity)
7. Successful AI response is stored as raw_response in evaluation_results table
8. Assessment status updated to "graded" upon successful evaluation
9. Error handling for API failures (rate limits, timeouts, invalid responses) with appropriate user messaging
10. Unit tests verify prompt formatting produces correct structure

---

## Story 3.3: AI Response Parsing and Data Extraction

As a **developer**,
I want **to parse AI evaluation responses into structured data**,
so that **I can display results in an organized, accessible format**.

**Acceptance Criteria:**

1. Parser extracts Component Scores section (5 components with scores, levels, justifications, next level guidance)
2. Parser extracts Overall Score calculation and competitive context
3. Parser extracts Velocity Assessment (rating, evidence, risk analysis)
4. Parser extracts Brutal Truth section
5. Parser extracts Critical Bottleneck (name, why it matters, how to know it's fixed)
6. Parser extracts 90-Day Roadmap (4 time periods with all fields per period)
7. Parser extracts Immediate Action Item
8. Parsed data is stored in evaluation_scores, evaluation_metadata, and evaluation_roadmap tables
9. Parser handles variations in AI output format gracefully (robust regex/markdown parsing)
10. Parse errors are logged but don't prevent storage of raw_response
11. Unit tests cover parsing logic with sample AI responses

---

## Story 3.4: Evaluation Processing Workflow

As a **user who submitted an assessment**,
I want **my evaluation to be generated automatically after submission**,
so that **I receive my results without additional action**.

**Acceptance Criteria:**

1. After assessment submission, user is redirected to `/assessment/:id/processing` page
2. Processing page shows engaging wait state with message "Generating your evaluation... This may take 60-90 seconds"
3. Processing page polls GET `/api/assessments/:id/status` endpoint every 5 seconds to check evaluation status
4. Backend triggers evaluation asynchronously after assessment submission (or synchronously with long timeout)
5. When status changes to "graded", processing page redirects to `/assessment/:id/results`
6. If evaluation fails, processing page shows error message with option to retry or contact support
7. Processing page includes progress indicator or animation to indicate active work
8. Timeout handling: if evaluation takes longer than 3 minutes, show extended wait message
9. User cannot navigate away without warning during processing

---

## Story 3.5: Results Display - Scores and Summary

As a **user viewing evaluation results**,
I want **to see my component scores, overall score, and competitive context**,
so that **I understand my current AI fluency level**.

**Acceptance Criteria:**

1. `/assessment/:id/results` page displays evaluation results for graded assessment
2. Overall score prominently displayed at top with visual indicator (e.g., 6.2/10.0)
3. Competitive context shown (e.g., "Competitive - Solid foundation for growth")
4. Five component scores displayed with score, weight, and level descriptor
5. Each component is expandable to show full justification and "to reach next level" guidance
6. Velocity rating (LOW/MEDIUM/HIGH) displayed with supporting evidence
7. Visual design uses progressive disclosure: summary visible, details expandable
8. Scores use visual elements (progress bars, badges) for scannability
9. Page is mobile-responsive with appropriate layout for small screens
10. Results page includes timestamp of when evaluation was completed

---

## Story 3.6: Results Display - Analysis and Roadmap

As a **user viewing evaluation results**,
I want **to see the brutal truth, critical bottleneck, and my personalized 90-day roadmap**,
so that **I have actionable guidance for improvement**.

**Acceptance Criteria:**

1. "Brutal Truth" section displays the honest assessment of current standing
2. "Critical Bottleneck" section prominently displays the single most limiting factor with explanation
3. Bottleneck includes "How you'll know it's fixed" criteria as checklist
4. "Immediate Action Item" displayed in highlighted/prominent section with task, time required, and success criteria
5. 90-Day Roadmap displays 4 time periods (Weeks 1-2, 3-4, 5-8, 9-12) in timeline or accordion format
6. Each roadmap period shows: competency, focus, concrete exercise, success criteria, time investment
7. Roadmap exercises preserve full detail from AI response (markdown formatting maintained)
8. User can expand/collapse roadmap sections for readability
9. Results page includes option to download/print full evaluation report
10. All sections maintain readability and hierarchy on mobile devices

---

## Story 3.7: Assessment History and Dashboard

As a **user with completed assessments**,
I want **to view my assessment history and track my progress over time**,
so that **I can see how my AI fluency has improved**.

**Acceptance Criteria:**

1. Dashboard (`/dashboard`) displays list of user's assessments with status (in-progress, submitted, graded)
2. Each assessment in list shows: date started, date completed, overall score (if graded), status
3. In-progress assessments show progress percentage and "Resume" button
4. Graded assessments show "View Results" button linking to results page
5. Submitted-but-not-graded assessments show "Processing" or "View Status" option
6. Assessments are sorted by most recent first
7. If user has multiple graded assessments, dashboard shows score trend (e.g., "Improved from 5.2 to 6.8")
8. Dashboard includes "Start New Assessment" button (only enabled if no in-progress assessment exists)
9. Empty state shown if user has no assessments with clear CTA to start first one
10. Historical results pages are read-only (cannot edit past assessments)

---
