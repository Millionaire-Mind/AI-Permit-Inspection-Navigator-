import type { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
 // adapter: PrismaAdapter(prisma as any),
session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().toLowerCase();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;
        const user = await (prisma as any).user.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role } as unknown as User;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = (user as any).role ?? token.role ?? "USER";
      } else {
        if (!token.role) {
          // refresh from db if missing
          const u = token.email ? await (prisma as any).user.findUnique({ where: { email: token.email } }) : null;
          // @ts-ignore
          token.role = u?.role ?? "USER";
        }
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user.role = token.role ?? "USER";
      return session;
    }
  }
};

