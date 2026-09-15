import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { syncUserWithAtlas } from "@/lib/userDb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "7f59d48b19a3b907572740a6b72183c518491029384756102938475610293847",
  pages: {
    signIn: "/login/google",
    error: "/login/google",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google" && user) {
          await syncUserWithAtlas({
            id: user.id || account.providerAccountId,
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }
      } catch (err) {
        console.error("Error persisting user to Atlas during sign-in:", err);
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
