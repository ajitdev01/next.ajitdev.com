import { NextRequest, NextResponse } from "next/server";
import { fallbackUsdRates } from "@/lib/currency-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = (searchParams.get("from") || "USD").toUpperCase();
  const to = (searchParams.get("to") || "INR").toUpperCase();
  const range = searchParams.get("range") || "30d"; // 7d, 30d, 90d, 1y

  let days = 30;
  if (range === "7d") days = 7;
  else if (range === "30d") days = 30;
  else if (range === "90d") days = 90;
  else if (range === "1y") days = 365;

  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - days * 86400000)
    .toISOString()
    .split("T")[0];

  try {
    const frankfurterUrl = `https://api.frankfurter.app/${startDate}..${endDate}?from=${from}&to=${to}`;

    const res = await fetch(frankfurterUrl, {
      next: { revalidate: 3600 }, // Cache 1 hour
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      const rawRates = data.rates || {};

      const points = Object.entries(rawRates)
        .map(([date, ratesObj]) => {
          const val = (ratesObj as Record<string, number>)[to];
          return {
            date,
            rate: typeof val === "number" ? val : null,
          };
        })
        .filter((pt) => pt.rate !== null) as { date: string; rate: number }[];

      if (points.length > 0) {
        const rates = points.map((p) => p.rate);
        const min = Math.min(...rates);
        const max = Math.max(...rates);
        const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
        const first = rates[0];
        const last = rates[rates.length - 1];
        const change = last - first;
        const changePercent = first !== 0 ? (change / first) * 100 : 0;

        return NextResponse.json({
          success: true,
          base: from,
          quote: to,
          startDate: data.start_date || startDate,
          endDate: data.end_date || endDate,
          points,
          stats: {
            min: Number(min.toFixed(4)),
            max: Number(max.toFixed(4)),
            avg: Number(avg.toFixed(4)),
            current: Number(last.toFixed(4)),
            change: Number(change.toFixed(4)),
            changePercent: Number(changePercent.toFixed(2)),
          },
        });
      }
    }

    throw new Error("No timeseries data returned");
  } catch (err) {
    console.warn("Failed to fetch history from Frankfurter, generating benchmark curve:", err);

    // Fallback benchmark curve
    const fromRate = fallbackUsdRates[from] || 1;
    const toRate = fallbackUsdRates[to] || 1;
    const baseVal = toRate / fromRate;

    const pointsCount = range === "7d" ? 7 : range === "30d" ? 22 : range === "90d" ? 45 : 60;
    const points: { date: string; rate: number }[] = [];

    for (let i = pointsCount - 1; i >= 0; i--) {
      const d = new Date(Date.now() - (i * (days / pointsCount)) * 86400000);
      // Small simulated volatility within 0.8%
      const jitter = 1 + (Math.sin(i * 0.7) * 0.005);
      points.push({
        date: d.toISOString().split("T")[0],
        rate: Number((baseVal * jitter).toFixed(4)),
      });
    }

    const rates = points.map((p) => p.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const first = rates[0];
    const last = rates[rates.length - 1];
    const change = last - first;
    const changePercent = first !== 0 ? (change / first) * 100 : 0;

    return NextResponse.json({
      success: true,
      base: from,
      quote: to,
      fallback: true,
      points,
      stats: {
        min: Number(min.toFixed(4)),
        max: Number(max.toFixed(4)),
        avg: Number(avg.toFixed(4)),
        current: Number(last.toFixed(4)),
        change: Number(change.toFixed(4)),
        changePercent: Number(changePercent.toFixed(2)),
      },
    });
  }
}
