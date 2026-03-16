# Student Management

## Database & API (Session 1)

- Added SQLite database with Prisma ORM (Student + Payment models)
- Built API routes: `/api/students`, `/api/students/[id]`, `/api/students/[id]/payments`

## UI (Session 1)

- Created StudentManagement component with search, enrolment form, and detail view
- Payment tracking with balance bar, invoice file uploads, and running totals
- Added "Students" tab to navigation

## Per-Student Data (Session 2)

- Added EvidenceRecord and CompetencyRecord models linked to Student
- StudentSelector component — all evidence/competency data loads per student
- API routes for `/api/students/[id]/evidence` and `/api/students/[id]/competency` (CRUD)

## Bulk Import (Session 2)

- CSV import component for bulk student enrolment
- Auto-detects name, qualification, email, phone, and owing columns
