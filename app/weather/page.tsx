import type { Metadata } from "next";
import WeatherClient from "./weather-client";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Weather Forecast | Live Conditions",
  description:
    "Search any city worldwide for live weather conditions — temperature, humidity, wind speed, pressure, sunrise & sunset times powered by OpenWeatherMap.",
  openGraph: {
    title: "Weather Forecast | Live Conditions",
    description:
      "Search any city worldwide for live weather conditions — temperature, humidity, wind speed, pressure, sunrise & sunset times.",
    type: "website",
  },
};

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white antialiased">
      <WeatherClient />

      {/* Footer */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <Footer theme="light" className="w-full" />
      </div>
    </div>
  );
}
