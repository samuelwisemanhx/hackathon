# Frontend Architecture

## Component Organization

```text
src/lib/components/
├── ui/                          # shadcn-svelte components
├── assessment/                  # Assessment-specific components
│   ├── QuestionText.svelte
│   ├── QuestionTextarea.svelte
│   ├── QuestionChecklist.svelte
│   ├── ProgressBar.svelte
│   └── AutoSaveIndicator.svelte
├── evaluation/                  # Results display
│   ├── ScoreSummary.svelte
│   ├── ComponentScore.svelte
│   ├── VelocityBadge.svelte
│   └── RoadmapTimeline.svelte
├── layout/
│   ├── Header.svelte
│   ├── SecurityWarning.svelte   # MVP auth warning
│   └── LoadingSpinner.svelte
└── shared/
    ├── ErrorMessage.svelte
    └── ConfirmModal.svelte
```

## State Management

Using Svelte 5 runes - no external state management library needed.

```typescript
// src/lib/stores/assessment.svelte.ts
class AssessmentState {
  currentAssessment = $state<Assessment | null>(null);
  responses = $state<Map<string, AssessmentResponse>>(new Map());
  currentPart = $state(1);

  progressPercentage = $derived(() => {
    // Calculate from responses
  });

  updateResponse(partNumber: number, questionId: string, text: string) {
    // Update response in map
  }
}

export const assessmentState = new AssessmentState();
```

## Routing Structure

```text
src/routes/
├── +page.svelte                 # Email entry landing
├── dashboard/
│   └── +page.svelte             # Assessment list
├── assessment/
│   ├── +page.svelte             # Assessment interface
│   └── [assessmentId]/
│       ├── processing/
│       │   └── +page.svelte     # "Generating evaluation..."
│       └── results/
│           └── +page.svelte     # Results display
└── api/
    ├── auth/identify/+server.ts
    └── assessments/
        ├── +server.ts
        ├── current/+server.ts
        └── [assessmentId]/
            ├── responses/+server.ts
            ├── submit/+server.ts
            ├── status/+server.ts
            └── evaluation/+server.ts
```

---
