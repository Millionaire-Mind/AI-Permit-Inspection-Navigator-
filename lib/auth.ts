import { NextAuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export function requireAuth(handler: any) {
  return async (req: any, res: any) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return handler(req, res);
  };
}

export function requireRole(role: string) {
  return function(handler: any) {
    return async (req: any, res: any) => {
      const session = await getServerSession(authOptions);
      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      if (session.user.role !== role && session.user.role !== "SUPER_ADMIN") {
        return res.status(403).json({ error: "Insufficient permissions" });
      }
      
      return handler(req, res);
    };
  };
}

export function requireAdmin(handler: any) {
  return requireRole("ADMIN")(handler);
}

export function requireModerator(handler: any) {
  return requireRole("MODERATOR")(handler);
}
