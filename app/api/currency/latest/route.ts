import { NextRequest, NextResponse } from "next/server";
import { fallbackUsdRates } from "@/lib/currency-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = (searchParams.get("from") || "USD").toUpperCase();
  const to = searchParams.get("to") ? searchParams.get("to")!.toUpperCase() : null;
  const amountStr = searchParams.get("amount") || "1";
  const amount = parseFloat(amountStr) || 1;

  try {
    const frankfurterUrl = new URL("https://api.frankfurter.app/latest");
    frankfurterUrl.searchParams.set("from", from);
    if (to) {
      frankfurterUrl.searchParams.set("to", to);
    }

    const response = await fetch(frankfurterUrl.toString(), {
      next: { revalidate: 300 }, // Cache 5 min
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        source: "frankfurter-ecb",
        base: data.base || from,
        date: data.date,
        amount: data.amount,
        rates: data.rates,
      });
    }

    throw new Error(`Frankfurter responded with status: ${response.status}`);
  } catch (error) {
    console.warn("Frankfurter API fetch failed, utilizing fallback rates:", error);

    // Compute fallback rates using benchmark relative USD rates
    const fromUsdRate = fallbackUsdRates[from] || 1;
    const computedRates: Record<string, number> = {};

    if (to) {
      const toUsdRate = fallbackUsdRates[to] || 1;
      computedRates[to] = Number((toUsdRate / fromUsdRate).toFixed(4));
    } else {
      Object.keys(fallbackUsdRates).forEach((code) => {
        if (code !== from) {
          const targetUsdRate = fallbackUsdRates[code];
          computedRates[code] = Number((targetUsdRate / fromUsdRate).toFixed(4));
        }
      });
    }

    return NextResponse.json({
      success: true,
      source: "fallback-cache",
      base: from,
      date: new Date().toISOString().split("T")[0],
      amount: amount,
      rates: computedRates,
    });
  }
}
