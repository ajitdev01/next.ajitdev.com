import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/config";
import Footer from "@/app/components/footer";

const pageUrl = `${siteConfig.siteUrl}/contact`;
const title = "Contact Ajit Dev | Get in Touch";
const description =
  "Contact Ajit Dev (AJITDEV) — Full Stack Developer based in Katihar, Bihar, India. Send a message for collaborations, API support, or project inquiries.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased flex flex-col justify-between">
      <div className="flex-1">{children}</div>
      <Footer theme="light" />
    </div>
  );
}
