import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";
import Admins from "@/models/Admins";
import bcrypt from "bcryptjs";
import { signIn } from "next-auth/react";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await Admins.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 10 * 60, // Session expires after 30 minutes
  },
  jwt: {
    maxAge: 10 * 60, // JWT expires after 30 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "@/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };