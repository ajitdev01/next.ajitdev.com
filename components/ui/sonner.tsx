"use client";

import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:p-3.5 group-[.toaster]:text-xs font-semibold backdrop-blur-md",
          description: "group-[.toast]:text-slate-500 font-normal mt-0.5",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-white font-bold rounded-xl",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600 font-bold rounded-xl",
          success:
            "group-[.toaster]:border-emerald-200 group-[.toaster]:text-emerald-950",
          error:
            "group-[.toaster]:border-rose-200 group-[.toaster]:text-rose-950",
          info:
            "group-[.toaster]:border-indigo-200 group-[.toaster]:text-indigo-950",
          warning:
            "group-[.toaster]:border-amber-200 group-[.toaster]:text-amber-950",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
