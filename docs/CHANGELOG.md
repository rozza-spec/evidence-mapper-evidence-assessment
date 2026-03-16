# Changelog

Full session-by-session history of all changes made to the Prepare Training app.

---

## Session 1 — 15 Mar 2026

### Data Alignment
- Updated all qualification data (CPC40120, CPC50220, CPC60220) to match training.gov.au
- Corrected unit codes: replaced BSBESB402 with BSBWRT411, BSBLDR414 with BSBLDR413
- Fixed core/elective classifications across all three qualifications
- Added training.gov.au source attribution and direct links in the UI
- Created /api/tga route to serve verified qualification data as JSON

### Bug Fixes
- Fixed duplicate React key errors in CarryOverMap, AssessorPanel, and GapAnalysis (composite keys)
- Fixed Prisma 7 compatibility — added better-sqlite3 driver adapter
- Resolved build errors related to PrismaClient initialization

### UI & Branding
- Renamed app to "Prepare Training"
- Added slogan "Failing To Prepare, Is Preparing To Fail" in cursive yellow (Dancing Script font)
- Replaced text-based PT logo with yellow chevron logo.png
- Increased font sizes and bold weights across all components for readability
- Added CORE/ELECTIVE badges to unit cards in Coverage Map

### Student Management
- Added SQLite database with Prisma ORM (Student + Payment models)
- Built API routes: /api/students, /api/students/[id], /api/students/[id]/payments
- Created StudentManagement component with search, enrolment form, and detail view
- Payment tracking with balance bar, invoice file uploads, and running totals
- Added "Students" tab to navigation

### Infrastructure
- Pushed initial commit to GitHub (rozza-spec/evidence-mapper-evidence-assessment)
- Set up .gitignore for node_modules, .env, .next, generated Prisma client, db files

---

## Session 2 — 16 Mar 2026

### Authentication (Phase 1)
- Installed NextAuth.js v5 with JWT strategy and Credentials provider
- Added User model to Prisma schema with role-based access (ADMIN, TRAINER, STUDENT)
- Built dedicated login page with branded styling
- Added middleware for route protection (redirects unauthenticated users)
- Navigation filters tabs by user role; shows user info and logout button
- Seeded default admin and trainer accounts

### Persistent Evidence & Competency (Phase 2)
- Added EvidenceRecord and CompetencyRecord models linked to Student
- Refactored page.tsx with StudentSelector — all evidence/competency data loads per student
- API routes for /api/students/[id]/evidence and /api/students/[id]/competency (CRUD)
- Evidence state and assessor verdicts now persist to database

### Real File Uploads (Phase 3)
- Evidence items accept actual file uploads (PDF up to 10MB)
- Files stored in public/uploads/evidence/[studentId]/ with preview/download links
- File type and size validation on the server

### PDF Reports (Phase 4)
- Installed @react-pdf/renderer
- Built 4 branded PDF templates: Evidence Matrix, Gap Analysis, Competency Record, Payment Statement
- Export buttons integrated into Assessor Panel, Gap Analysis, and Student Management
- Lazy-loaded via dynamic imports for performance

### UI Polish (Phase 5)
- Installed sonner — toast notifications on all key actions (create, delete, upload, payment)
- Built custom ConfirmDialog component to replace native confirm()
- Created reusable Skeleton components (SkeletonCard, SkeletonTable, SkeletonDashboard)
- Added Zod validation schemas for student creation and payments
- Added AuditLog model with /api/audit endpoint
- Dashboard shows live activity feed of recent actions

### Analytics & Mobile (Phase 6)
- Installed recharts — dashboard now has bar chart (coverage by qualification) and pie chart (evidence status)
- Added fixed mobile bottom navigation bar for phone/tablet use
- Built CSV import component for bulk student enrolment
- Created comprehensive README.md with setup instructions and project structure

---

## Session 3 — 16 Mar 2026

### Security Hardening (OWASP Top 10:2025)

#### HTTP Security Headers (A02 — Security Misconfiguration)
- Added Content-Security-Policy with per-request nonces and strict-dynamic
- Added HSTS (max-age 2 years, includeSubDomains, preload)
- Added X-Content-Type-Options: nosniff, X-Frame-Options: DENY
- Added Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy, X-DNS-Prefetch-Control
- Disabled X-Powered-By header in both middleware and next.config.ts
- Nonce passed to server components via x-nonce request header

#### Authentication Hardening (A07 — Identification & Authentication Failures)
- Added in-memory rate limiter: 5 login attempts per 15-minute window per IP
- All auth failures (bad email, bad password, rate limited) logged to audit trail
- Successful logins reset rate limit counter and are logged
- Password input capped at 128 chars to prevent bcrypt DoS
- Email normalized (lowercase + trim) before lookup
- Session timeout set to 8 hours absolute

#### File Upload Security (A05 — Injection / A06 — Insecure Design)
- Removed all image upload support (JPG, PNG) — PDF only across the entire app
- Magic byte validation: server verifies %PDF header bytes, not just MIME type from client
- Filenames sanitized: stripped to alphanumeric + dots/hyphens, capped at 100 chars
- Content-Disposition: attachment header forced on all /uploads/* paths via next.config.ts
- Cache-Control: private, no-cache on uploaded files

#### API Security (A01 — Broken Access Control / A05 — Injection)
- Zod validation added to ALL API routes (students, payments, evidence, competency)
- JSON parse wrapped in try/catch — malformed bodies return 400 not 500
- API responses return only needed fields — no raw Prisma objects
- Audit log API capped at max 50 records to prevent abuse
- Added updateStudentSchema for PATCH validation

#### Logging & Monitoring (A09 — Security Logging Failures)
- Auth events logged: login success, login failure, rate limit triggers
- Upload rejections logged with reason (magic byte mismatch, size exceeded)
- Evidence deletions and competency deletions now logged
- PII partially redacted in audit logs (emails masked)
- Audit logger fails open — logging errors never break the app

#### Next.js Hardening (A02 — Security Misconfiguration)
- poweredByHeader: false — removes Next.js version fingerprint
- reactStrictMode: true — catches unsafe component patterns in dev

---

## Session 4 — 17 Mar 2026

### Student Portal
- Built full student-facing portal (`/my-portal` view) with 4 tabs: Overview, Evidence, Units, Payments
- Students auto-redirect to their portal on login (role-based default view)
- Self-service evidence upload: students can upload PDF evidence directly
- Real-time status badges: Verified, Rejected, Pending Review
- Financial overview: total fees, amount paid, balance remaining with progress bars
- Unit competency display: shows assessor decisions per unit with progress indicators
- Payment history: chronological list of all payments
- Created `/api/me` endpoint for authenticated user + linked student data
- Student accounts auto-created when trainer provides an email during enrolment

### Multi-Qualification Enrolment
- Added `StudentEnrolment` junction table to Prisma schema
- Created `/api/students/[id]/enrolments` API (GET, POST, DELETE)
- Enrolment management UI in Student Management: add/remove qualifications per student
- Primary qualification badge and protection against removing it
- Enrolment records created automatically during student creation

### Deployment Preparation
- Made database provider switchable: SQLite (dev) via better-sqlite3, Postgres (prod) via @prisma/adapter-pg
- `db.ts` auto-detects provider from `DATABASE_URL` prefix
- Created `vercel.json` with build command for Prisma generation
- Created `.env.example` documenting all required environment variables

### Automated Testing
- Installed Vitest as test runner
- 36 tests across 3 test files:
  - `validation.test.ts` — Zod schema validation (student, payment, evidence, competency, update)
  - `file-validation.test.ts` — filename sanitization and path traversal protection
  - `data-integrity.test.ts` — qualification data, unit mappings, engine computations
- Added `test` and `test:watch` scripts to package.json
