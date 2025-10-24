# External APIs

## Anthropic Claude API

**Purpose:** Generates AI-powered assessment evaluations including component scores, velocity analysis, brutal truth feedback, and personalized 90-day improvement roadmaps.

**Documentation:** https://docs.anthropic.com/claude/reference/

**Base URL:** `https://api.anthropic.com/v1`

**Authentication:** API Key via `x-api-key` header (stored in GCP Secret Manager)

**Rate Limits:**
- Tier 1: 50 requests/minute, 40,000 tokens/minute
- Error code 429 for rate limit exceeded

**Key Endpoint:**

**POST /v1/messages** - Create evaluation
```json
{
  "model": "claude-sonnet-4-5-20250514",
  "max_tokens": 8000,
  "temperature": 1.0,
  "system": "{{grader_prompt}}",
  "messages": [{"role": "user", "content": "{{assessment_responses}}"}]
}
```

**Integration Notes:**
- Request timeout: 120 seconds minimum (AI evaluation takes 30-90s)
- Cloud Run supports up to 60 minutes (no timeout concerns)
- Store complete response in `raw_response` field
- Parse markdown sections using regex
- Retry strategy: exponential backoff for 5xx errors, queue for 429 rate limits
- Cost: ~$0.075 per evaluation (~$75/month for 1,000 assessments)

**Error Handling:**
- 429 Rate Limit: Queue and retry after delay
- 500/503 Service Error: Retry up to 3 times with exponential backoff
- Timeout: Retry once, then show user error with manual retry option

---
