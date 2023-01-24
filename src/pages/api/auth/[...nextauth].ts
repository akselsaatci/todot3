import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        const user = await prisma.user.findFirst({
          where: {
            AND: [
              {
                userName: {
                  equals: username,
                },
              },
              { userPassword: { equals: password } },
            ],
          },
        });
        console.log(user?.id);
        if (user != null) {
          return { id: user.id, name: user.userName };
        } else {
          return null;
        }
      },
    }),
  ],
  debug: true,
};

export default NextAuth(authOptions);
