"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function GoogleSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span>Connecting to Google...</span>
        </>
      ) : (
        <>
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
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
          <span>Sign in with Google</span>
        </>
      )}
    </button>
  );
}

export function SignOutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition active:scale-98 disabled:opacity-60 cursor-pointer"
    >
      {pending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
          <span>Signing out...</span>
        </>
      ) : (
        <span>Sign Out</span>
      )}
    </button>
  );
}
