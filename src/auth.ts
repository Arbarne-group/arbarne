import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateUniqueFutureFarmId } from "@/lib/idGenerator";

function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
}

/** Find-or-create the DB user for a verified Google identity (by email). */
async function ensureGoogleUser(profile: {
  email?: string | null;
  given_name?: string | null;
  family_name?: string | null;
  name?: string | null;
}) {
  const email = (profile.email || "").toLowerCase().trim();
  if (!email) return null;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const patch: Record<string, string> = {};
    const { first, last } = splitName(
      profile.name || `${profile.given_name || ""} ${profile.family_name || ""}`
    );
    if (!existing.firstName && (profile.given_name || first)) {
      patch.firstName = profile.given_name || first;
    }
    if (!existing.lastName && (profile.family_name || last)) {
      patch.lastName = profile.family_name || last;
    }
    if (existing.accountStatus !== "VERIFIED") patch.accountStatus = "VERIFIED";
    if (existing.passwordHash === "CLERK_AUTHENTICATED") {
      patch.passwordHash = "SOCIAL_AUTHENTICATED";
      patch.authProvider = "google";
    }
    if (Object.keys(patch).length > 0) {
      return prisma.user.update({ where: { email }, data: patch });
    }
    return existing;
  }
  const { first, last } = splitName(
    profile.name || `${profile.given_name || ""} ${profile.family_name || ""}`
  );
  const { newReferralCode } = await import("@/lib/referralCode");
  let referralCode = newReferralCode();
  for (let i = 0; i < 5; i++) {
    const clash = await prisma.user.findUnique({ where: { referralCode } });
    if (!clash) break;
    referralCode = newReferralCode();
  }
  return prisma.user.create({
    data: {
      email,
      name:
        profile.name ||
        [profile.given_name, profile.family_name].filter(Boolean).join(" ") ||
        "Farmer",
      firstName: profile.given_name || first || null,
      lastName: profile.family_name || last || null,
      futureFarmId: await generateUniqueFutureFarmId(),
      referralCode,
      passwordHash: "SOCIAL_AUTHENTICATED",
      authProvider: "google",
      accountStatus: "VERIFIED",
      role: "FFFarmer",
      farmerProfile: { create: {} },
      farmManagement: { create: {} },
      operatingStyle: { create: {} },
      digitalPlatform: { create: {} },
      aspiration: { create: {} },
    },
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: { params: { prompt: "select_account" } },
          }),
        ]
      : []),
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email || "")
          .toLowerCase()
          .trim();
        const password = String(credentials?.password || "");
        if (!email || !password) {
          console.log(
            "[auth-debug] authorize",
            JSON.stringify({ email: email || "(empty)", result: "missing-fields" })
          );
          return null;
        }
        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            console.log(
              "[auth-debug] authorize",
              JSON.stringify({ email, result: "no-user" })
            );
            return null;
          }
          if (user.accountStatus !== "VERIFIED") {
            console.log(
              "[auth-debug] authorize",
              JSON.stringify({ email, result: "unverified" })
            );
            return null;
          }
          const ok = await bcrypt.compare(password, user.passwordHash);
          console.log(
            "[auth-debug] authorize",
            JSON.stringify({ email, result: ok ? "ok" : "bad-password" })
          );
          if (!ok) return null;
          await prisma.user
            .update({ where: { id: user.id }, data: { lastSeenAt: new Date() } })
            .catch(() => {});
          return { id: user.id, email: user.email, name: user.name };
        } catch (error) {
          console.error(
            "[auth-debug] authorize threw:",
            error instanceof Error ? error.message : String(error)
          );
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const ensured = await ensureGoogleUser({
          email: (profile as any)?.email,
          given_name: (profile as any)?.given_name,
          family_name: (profile as any)?.family_name,
          name: (profile as any)?.name,
        }).catch((error) => {
            console.error("[Google Auth] ensureGoogleUser failed:", error);
            return null;
        });
        console.log(
          "[auth-debug] signIn google",
          JSON.stringify({
            email: (profile as any)?.email || null,
            result: ensured ? "ok" : "denied",
          })
        );
        if (!ensured) return false;
        // Attribute an invite code carried through OAuth (?ref= → cookie).
        try {
          const { cookies } = await import("next/headers");
          const store = await cookies();
          const raw = store.get("ff_invite_ref")?.value || "";
          const code = decodeURIComponent(raw).toUpperCase().trim();
          if (code) {
            const inviter = await prisma.user.findUnique({
              where: { referralCode: code },
              select: { id: true },
            });
            const me = await prisma.user.findUnique({
              where: { email: String((profile as any)?.email || "").toLowerCase().trim() },
              select: { id: true },
            });
            if (inviter && me && inviter.id !== me.id) {
              await prisma.referral.upsert({
                where: { referredId: me.id },
                update: {},
                create: { referrerId: inviter.id, referredId: me.id },
              });
            }
          }
          store.delete("ff_invite_ref");
        } catch (e) {
          console.warn("[Google Auth] invite attribution notice:", e);
        }
      }
      return true;
    },
    async jwt({ token }) {
      // Resolve authoritative id/role from our DB on every pass.
      const email = String((token.email as string) || "")
        .toLowerCase()
        .trim();
      if (email) {
        try {
          const db = await prisma.user.findUnique({
            where: { email },
            select: { id: true, role: true, name: true, email: true },
          });
          console.log(
            "[auth-debug] jwt",
            JSON.stringify({ email, dbResolved: Boolean(db) })
          );
          if (db) {
            (token as any).userId = db.id;
            (token as any).role = db.role;
            token.name = db.name;
            token.email = db.email;
          }
        } catch (error) {
          console.error(
            "[auth-debug] jwt prisma.user.findUnique failed:",
            error instanceof Error ? error.message : String(error)
          );
        }
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).id = (token as any).userId ?? token.sub;
      (session.user as any).role = (token as any).role;
      return session;
    },
  },
});
