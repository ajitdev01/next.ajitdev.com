import type { Metadata } from "next";
import Script from "next/script";
import StoreClient from "./store-client";
import Footer from "@/app/components/footer";
import ReduxProvider from "@/lib/store/provider";
import { fetchProducts } from "@/lib/store-data";

import { siteConfig } from "@/lib/seo/config";
import {
  buildConnectedGraph,
  buildBreadcrumbSchema,
} from "@/lib/seo/schema";
import JsonLd from "@/components/seo/json-ld";

const pageUrl = `${siteConfig.siteUrl}/store`;
const title = "E-comm Store | Premium E-Commerce & Curated Catalog";
const description =
  "Browse curated premium products across electronics, fashion, beauty, smartphones, and laptops with interactive Redux cart and secure Razorpay checkout.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "e-commerce store",
    "online shopping",
    "electronics store",
    "fashion store",
    "Next.js store",
    "Redux store",
    "Razorpay checkout",
    "AJITDEV store",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@ajitdev01",
    images: ["/opengraph-image"],
  },
};

export default async function StorePage() {
  const products = await fetchProducts();

  const breadcrumbs = [
    { name: "Home", url: siteConfig.siteUrl },
    { name: "E-comm Store", url: pageUrl },
  ];

  const storeSchema = buildConnectedGraph([
    {
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collectionpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "en-US",
      isPartOf: {
        "@id": `${siteConfig.siteUrl}/#website`,
      },
      about: {
        "@id": "https://www.ajitdev.com/#person",
      },
      breadcrumb: {
        "@id": `${pageUrl}#breadcrumb`,
      },
    },
    buildBreadcrumbSchema(breadcrumbs, pageUrl),
  ]);

  return (
    <ReduxProvider>
      <JsonLd id="store-schema-graph" schema={storeSchema} />
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        id="razorpay-checkout-script"
      />
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white antialiased">
        <StoreClient initialProducts={products} />

        {/* Footer */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
          <Footer theme="light" className="w-full" />
        </div>
      </div>
    </ReduxProvider>
  );
}

