import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todo App — AjitDev Productivity Suite",
  description:
    "Organize your tasks, priorities, and daily workflows with offline local-first storage and a clean minimalist design.",
  keywords: ["todo app", "task manager", "local-first", "productivity", "ajit dev"],
  openGraph: {
    title: "Todo App — AjitDev Productivity Suite",
    description: "Fast, focused task management with zero cloud lock-in.",
    type: "website",
  },
};

export default function TodoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      {children}
    </div>
  );
}
