import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { syncUserWithAtlas } from "@/lib/userDb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
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
  pages: {
    signIn: "/login/google",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
});
