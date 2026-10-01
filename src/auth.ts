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
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.accountStatus !== "VERIFIED") return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        await prisma.user
          .update({ where: { id: user.id }, data: { lastSeenAt: new Date() } })
          .catch(() => {});
        return { id: user.id, email: user.email, name: user.name };
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
        if (!ensured) return false;
      }
      return true;
    },
    async jwt({ token }) {
      // Resolve authoritative id/role from our DB on every pass.
      const email = String((token.email as string) || "")
        .toLowerCase()
        .trim();
      if (email) {
        const db = await prisma.user
          .findUnique({
            where: { email },
            select: { id: true, role: true, name: true, email: true },
          })
          .catch((error) => {
            console.error("[JWT Callback] prisma.user.findUnique failed:", error);
            return null;
          });
        if (db) {
          (token as any).userId = db.id;
          (token as any).role = db.role;
          token.name = db.name;
          token.email = db.email;
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
