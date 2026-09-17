import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/weather?city=London
 *
 * 1. Geocode the city name → lat/lon (up to 5 results)
 * 2. Fetch current weather for the first (or chosen) result
 * Returns combined geo + weather payload.
 */

const API_KEY = process.env.OPENWEATHER_API_KEY;

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

  if (!API_KEY) {
    return NextResponse.json(
      { error: "OPENWEATHER_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

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
        `&appid=${API_KEY}`;

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
      `&appid=${API_KEY}` +
      `&units=metric`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      return NextResponse.json(
        { error: "Weather API request failed." },
        { status: weatherResponse.status }
      );
    }

    const weather = await weatherResponse.json();

    return NextResponse.json({
      locations,
      weather,
    });
  } catch (err) {
    console.error("[/api/weather] Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching weather data." },
      { status: 500 }
    );
  }
}
