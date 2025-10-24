# Production Readiness Checklist

## Security
- [ ] No secrets in code (use Secret Manager)
- [ ] HTTPS enforced (Cloud Run default)
- [ ] SQL injection prevented (Drizzle ORM parameterized queries)
- [ ] XSS prevented (Svelte auto-escaping)
- [ ] CORS configured appropriately

## Performance
- [ ] Database indexes on user_id, assessment_id, status
- [ ] Connection pooling configured (max 20)
- [ ] Cloud CDN enabled for static assets
- [ ] Response compression enabled (precompress: true)

## Monitoring
- [ ] Cloud Logging capturing all errors
- [ ] Cloud Monitoring alerting on error rate
- [ ] Cost tracking for Anthropic API usage
- [ ] Database query performance monitoring

## Production Auth Migration
- [ ] Add password_hash column to users table
- [ ] Implement proper registration/login endpoints
- [ ] Add session management
- [ ] Force password reset for existing email-only users
- [ ] Remove MVP warning banner

---
