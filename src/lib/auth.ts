import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";
import { checkLoginRateLimit, resetLoginAttempts } from "@/lib/rate-limit";
import { logAction } from "@/lib/audit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const ip =
          request?.headers?.get?.("x-forwarded-for")?.split(",")[0]?.trim() ||
          "unknown";

        const { allowed, retryAfterSeconds } = checkLoginRateLimit(ip);
        if (!allowed) {
          await logAction("auth.rate_limited", {
            details: `IP ${ip} blocked for ${retryAfterSeconds}s`,
          });
          throw new Error(`Too many attempts. Try again in ${retryAfterSeconds}s`);
        }

        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        if (!email || !password || password.length > 128) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          await logAction("auth.failed", {
            details: `Unknown email attempt from ${ip}`,
          });
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);

        if (!valid) {
          await logAction("auth.failed", {
            userId: user.id,
            userName: user.name,
            details: `Invalid password from ${ip}`,
          });
          return null;
        }

        resetLoginAttempts(ip);

        await logAction("auth.login", {
          userId: user.id,
          userName: user.name,
          details: `Logged in from ${ip}`,
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});
