# Bug Fixes

## Session 1

- Fixed duplicate React key errors in CarryOverMap, AssessorPanel, and GapAnalysis — switched to composite keys (`${qualification}-${unitCode}`)
- Fixed Prisma 7 compatibility — added `better-sqlite3` driver adapter
- Resolved build errors related to PrismaClient initialization (incorrect `dev.db` path)

## Session 2

- Fixed `useSearchParams()` SSR error on login page — wrapped in `<Suspense>`
- Fixed Edge Runtime incompatibility — split NextAuth config into lightweight (`auth.config.ts`) and full (`auth.ts`)
- Fixed TypeScript error with `@react-pdf/renderer` — cast to `any` for `pdf()` call
