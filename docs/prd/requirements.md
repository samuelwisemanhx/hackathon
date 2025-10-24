# Requirements

## Functional

**FR1:** The system shall provide user registration functionality with email and password validation

**FR2:** The system shall provide secure user authentication with login/logout capabilities

**FR3:** The system shall parse and present the AI Fluency Assessment as an interactive multi-part questionnaire with 6 main parts (Core Skill Tests, Technical Understanding, Critical Evaluation, Practical Application, Velocity Self-Assessment, Tools & Techniques)

**FR3.1:** The system shall support multiple question types: text input (short/long), checkbox lists, numbered response fields, and structured multi-step workflows

**FR3.2:** The system shall preserve user progress allowing users to save and resume incomplete assessments

**FR4:** The system shall present assessment questions to authenticated users in a structured, sequential interface with clear section navigation

**FR5:** The system shall capture and validate user responses including required field validation and format checking

**FR6:** The system shall persist complete assessment responses to the PostgreSQL database with user linkage, timestamp, and version tracking

**FR7:** The system shall format completed assessment responses into the required input format (PART 1 through PART 6 structure) and send to AI backend with the grader prompt

**FR8:** The system shall retrieve and parse AI-generated evaluation results including:
- Five component scores (Prompt Mastery, Technical Understanding, Practical Application, Critical Evaluation, Workflow Design) with justifications
- Overall weighted score calculation
- Velocity assessment (LOW/MEDIUM/HIGH)
- Brutal truth analysis
- Critical bottleneck identification
- 90-day improvement roadmap (4 time periods with concrete exercises)
- Immediate action item

**FR9:** The system shall display formatted evaluation results to users with clear presentation of scores, analysis, and personalized recommendations in an accessible format

**FR10:** The system shall allow users to view their assessment history including past assessments, scores, and recommendations to track improvement over time

## Non Functional

**NFR1:** The application shall be built using Svelte 5 and SvelteKit 2 framework

**NFR2:** The application shall use PostgreSQL database with Drizzle ORM for data persistence

**NFR3:** The system shall ensure secure password storage using industry-standard hashing algorithms

**NFR4:** The application shall provide responsive UI compatible with desktop and mobile devices

**NFR5:** AI backend requests shall have appropriate timeout handling (assessment grading may take 30-90 seconds for complex analysis) with user feedback during processing

**NFR6:** The assessment interface shall maintain user context and prevent data loss during long-form completion (25-35 minute expected duration)

**NFR7:** The system shall format AI-generated evaluation output for readability, preserving markdown formatting and structured sections

---
