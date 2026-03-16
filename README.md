# Prepare Training — RPL Evidence Mapper

A professional evidence-mapping platform for Recognition of Prior Learning (RPL) in Australian construction qualifications. Built with Next.js, Prisma, and SQLite.

## Qualifications Supported

| Code | Title |
|------|-------|
| CPC40120 | Certificate IV in Building and Construction |
| CPC50220 | Diploma of Building and Construction (Building) |
| CPC60220 | Advanced Diploma of Building and Construction (Management) |

Unit data is sourced from [training.gov.au](https://training.gov.au).

## Features

- **Evidence Management** — Upload, track and verify evidence items per student
- **Carry-Over Engine** — Automatically calculates shared unit coverage across qualifications
- **Assessor Panel** — Verify/query/reject evidence and record competency decisions
- **Gap Analysis** — Identifies under-evidenced units with suggested alternatives
- **Student Management** — Enrol students, track payments, upload invoices
- **CSV Import** — Bulk-import students via CSV file
- **PDF Reports** — Export Evidence Matrix, Gap Analysis, Competency Record and Payment Statements
- **Authentication** — Role-based access (Admin, Trainer, Student) via NextAuth.js
- **Dashboard Analytics** — Charts showing coverage breakdown and evidence status
- **Audit Trail** — All key actions logged with activity feed on dashboard
- **Mobile Bottom Nav** — Touch-friendly navigation for phones and tablets

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite via Prisma 7
- **Auth**: NextAuth.js v5 (JWT strategy)
- **Charts**: Recharts
- **PDF**: @react-pdf/renderer
- **Validation**: Zod
- **Toasts**: Sonner

## Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed default users
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default Logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@preparetraining.com.au | admin123 |
| Trainer | trainer@preparetraining.com.au | trainer123 |

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── api/          # REST endpoints (students, payments, evidence, competency, audit, auth)
│   ├── login/        # Login page
│   └── page.tsx      # Main application page
├── components/       # React components
├── lib/              # Shared logic
│   ├── data.ts       # Qualification and evidence data
│   ├── engine.ts     # Coverage computation engine
│   ├── types.ts      # TypeScript type definitions
│   ├── db.ts         # Prisma client singleton
│   ├── auth.ts       # NextAuth configuration
│   ├── audit.ts      # Audit logging helper
│   ├── validation.ts # Zod schemas
│   └── reports/      # PDF report templates
└── generated/        # Prisma generated client
prisma/
├── schema.prisma     # Database schema
├── seed.ts           # Database seeder
└── migrations/       # Migration history
```

## CSV Import Format

The CSV importer expects a header row with at least `name` and `qualification` columns:

```csv
name,email,phone,qualification,totalOwing
John Smith,john@example.com,0400000000,CPC40120,7000
Jane Doe,jane@example.com,0411111111,CPC50220,9500
```

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="<generate-a-random-secret>"
NEXTAUTH_URL="http://localhost:3000"
```
