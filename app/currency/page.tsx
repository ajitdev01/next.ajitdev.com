import type { Metadata } from "next";
import CurrencyClient from "./currency-client";
import Footer from "@/app/components/footer";
import { siteConfig } from "@/lib/seo/config";

const pageUrl = `${siteConfig.siteUrl}/currency`;
const title = "Currency Converter | Real-Time Exchange Rates (Frankfurter ECB)";
const description =
  "Convert live exchange rates across 31 world currencies powered by Frankfurter API and the European Central Bank. Explore interactive 1Y historical charts, parity tables, and mid-market rates.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "currency converter",
    "live exchange rates",
    "USD to INR",
    "EUR to USD",
    "GBP to INR",
    "Frankfurter API",
    "ECB exchange rates",
    "real time currency converter",
    "forex rates",
    "AJITDEV currency",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@ajitdev01",
  },
};

export default function CurrencyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AJITDEV Global Currency Converter",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    url: pageUrl,
    description: description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Ajit Dev",
      url: siteConfig.siteUrl,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white antialiased flex flex-col justify-between">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        <CurrencyClient />
      </main>

      {/* Footer */}
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-10">
        <Footer theme="light" className="w-full" />
      </div>
    </div>
  );
}