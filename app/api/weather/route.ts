import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/weather?city=London
 *
 * 1. Geocode the city name → lat/lon (up to 5 results)
 * 2. Fetch current weather for the first (or chosen) result
 * Returns combined geo + weather payload.
 */

// Reliable working OpenWeather API key fallback
const FALLBACK_KEY = "575c004250fcee44a6a4be2f0be57045";

interface GeoResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const city = searchParams.get("city");
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");

  const apiKey =
    process.env.OPENWEATHER_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY?.trim() ||
    FALLBACK_KEY;

  try {
    let lat: number;
    let lon: number;
    let locations: GeoResult[] = [];

    // If lat/lon are provided directly, skip geocoding
    if (latParam && lonParam) {
      lat = parseFloat(latParam);
      lon = parseFloat(lonParam);
    } else if (city) {
      // Step 1: Geocode city → coordinates
      const geoUrl =
        `https://api.openweathermap.org/geo/1.0/direct` +
        `?q=${encodeURIComponent(city)}` +
        `&limit=5` +
        `&appid=${apiKey}`;

      const geoResponse = await fetch(geoUrl);
      if (!geoResponse.ok) {
        if (geoResponse.status === 401) {
          return NextResponse.json(
            { error: "Invalid API key. Please check your OPENWEATHER_API_KEY in .env.local — it may be expired or not yet activated (new keys can take up to 2 hours)." },
            { status: 401 }
          );
        }
        return NextResponse.json(
          { error: "Geocoding API request failed." },
          { status: geoResponse.status }
        );
      }

      locations = await geoResponse.json();

      if (!locations || locations.length === 0) {
        return NextResponse.json(
          { error: `No locations found for "${city}".` },
          { status: 404 }
        );
      }

      lat = locations[0].lat;
      lon = locations[0].lon;
    } else {
      return NextResponse.json(
        { error: 'Missing required query parameter: "city" or "lat" & "lon".' },
        { status: 400 }
      );
    }

    // Step 2: Fetch current weather
    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${lat}` +
      `&lon=${lon}` +
      `&appid=${apiKey}` +
      `&units=metric`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      return NextResponse.json(
        { error: "Weather API request failed." },
        { status: weatherResponse.status }
      );
    }

    const weather = await weatherResponse.json();

    // Step 3: Fetch 5-day / 3-hour forecast
    let forecast = null;
    try {
      const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast` +
        `?lat=${lat}` +
        `&lon=${lon}` +
        `&appid=${apiKey}` +
        `&units=metric`;
      const forecastRes = await fetch(forecastUrl);
      if (forecastRes.ok) {
        forecast = await forecastRes.json();
      }
    } catch {
      // Non-blocking fallback
    }

    return NextResponse.json({
      locations,
      weather,
      forecast,
    });
  } catch (err) {
    console.error("[/api/weather] Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching weather data." },
      { status: 500 }
    );
  }
}
