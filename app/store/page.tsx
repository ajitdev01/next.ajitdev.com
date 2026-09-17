import type { Metadata } from "next";
import StoreClient from "./store-client";
import Footer from "@/app/components/footer";
import ReduxProvider from "@/lib/store/provider";
import { fetchProducts } from "@/lib/store-data";

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

export default async function StorePage() {
  const products = await fetchProducts();

  return (
    <ReduxProvider>
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

