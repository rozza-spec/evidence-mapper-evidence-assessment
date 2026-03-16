# Security

All security hardening follows the OWASP Top 10:2025 threat model. Introduced in Session 3.

## HTTP Security Headers (A02 — Security Misconfiguration)

- Content-Security-Policy with per-request nonces and `strict-dynamic`
- HSTS with max-age 2 years, includeSubDomains, preload
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera, microphone, geolocation, browsing-topics all disabled
- Cross-Origin-Opener-Policy: same-origin
- X-DNS-Prefetch-Control: off
- X-Powered-By header removed in both middleware and next.config.ts
- Nonce passed to server components via `x-nonce` request header

## Authentication Hardening (A07 — Identification & Authentication Failures)

- In-memory rate limiter: 5 login attempts per 15-minute window per IP
- All auth failures (bad email, bad password, rate limited) logged to audit trail
- Successful logins reset rate limit counter and are logged
- Password input capped at 128 chars to prevent bcrypt DoS
- Email normalized (lowercase + trim) before lookup
- Session timeout set to 8 hours absolute

## File Upload Security (A05 — Injection / A06 — Insecure Design)

- All image upload support removed (JPG, PNG) — PDF only across the entire app
- Magic byte validation: server verifies `%PDF` header bytes, not just MIME type from client
- Filenames sanitized: stripped to alphanumeric + dots/hyphens, capped at 100 chars
- `Content-Disposition: attachment` header forced on all `/uploads/*` paths via next.config.ts
- `Cache-Control: private, no-cache` on uploaded files

## API Security (A01 — Broken Access Control / A05 — Injection)

- Zod validation on ALL API routes (students, payments, evidence, competency)
- JSON parse wrapped in try/catch — malformed bodies return 400, not 500
- API responses return only needed fields — no raw Prisma objects leaked
- Audit log API capped at max 50 records to prevent abuse
- `updateStudentSchema` added for PATCH validation

## Logging & Monitoring (A09 — Security Logging Failures)

- Auth events logged: login success, login failure, rate limit triggers
- Upload rejections logged with reason (magic byte mismatch, size exceeded)
- Evidence deletions and competency deletions logged
- PII partially redacted in audit logs (emails masked)
- Audit logger fails open — logging errors never break the app

## Next.js Hardening (A02 — Security Misconfiguration)

- `poweredByHeader: false` — removes Next.js version fingerprint
- `reactStrictMode: true` — catches unsafe component patterns in dev
