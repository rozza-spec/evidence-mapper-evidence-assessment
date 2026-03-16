# Infrastructure

## Database (Session 1)

- SQLite with Prisma 7 ORM
- `better-sqlite3` driver adapter for Prisma 7 compatibility
- Models: User, Student, Payment, EvidenceRecord, CompetencyRecord, AuditLog
- Database file: `dev.db` in project root
- Migrations managed via `prisma migrate dev`

## Authentication (Session 2)

- NextAuth.js v5 with JWT strategy and Credentials provider
- User model with role-based access: ADMIN, TRAINER, STUDENT
- Dedicated login page with branded styling
- Middleware for route protection — redirects unauthenticated users to `/login`
- Navigation filters tabs by user role; shows user info and logout button
- Default seeded accounts: admin and trainer

## Deployment & Git (Session 1)

- Pushed to GitHub: `rozza-spec/evidence-mapper-evidence-assessment`
- `.gitignore` covers: node_modules, .env, .next, generated Prisma client, .db files, uploads

## Environment Variables

- `DATABASE_URL` — SQLite connection string
- `AUTH_SECRET` — NextAuth signing secret
- `NEXTAUTH_URL` — Application URL (http://localhost:3000 for dev)
