# Architecture Decision Records

## ADR-001: GCP Cloud Run for Deployment
**Status:** Accepted
**Context:** Need to deploy SvelteKit application with 30-90s AI evaluation requests
**Decision:** Use GCP Cloud Run with Node adapter
**Consequences:** No timeout concerns (60min limit), auto-scaling, pay-per-use pricing

## ADR-002: Simplified Auth for MVP
**Status:** Accepted (Temporary)
**Context:** Need to ship MVP quickly without full auth implementation
**Decision:** Email-only identification with cookie, no passwords
**Consequences:** Faster MVP, clear migration path to production auth, visible warning banner required

## ADR-003: Svelte 5 Runes Over External State Management
**Status:** Accepted
**Context:** Need reactive state for complex assessment forms
**Decision:** Use native Svelte 5 runes instead of Redux/Zustand
**Consequences:** Simpler architecture, type-safe, no additional dependencies

## ADR-004: Store Raw AI Response + Parsed Data
**Status:** Accepted
**Context:** AI output format may change over time
**Decision:** Store both raw_response text and parsed structured tables
**Consequences:** Can re-parse if needed, audit trail, slightly more storage

---

**Document Complete - Ready for Implementation**

This architecture provides the foundation for building the AI Skills Assessment Application. All critical design decisions have been documented with clear rationale. Developers can now proceed with implementation following these specifications.
