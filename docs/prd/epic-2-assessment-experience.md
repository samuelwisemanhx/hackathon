# Epic 2: Assessment Experience

Build the complete interactive assessment experience including data models for the 6-part questionnaire, dynamic UI for presenting questions and capturing responses, auto-save functionality for progress persistence, and assessment submission workflow. This epic delivers the ability for users to complete and save their AI fluency assessments.

---

## Story 2.1: Assessment Data Models and Schema

As a **developer**,
I want **database schema for assessments and responses**,
so that **I can store user assessment data with proper structure and relationships**.

**Acceptance Criteria:**

1. Assessments table created with fields: id (UUID), user_id (FK), status (enum: in_progress, submitted, graded), version (string), started_at, submitted_at, updated_at
2. Assessment_responses table created with fields: id (UUID), assessment_id (FK), part_number (1-6), question_id (string), response_text (text), updated_at
3. Database indexes added on user_id, assessment_id, and status for query performance
4. Schema supports multiple assessments per user with proper foreign key constraints
5. Migration script creates tables successfully
6. Drizzle schema types exported for application use
7. Status enum properly constrains values in database

---

## Story 2.2: Assessment Question Configuration

As a **developer**,
I want **the assessment prompt parsed into a structured configuration**,
so that **I can dynamically render questions in the UI**.

**Acceptance Criteria:**

1. TypeScript configuration file defines all 6 parts with their questions, types, and metadata
2. Question types supported: text_short, text_long, checklist, numbered_steps, multi_field
3. Each question includes: id, title, instruction text, question type, required flag, placeholder text where applicable
4. Part 1 (Core Skill Tests) includes TEST 1, TEST 2, and TEST 3 with their structured fields
5. Parts 2-6 map to their respective questions from the assessment prompt
6. Configuration is type-safe and importable throughout the application
7. Question metadata includes character limits, validation rules, and help text
8. Configuration structure allows for future versioning of assessment questions

---

## Story 2.3: Start Assessment and Load Assessment State

As a **logged-in user**,
I want **to start a new assessment or resume an in-progress assessment**,
so that **I can complete the evaluation at my own pace**.

**Acceptance Criteria:**

1. Dashboard shows "Start Assessment" button if user has no in-progress assessment
2. Dashboard shows "Resume Assessment" button with progress indicator if assessment is in-progress
3. Dashboard shows "View Results" link if user has completed/graded assessments
4. POST `/api/assessments/start` endpoint creates new assessment record with status "in_progress"
5. GET `/api/assessments/current` endpoint returns current in-progress assessment with all saved responses
6. Starting new assessment while one is in-progress returns error (user must complete or abandon first)
7. Assessment state includes progress percentage based on answered questions
8. Clicking start/resume navigates to `/assessment` route with assessment loaded

---

## Story 2.4: Assessment Question UI - Part 1 (Core Skill Tests)

As a **user taking the assessment**,
I want **to answer Part 1 questions (TEST 1, TEST 2, TEST 3) in an intuitive interface**,
so that **I can provide my responses to the core skill tests**.

**Acceptance Criteria:**

1. `/assessment` route displays Part 1 with clear section header and instructions
2. TEST 1 includes: improved prompt text area, context checklist with 6 checkboxes
3. TEST 2 includes: number of iterations field, iteration 1/2/3 text areas, completion criteria text area
4. TEST 3 includes: task description field, 5 step fields (Preparation, Initial Prompt, Iteration, Quality Check, Integration), tools used field
5. Each field shows character count and validation feedback
6. Required fields are clearly marked
7. Help text and examples are shown contextually (collapsible/tooltip)
8. Form is keyboard navigable with proper tab order
9. Mobile-responsive layout adjusts field sizes appropriately

---

## Story 2.5: Assessment Question UI - Parts 2-6

As a **user taking the assessment**,
I want **to answer Parts 2-6 questions in a clear, organized interface**,
so that **I can complete the Technical Understanding, Critical Evaluation, Practical Application, Velocity, and Tools sections**.

**Acceptance Criteria:**

1. Part 2 (Technical Understanding) displays 5 questions (Q1-Q5) with text area inputs
2. Part 3 (Critical Evaluation) displays 5 questions (Q1-Q5) with text area inputs
3. Part 4 (Practical Application) displays Q1-Q6 including structured time-savings list format for Q2
4. Part 5 (Velocity Self-Assessment) displays Q1-Q6 with radio buttons for Q4 skill acquisition speed
5. Part 6 (Tools & Techniques) displays optional advanced tools and prompting frameworks questions
6. Each part has clear section headers matching the assessment prompt structure
7. Question numbering is consistent with source assessment (Q1, Q2, etc.)
8. Text areas auto-expand as user types
9. All parts are accessible via navigation or sequential progression

---

## Story 2.6: Progress Navigation and Auto-Save

As a **user taking the assessment**,
I want **my progress automatically saved and easy navigation between sections**,
so that **I don't lose my work and can move freely through the assessment**.

**Acceptance Criteria:**

1. Progress bar at top shows completion percentage across all 6 parts
2. Section navigation allows jumping to any part (Part 1-6) with visual indication of completion status
3. "Next" and "Previous" buttons navigate between parts sequentially
4. Auto-save triggers 2 seconds after user stops typing in any field
5. PUT `/api/assessments/:id/responses` endpoint saves responses with optimistic locking to prevent conflicts
6. Visual indicator shows "Saving..." and "Saved" states
7. Navigating away from assessment shows warning if there are unsaved changes (browser beforeunload)
8. All responses are preserved when user returns to in-progress assessment
9. Progress calculation marks part as complete when all required fields have content
10. Navigation is keyboard accessible

---

## Story 2.7: Assessment Submission

As a **user completing the assessment**,
I want **to review and submit my completed assessment**,
so that **I can receive my AI-generated evaluation**.

**Acceptance Criteria:**

1. "Submit Assessment" button appears when all required fields across all 6 parts are completed
2. Submit button is disabled if any required fields are incomplete, with clear messaging about what's missing
3. Clicking submit shows confirmation modal with summary: "You are submitting [X] responses across 6 parts. This will generate your evaluation."
4. Confirmed submission updates assessment status to "submitted" in database
5. POST `/api/assessments/:id/submit` endpoint validates completeness and changes status
6. After submission, user is redirected to processing page showing "Generating your evaluation..."
7. Submitted assessments cannot be edited (responses are locked)
8. Validation provides specific feedback if fields are incomplete (e.g., "Part 3, Question 2 is required")

---
