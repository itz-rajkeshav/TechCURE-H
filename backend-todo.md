# Backend Todo - LearnPath

## Overview

For the **MVP**, LearnPath uses static JSON data with no backend required. This document covers:
1. MVP data management (static files)
2. Future backend features (v2.0+)
3. API design for future implementation
4. Database schema for future scaling

---

## Phase 1: MVP Static Data (Priority: High)

### 1.1 Data File Structure
- [x] Create `lib/data/physics12.ts` - Class 12 Physics (CBSE)
- [x] Define TypeScript interfaces
- [x] Export subject data as constant
- [x] Add type safety

### 1.2 Data Content
- [x] Add 12 topics with complete metadata
- [x] Verify exam weight percentages
- [x] Add common mistakes (2-3 per topic)
- [x] Set estimated study times
- [x] Define prerequisite dependencies
- [x] Set flow diagram positions

### 1.3 Data Utilities
- [x] Create `lib/data/index.ts` export file
- [x] Add helper to get subject by ID
- [x] Add helper to get topic by ID
- [x] Add helper to get topics by priority
- [x] Add data validation functions

### 1.4 Additional Subjects (Future)
- [ ] Create `lib/data/chemistry12.ts` (v1.1)
- [ ] Create `lib/data/mathematics12.ts` (v1.1)
- [ ] Create `lib/data/physics11.ts` (v1.1)
- [ ] Create data for JEE/NEET variants (v1.2)

---

## Phase 2: API Design (Future v2.0)

### 2.1 REST API Endpoints

#### Subjects API
```
GET /api/subjects
- Returns list of all subjects
- Query params: course, class
- Response: Subject[]

GET /api/subjects/:id
- Returns single subject with topics
- Response: Subject

GET /api/subjects/:id/topics
- Returns all topics for subject
- Query params: priority, depth
- Response: Topic[]
```

#### Topics API
```
GET /api/topics/:id
- Returns single topic details
- Response: Topic

GET /api/topics/:id/dependencies
- Returns prerequisite topics
- Response: Topic[]

GET /api/topics/:id/dependents
- Returns topics that depend on this
- Response: Topic[]
```

#### Search API
```
GET /api/search?q={query}
- Search topics across all subjects
- Query params: subject, course
- Response: SearchResult[]
```

### 2.2 API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

interface ApiError {
  success: false;
  error: string;
  code: string;
}
```

---

## Phase 3: Database Schema (Future v2.0)

### 3.1 PostgreSQL Schema

```sql
-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    name VARCHAR(100) NOT NULL,
    level INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    exam_type VARCHAR(50), -- 'board', 'jee', 'neet', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, code)
);

-- Topics table
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subjects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    exam_weight DECIMAL(5,2), -- percentage
    required_depth VARCHAR(20) CHECK (required_depth IN ('Master', 'Understand', 'Familiar')),
    estimated_time VARCHAR(50),
    priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')),
    flow_position_x INT DEFAULT 0,
    flow_position_y INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Common mistakes table
CREATE TABLE topic_mistakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    mistake TEXT NOT NULL,
    solution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dependencies table (self-referencing many-to-many)
CREATE TABLE topic_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    depends_on_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(topic_id, depends_on_id)
);

-- Users table (for v2.0)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed')),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, topic_id)
);

-- Indexes
CREATE INDEX idx_subjects_class ON subjects(class_id);
CREATE INDEX idx_topics_subject ON topics(subject_id);
CREATE INDEX idx_topics_priority ON topics(priority);
CREATE INDEX idx_dependencies_topic ON topic_dependencies(topic_id);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
```

### 3.2 Database Relationships
```
courses
  └── classes
        └── subjects
              └── topics
                    ├── topic_mistakes
                    ├── topic_dependencies (self-referencing)
                    └── user_progress (via users)
```

---

## Phase 4: Server Implementation (Future v2.0)

### 4.1 Tech Stack Options

**Option A: Next.js API Routes**
- Pros: Same codebase, easy deployment
- Cons: Serverless limitations
- Best for: Small to medium scale

**Option B: Express.js + Node.js**
- Pros: Full control, mature ecosystem
- Cons: Separate deployment
- Best for: Large scale, complex logic

**Option C: Serverless Functions**
- Pros: Cost-effective, auto-scaling
- Cons: Cold starts, complexity
- Best for: Variable traffic

### 4.2 Next.js API Routes Structure
```
app/
├── api/
│   ├── subjects/
│   │   ├── route.ts          # GET /api/subjects
│   │   └── [id]/
│   │       ├── route.ts      # GET /api/subjects/:id
│   │       └── topics/
│   │           └── route.ts  # GET /api/subjects/:id/topics
│   ├── topics/
│   │   └── [id]/
│   │       ├── route.ts      # GET /api/topics/:id
│   │       ├── dependencies/
│   │       │   └── route.ts  # GET /api/topics/:id/dependencies
│   │       └── dependents/
│   │           └── route.ts  # GET /api/topics/:id/dependents
│   └── search/
│       └── route.ts          # GET /api/search
```

### 4.3 API Implementation Tasks

#### Subjects Routes
- [ ] Implement GET /api/subjects
- [ ] Add filtering by course and class
- [ ] Implement pagination
- [ ] Add caching headers

- [ ] Implement GET /api/subjects/:id
- [ ] Include topics in response
- [ ] Handle 404 errors

- [ ] Implement GET /api/subjects/:id/topics
- [ ] Add priority filtering
- [ ] Add sorting options

#### Topics Routes
- [ ] Implement GET /api/topics/:id
- [ ] Include mistakes in response
- [ ] Include dependencies

- [ ] Implement GET /api/topics/:id/dependencies
- [ ] Return full topic objects
- [ ] Handle circular dependencies

- [ ] Implement GET /api/topics/:id/dependents
- [ ] Return topics that require this

#### Search Route
- [ ] Implement GET /api/search
- [ ] Add full-text search
- [ ] Implement fuzzy matching
- [ ] Add result ranking

---

## Phase 5: Authentication (Future v2.0)

### 5.1 Auth Options

**Option A: Clerk**
- Pros: Easy setup, great DX
- Cons: Paid for scale
- Implementation: @clerk/nextjs

**Option B: NextAuth.js**
- Pros: Free, flexible
- Cons: More setup required
- Implementation: next-auth

**Option C: Supabase Auth**
- Pros: Integrated with DB
- Cons: Vendor lock-in
- Implementation: @supabase/supabase-js

### 5.2 Auth Implementation
- [ ] Set up authentication provider
- [ ] Configure OAuth providers (Google, GitHub)
- [ ] Implement sign-in/sign-out flows
- [ ] Protect API routes
- [ ] Add middleware for route protection
- [ ] Implement user profile page

### 5.3 Protected Routes
```typescript
// middleware.ts
export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/api/user/:path*", "/progress/:path*"]
}
```

---

## Phase 6: User Data & Progress (Future v2.0)

### 6.1 Progress Tracking API
```
GET /api/user/progress
- Returns user's progress across all subjects
- Response: UserProgress[]

POST /api/user/progress
- Update progress for a topic
- Body: { topicId, status }
- Response: UserProgress

GET /api/user/stats
- Returns study statistics
- Response: UserStats
```

### 6.2 Progress Implementation
- [ ] Create progress tracking endpoints
- [ ] Implement progress calculations
- [ ] Add completion percentage
- [ ] Calculate estimated time remaining
- [ ] Generate study recommendations

### 6.3 Data Models
```typescript
interface UserProgress {
  id: string;
  userId: string;
  topicId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserStats {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  completionPercentage: number;
  totalStudyTime: number;
  estimatedTimeRemaining: number;
  subjectBreakdown: {
    subjectId: string;
    completed: number;
    total: number;
  }[];
}
```

---

## Phase 7: Content Management (Future v3.0)

### 7.1 Admin Panel
- [ ] Create admin dashboard
- [ ] Implement subject CRUD
- [ ] Implement topic CRUD
- [ ] Add dependency management UI
- [ ] Implement content versioning
- [ ] Add audit logs

### 7.2 Content API
```
POST /api/admin/subjects
- Create new subject
- Auth: Admin only

PUT /api/admin/subjects/:id
- Update subject
- Auth: Admin only

DELETE /api/admin/subjects/:id
- Delete subject
- Auth: Admin only

POST /api/admin/topics
- Create new topic
- Auth: Admin only

PUT /api/admin/topics/:id
- Update topic
- Auth: Admin only

DELETE /api/admin/topics/:id
- Delete topic
- Auth: Admin only
```

### 7.3 Bulk Operations
- [ ] Implement CSV import
- [ ] Add JSON import/export
- [ ] Create bulk update endpoints
- [ ] Add validation for imports

---

## Phase 8: Advanced Features (Future v3.0)

### 8.1 Analytics API
```
GET /api/analytics/popular-topics
- Returns most viewed topics

GET /api/analytics/completion-rates
- Returns average completion by subject

GET /api/analytics/user-engagement
- Returns engagement metrics
```

### 8.2 Community Features
- [ ] Implement user submissions
- [ ] Add review/approval workflow
- [ ] Create rating system
- [ ] Add comments/discussions
- [ ] Implement voting

### 8.3 Export API
```
GET /api/export/path/:subjectId
- Returns learning path as JSON
- Query: format (json, pdf, png)

GET /api/export/priority/:subjectId
- Returns priority map as JSON
- Query: format (json, pdf, png)
```

---

## Phase 9: Infrastructure (Future)

### 9.1 Database Setup
- [ ] Set up PostgreSQL instance
- [ ] Configure connection pooling
- [ ] Set up read replicas (if needed)
- [ ] Configure backups
- [ ] Set up monitoring

### 9.2 Caching Layer
- [ ] Implement Redis caching
- [ ] Cache subject data
- [ ] Cache topic dependencies
- [ ] Set cache TTL policies
- [ ] Add cache invalidation

### 9.3 CDN & Assets
- [ ] Set up CDN for static assets
- [ ] Configure image optimization
- [ ] Implement asset versioning

### 9.4 Monitoring & Logging
- [ ] Set up error tracking (Sentry)
- [ ] Implement request logging
- [ ] Add performance monitoring
- [ ] Set up alerts
- [ ] Create dashboards

---

## Phase 10: Security (Future)

### 10.1 API Security
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Sanitize all inputs
- [ ] Prevent SQL injection
- [ ] Add CORS configuration
- [ ] Implement API key authentication (for partners)

### 10.2 Data Security
- [ ] Encrypt sensitive data
- [ ] Implement row-level security
- [ ] Add data retention policies
- [ ] Create backup encryption
- [ ] Set up access controls

### 10.3 Compliance
- [ ] GDPR compliance
- [ ] Data export functionality
- [ ] Data deletion (right to be forgotten)
- [ ] Privacy policy
- [ ] Terms of service

---

## Current Status: MVP

### What We Have Now
- Static TypeScript data files
- No backend server needed
- All data served from frontend
- Zero infrastructure costs

### Migration Path to Backend
1. **Phase 1**: Keep static data, add API layer
2. **Phase 2**: Move data to database, keep API
3. **Phase 3**: Add authentication & user data
4. **Phase 4**: Add content management
5. **Phase 5**: Scale infrastructure

---

## Quick Reference: API Endpoints Summary

### MVP (Static Data)
```
No API needed - data imported directly from lib/data/*.ts
```

### v2.0 (Basic API)
```
GET /api/subjects
GET /api/subjects/:id
GET /api/subjects/:id/topics
GET /api/topics/:id
GET /api/topics/:id/dependencies
GET /api/search
```

### v2.0 (With Auth)
```
GET /api/user/progress
POST /api/user/progress
GET /api/user/stats
```

### v3.0 (Admin)
```
POST /api/admin/subjects
PUT /api/admin/subjects/:id
DELETE /api/admin/subjects/:id
POST /api/admin/topics
PUT /api/admin/topics/:id
DELETE /api/admin/topics/:id
```

---

## Priority Legend

- **High**: Required for current phase
- **Medium**: Next phase implementation
- **Low**: Future enhancement
- **MVP**: Current static data approach

## Status Tracking

Use these markers:
- [ ] Not started
- [/] In progress
- [x] Completed
- [~] MVP alternative (static data)
- [-] Blocked/Issue

---

**Last Updated**: January 30, 2026
**Current Phase**: MVP (Static Data)
**Next Phase**: v2.0 API + Database (when user accounts needed)
