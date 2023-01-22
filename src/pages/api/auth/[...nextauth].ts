import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

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
        if (user != null) {
          return { username: user.userName, id: user.id };
        } else {
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
