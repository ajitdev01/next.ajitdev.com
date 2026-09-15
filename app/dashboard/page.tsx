import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, ShieldCheck, ArrowLeft, LogOut, CheckCircle2 } from "lucide-react";
import { SignOutSubmitButton } from "../login/nextauth/login-button";

export const metadata = {
  title: "Dashboard | AJITDEV",
  description: "Protected member dashboard powered by Auth.js session authentication.",
};

export default async function DashboardPage() {
  const session = await auth();

  // Server-side route protection: unauthenticated users are immediately redirected
  if (!session?.user) {
    redirect("/login/nextauth");
  }

  const { user } = session;

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white antialiased flex flex-col justify-between overflow-x-clip">
      {/* Background ambient glow */}
      <div
        style={{ contain: "paint" }}
        className="pointer-events-none absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] sm:h-[600px] sm:w-[600px]"
      />

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-emerald-600 font-mono font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Protected Route · Active</span>
        </div>
      </header>

      {/* Main Dashboard Card */}
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center justify-center px-4 py-8">
        <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
                Protected Dashboard
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Server-side session verified via Auth.js
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          {/* User Profile Card */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center gap-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User Avatar"}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border-2 border-white shadow-xs"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                  <User className="h-6 w-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-base font-bold text-slate-900">
                    {user.name || "Authenticated User"}
                  </p>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                </div>
                <p className="truncate text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span>{user.email}</span>
                </p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                  <span>Google OAuth Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs">
            <h2 className="font-semibold text-slate-800">Session Information</h2>
            <div className="mt-2 space-y-1.5 font-mono text-[11px] text-slate-600">
              <p className="flex justify-between">
                <span className="text-slate-400">Auth Method:</span>
                <span className="font-medium text-slate-800">Google OAuth 2.0</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400">Session Type:</span>
                <span className="font-medium text-slate-800">Auth.js Encrypted JWT</span>
              </p>
            </div>
          </div>

          {/* Sign Out Action */}
          <div className="mt-6">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login/nextauth" });
              }}
            >
              <SignOutSubmitButton />
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        <span>AJITDEV · Protected Route Demo</span>
      </footer>
    </div>
  );
}
