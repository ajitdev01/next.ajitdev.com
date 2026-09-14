import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes App — AjitDev Productivity Suite",
  description:
    "A clean, minimal, local-first notes app. Organize ideas with categories, pin priorities, favorite inspirations, and keep your data 100% private in browser storage.",
  keywords: ["notes app", "local storage notes", "markdown notes", "productivity", "ajit dev"],
  openGraph: {
    title: "Notes App — AjitDev Productivity Suite",
    description: "Ultra-fast, private, local-first notes app crafted with a refined white aesthetic.",
    type: "website",
  },
};

export default function NoteLayout({
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
