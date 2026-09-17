import type { Metadata } from "next";
import StoreClient from "./store-client";
import Footer from "@/app/components/footer";
import ReduxProvider from "@/lib/store/provider";

export const metadata: Metadata = {
  title: "E-comm Store | Premium E-Commerce",
  description:
    "Browse 50+ curated premium products across electronics, fashion, beauty, smartphones, laptops, and more at the E-comm Store.",
  openGraph: {
    title: "E-comm Store | Premium E-Commerce",
    description:
      "Browse 50+ curated premium products across electronics, fashion, beauty, smartphones, laptops, and more at the E-comm Store.",
    type: "website",
  },
};

export default function StorePage() {
  return (
    <ReduxProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white antialiased">
        <StoreClient />

        {/* Footer */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
          <Footer theme="light" className="w-full" />
        </div>
      </div>
    </ReduxProvider>
  );
}
