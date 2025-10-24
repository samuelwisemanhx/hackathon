# API Specification

REST API specification for all endpoints required by the PRD epics.

## OpenAPI 3.0 Specification

```yaml
openapi: 3.0.0
info:
  title: AI Skills Assessment API
  version: 1.0.0
  description: RESTful API for AI Skills Assessment Application built with SvelteKit
servers:
  - url: https://{domain}/api
    description: Production API (GCP Cloud Run)
  - url: http://localhost:5173/api
    description: Local development server

components:
  securitySchemes:
    cookieAuth:
      type: apiKey
      in: cookie
      name: user_email
      description: Email stored in cookie (MVP - no real auth)

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        createdAt:
          type: string
          format: date-time

    Assessment:
      type: object
      properties:
        id:
          type: string
          format: uuid
        userId:
          type: string
          format: uuid
        status:
          type: string
          enum: [in_progress, submitted, graded]
        version:
          type: string
        startedAt:
          type: string
          format: date-time
        submittedAt:
          type: string
          format: date-time
          nullable: true
        updatedAt:
          type: string
          format: date-time

    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: object

paths:
  /auth/identify:
    post:
      summary: Set user identity (MVP only - no authentication)
      description: Accepts email address and finds or creates user
      tags: [Authentication]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email]
              properties:
                email:
                  type: string
                  format: email
      responses:
        '200':
          description: User identified
          headers:
            Set-Cookie:
              schema:
                type: string
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

  /assessments:
    get:
      summary: List user's assessments
      security:
        - cookieAuth: []
      responses:
        '200':
          description: List of assessments

    post:
      summary: Start new assessment
      security:
        - cookieAuth: []
      responses:
        '201':
          description: Assessment created

  /assessments/current:
    get:
      summary: Get current in-progress assessment
      security:
        - cookieAuth: []
      responses:
        '200':
          description: Current assessment with responses

  /assessments/{assessmentId}/responses:
    put:
      summary: Save assessment responses (auto-save)
      security:
        - cookieAuth: []
      parameters:
        - name: assessmentId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Responses saved

  /assessments/{assessmentId}/submit:
    post:
      summary: Submit assessment for grading
      security:
        - cookieAuth: []
      parameters:
        - name: assessmentId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Assessment submitted

  /assessments/{assessmentId}/status:
    get:
      summary: Check assessment status (for polling)
      security:
        - cookieAuth: []
      parameters:
        - name: assessmentId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Current status

  /assessments/{assessmentId}/evaluation:
    get:
      summary: Get evaluation results
      security:
        - cookieAuth: []
      parameters:
        - name: assessmentId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Complete evaluation results
```

---
