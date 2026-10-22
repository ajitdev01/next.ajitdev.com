import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import ClarityAnalytics from "./components/clarity";
import { Analytics } from "@vercel/analytics/next";
import Header from "./components/header";
import ScrollToTop from "./components/scroll-to-top";
import CloudAssistant from "@/components/CloudAssistant";
import ReduxProvider from "@/lib/store/provider";
import { Toaster } from "@/components/ui/sonner";
import PwaRegister from "@/components/pwa-register";

import { siteConfig, personConfig } from "@/lib/seo/config";
import {
  buildConnectedGraph,
  buildWebSiteSchema,
  buildPersonSchema,
  buildOrganizationSchema,
} from "@/lib/seo/schema";
import JsonLd from "@/components/seo/json-ld";

const inter = Inter({
  subsets: ["latin"],
  display: "optional",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: "AJITDEV",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AJITDEV",
  },
  formatDetection: {
    telephone: false,
  },
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: personConfig.name, url: personConfig.url }],
  creator: personConfig.name,
  publisher: siteConfig.publisher,
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AJITDEV — Technical Hub & Developer Ecosystem by Ajit Dev",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    creator: "@ajitdev01",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalSchema = buildConnectedGraph([
    buildWebSiteSchema(),
    buildPersonSchema(),
    buildOrganizationSchema(),
  ]);

  return (
    <html lang="en">
      <head>
        <JsonLd id="global-schema-graph" schema={globalSchema} />
        {/* RSS & Atom Feeds */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="AJITDEV RSS Feed"
          href="/feed.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="AJITDEV RSS Feed (rss.xml)"
          href="/rss.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="AJITDEV Atom Feed"
          href="/feed.xml"
        />
        {/* Author / humans.txt discovery */}
        <link rel="author" href="/humans.txt" />
        {/* PWA & Mobile Web App Compatibility */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="AJITDEV" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AJITDEV" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        {/* Explicit Open Graph Meta Fallbacks */}
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteConfig.defaultTitle} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:url" content={siteConfig.siteUrl} />
        <meta property="og:image" content={`${siteConfig.siteUrl}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AJITDEV — Technical Hub & Developer Ecosystem by Ajit Dev" />
        <meta property="og:locale" content={siteConfig.locale} />
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-N2PBQZ35');
            `,
          }}
        />
        {/* End Google Tag Manager */}
      </head>

      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N2PBQZ35"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Microsoft Clarity */}
        <ClarityAnalytics />

        {/* PWA Service Worker Registration */}
        <PwaRegister />

        <ReduxProvider>
          {/* Global 10-Year UX Sticky Header */}
          <Header />

          {children}

          {/* AJITDEV Cloud Assistant (AI) */}
          <CloudAssistant />

          {/* Global Floating Scroll-To-Top Button */}
          <ScrollToTop />

          {/* shadcn Sonner Toast Provider */}
          <Toaster position="top-center" richColors closeButton />
        </ReduxProvider>

        {/* Razorpay Global Checkout SDK */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
          id="razorpay-global-checkout-sdk"
        />

        {/* Vercel Web Analytics */}
        <Analytics />
      </body>
    </html>
  );
}