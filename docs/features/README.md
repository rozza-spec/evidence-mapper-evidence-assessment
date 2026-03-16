# Features

## Data Alignment (Session 1)

- Updated all qualification data (CPC40120, CPC50220, CPC60220) to match training.gov.au
- Corrected unit codes: replaced BSBESB402 with BSBWRT411, BSBLDR414 with BSBLDR413
- Fixed core/elective classifications across all three qualifications
- Added training.gov.au source attribution and direct links in the UI
- Created `/api/tga` route to serve verified qualification data as JSON

## Persistent Evidence & Competency (Session 2)

- Added EvidenceRecord and CompetencyRecord models linked to Student
- Refactored page.tsx with StudentSelector — all evidence/competency data loads per student
- API routes for `/api/students/[id]/evidence` and `/api/students/[id]/competency` (CRUD)
- Evidence state and assessor verdicts now persist to database

## Real File Uploads (Session 2)

- Evidence items accept PDF file uploads (up to 10MB)
- Files stored in `public/uploads/evidence/[studentId]/` with preview/download links
- File type, size, and magic byte validation on the server

## PDF Reports (Session 2)

- Installed `@react-pdf/renderer`
- Built 4 branded PDF templates: Evidence Matrix, Gap Analysis, Competency Record, Payment Statement
- Export buttons integrated into Assessor Panel, Gap Analysis, and Student Management
- Lazy-loaded via dynamic imports for performance

## UI Polish (Session 2)

- Installed `sonner` — toast notifications on all key actions (create, delete, upload, payment)
- Built custom ConfirmDialog component to replace native `confirm()`
- Created reusable Skeleton components (SkeletonCard, SkeletonTable, SkeletonDashboard)
- Added Zod validation schemas for student creation and payments
- Added AuditLog model with `/api/audit` endpoint
- Dashboard shows live activity feed of recent actions

## Analytics & Mobile (Session 2)

- Installed `recharts` — dashboard has bar chart (coverage by qualification) and pie chart (evidence status)
- Added fixed mobile bottom navigation bar for phone/tablet use
- Built CSV import component for bulk student enrolment
- Created comprehensive README.md with setup instructions and project structure
