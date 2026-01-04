import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { PrismaUserRepository } from "@/server/adapter/repositories/prismaUserRepository";
import { VerifyCredentialsUseCase } from "@/server/application/usecases/user/verifyCredentialsUseCase";
import { BcryptPasswordHasher } from "@/server/adapter/utils/bcryptPasswordHasher";

// UseCaseのインスタンスを作成（外側で依存関係を注入）
const userRepository = new PrismaUserRepository(prisma);
const passwordHasher = new BcryptPasswordHasher();
const verifyCredentialsUseCase = new VerifyCredentialsUseCase(
  userRepository,
  passwordHasher,
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) return null;

        try {
          const result = await verifyCredentialsUseCase.execute({
            email,
            password,
          });

          // NextAuthに返すユーザー（最低限 id が必要）
          return {
            id: result.userId,
            email: result.email,
            name: result.name ?? undefined,
          };
        } catch {
          // 認証失敗時は null を返す（NextAuthの仕様）
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
