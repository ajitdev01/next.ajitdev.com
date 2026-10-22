import type { Metadata } from "next";
import WeatherClient from "./weather-client";
import Footer from "@/app/components/footer";
import { siteConfig } from "@/lib/seo/config";
import {
  buildConnectedGraph,
  buildBreadcrumbSchema,
  buildSoftwareApplicationSchema,
} from "@/lib/seo/schema";
import JsonLd from "@/components/seo/json-ld";

const pageUrl = `${siteConfig.siteUrl}/weather`;
const title = "Weather Forecast | Real-Time Conditions & Telemetry";
const description =
  "Search any city worldwide for live atmospheric conditions — temperature, humidity, wind speed, barometric pressure, sunrise & sunset times powered by OpenWeatherMap.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "weather forecast",
    "live weather",
    "temperature conditions",
    "OpenWeatherMap app",
    "Katihar weather",
    "atmospheric telemetry",
    "AJITDEV weather",
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

export default function WeatherPage() {
  const breadcrumbs = [
    { name: "Home", url: siteConfig.siteUrl },
    { name: "Weather App", url: pageUrl },
  ];

  const weatherSchema = buildConnectedGraph([
    buildBreadcrumbSchema(breadcrumbs, pageUrl),
    buildSoftwareApplicationSchema({
      name: "AJITDEV Weather App",
      description,
      url: pageUrl,
      applicationCategory: "WeatherApplication",
      features: [
        "Live City Geocoding Search",
        "Temperature & Atmospheric Pressure Telemetry",
        "Humidity & Wind Speed Monitoring",
        "Sunrise & Sunset Time Calculations",
      ],
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white antialiased">
      <JsonLd id="weather-schema-graph" schema={weatherSchema} />
      <WeatherClient />

      {/* Footer */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <Footer theme="light" className="w-full" />
      </div>
    </div>
  );
}
