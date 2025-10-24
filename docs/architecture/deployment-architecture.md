# Deployment Architecture

## GCP Cloud Run Deployment

**Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV PORT=8080
EXPOSE 8080

CMD ["node", "build/index.js"]
```

**SvelteKit Config:**
```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-node';

export default {
  kit: {
    adapter: adapter({
      out: 'build',
      precompress: true
    })
  }
};
```

**Manual Deployment:**
```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-assessment

# Deploy to Cloud Run
gcloud run deploy ai-assessment \
  --image gcr.io/PROJECT_ID/ai-assessment \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances PROJECT_ID:REGION:INSTANCE \
  --set-secrets ANTHROPIC_API_KEY=anthropic-key:latest \
  --memory 512Mi \
  --timeout 300
```

**CI/CD (GitHub Actions):**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SERVICE_ACCOUNT }}
      - run: gcloud builds submit --tag gcr.io/$PROJECT_ID/ai-assessment
      - run: gcloud run deploy ai-assessment --image gcr.io/$PROJECT_ID/ai-assessment
```

---
