import { prisma } from "@/lib/db";

interface AuditOpts {
  userId?: string;
  userName?: string;
  targetId?: string;
  details?: string;
  ip?: string;
}

export async function logAction(action: string, opts?: AuditOpts) {
  try {
    // Strip any sensitive data patterns from details before logging
    const sanitized = opts?.details
      ? opts.details
          .replace(/password[=:]\S+/gi, "password=***")
          .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, (email) => {
            const [local, domain] = email.split("@");
            return `${local[0]}***@${domain}`;
          })
      : null;

    await prisma.auditLog.create({
      data: {
        action,
        userId: opts?.userId ?? null,
        userName: opts?.userName ?? null,
        targetId: opts?.targetId ?? null,
        details: sanitized,
      },
    });
  } catch {
    // Fail open for logging — never break the app for an audit write failure
    console.error(`[audit] Failed to write: ${action}`);
  }
}
