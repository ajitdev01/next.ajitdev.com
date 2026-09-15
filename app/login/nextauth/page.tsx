import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, AlertCircle, CheckCircle2, User, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { GoogleSubmitButton, SignOutSubmitButton } from "./login-button";

export const metadata = {
  title: "Sign in with Google | NextAuth | AJITDEV",
  description: "Secure Google authentication powered by NextAuth/Auth.js.",
};

export default async function NextAuthLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = searchParams ? await searchParams : {};
  const errorMessage = params?.error;

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white antialiased flex flex-col justify-between overflow-x-clip">
      {/* Background ambient glow */}
      <div
        style={{ contain: "paint" }}
        className="pointer-events-none absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] sm:h-[600px] sm:w-[600px]"
      />

      {/* Top Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Auth.js v5 · Google OAuth</span>
        </div>
      </header>

      {/* Login / Profile Card */}
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center justify-center px-4 py-8">
        <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40">
          {/* Header Icon & Branding */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-950 shadow-xs">
                <Image
                  src="/logo.png"
                  alt="AJITDEV"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-slate-300 font-mono text-base">✕</span>
              {/* Official Google 'G' Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white p-2 shadow-xs">
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
              {session?.user ? "Authenticated Session" : "Sign in with Google"}
            </h1>

            <p className="mt-1.5 text-xs text-slate-500 max-w-xs">
              {session?.user
                ? "You are securely signed in via Google OAuth"
                : "to continue to next.ajitdev.com"}
            </p>
          </div>

          {/* Graceful OAuth Error Banner */}
          {errorMessage && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>Authentication Notice</span>
              </div>
              <p className="mt-1 text-[11px] text-rose-700 leading-relaxed">
                {errorMessage === "Configuration"
                  ? "Server configuration issue: please verify AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET in your environment and ensure the redirect URI matches in Google Cloud Console."
                  : errorMessage === "AccessDenied"
                  ? "Access was cancelled or denied during Google account consent."
                  : "Google authentication could not be completed. Please try again."}
              </p>
            </div>
          )}

          {/* Authenticated State */}
          {session?.user ? (
            <div className="mt-6 space-y-4">
              {/* Profile details */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-3">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full border border-slate-200 shadow-xs"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {session.user.name || "Authenticated User"}
                      </p>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <p className="truncate text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span>{session.user.email}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Protected Dashboard Link */}
              <Link
                href="/dashboard"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition active:scale-98"
              >
                <span>Go to Protected Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              {/* Sign Out Form */}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login/nextauth" });
                }}
              >
                <SignOutSubmitButton />
              </form>
            </div>
          ) : (
            /* Unauthenticated State: Sign In Form */
            <div className="mt-6">
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/dashboard" });
                }}
              >
                <GoogleSubmitButton />
              </form>
            </div>
          )}

          {/* Secure Session Note */}
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Auth.js Secure Session</span>
            </div>
            <p className="mt-1 text-slate-500 leading-relaxed text-[10px]">
              Session handling is cryptographically encrypted using JWE. Secrets and tokens remain exclusively on the server.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        <span>AJITDEV · Google OAuth 2.0 via Auth.js</span>
      </footer>
    </div>
  );
}
