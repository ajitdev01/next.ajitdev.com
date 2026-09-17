"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Select from "@radix-ui/react-select";
import * as Separator from "@radix-ui/react-separator";
import {
  Search,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  CloudRain,
  X,
  Loader2,
  Navigation,
  ArrowRight,
  CloudSun,
  Compass,
  Cloud,
  Check,
  ChevronDown,
  Info,
  Clock,
  Sparkles,
  History,
  RotateCw,
  Umbrella,
  Sun,
  ShieldCheck,
} from "lucide-react";

/* ───────── Types ───────── */
interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

interface WeatherWind {
  speed: number;
  deg: number;
  gust?: number;
}

interface WeatherSys {
  country: string;
  sunrise: number;
  sunset: number;
}

interface WeatherData {
  name: string;
  main: WeatherMain;
  weather: WeatherCondition[];
  wind: WeatherWind;
  clouds: { all: number };
  visibility: number;
  sys: WeatherSys;
  dt: number;
  timezone: number;
  coord: { lat: number; lon: number };
}

interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: WeatherMain;
  weather: WeatherCondition[];
  wind: WeatherWind;
  clouds: { all: number };
  pop?: number;
}

interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

interface ApiResponse {
  locations: GeoLocation[];
  weather: WeatherData;
  forecast?: ForecastData | null;
  error?: string;
}

type Unit = "C" | "F";

/* ───────── Static & Helpers ───────── */
const POPULAR_CITIES = [
  { name: "London", flag: "🇬🇧" },
  { name: "New York", flag: "🇺🇸" },
  { name: "Tokyo", flag: "🇯🇵" },
  { name: "Paris", flag: "🇫🇷" },
  { name: "Dubai", flag: "🇦🇪" },
  { name: "Mumbai", flag: "🇮🇳" },
  { name: "Sydney", flag: "🇦🇺" },
  { name: "Singapore", flag: "🇸🇬" },
];

const WORLD_CAPITALS = [
  { name: "London", country: "United Kingdom", flag: "🇬🇧" },
  { name: "New York", country: "United States", flag: "🇺🇸" },
  { name: "Tokyo", country: "Japan", flag: "🇯🇵" },
  { name: "Paris", country: "France", flag: "🇫🇷" },
  { name: "Berlin", country: "Germany", flag: "🇩🇪" },
  { name: "Rome", country: "Italy", flag: "🇮🇹" },
  { name: "Dubai", country: "United Arab Emirates", flag: "🇦🇪" },
  { name: "Mumbai", country: "India", flag: "🇮🇳" },
  { name: "Singapore", country: "Singapore", flag: "🇸🇬" },
  { name: "Sydney", country: "Australia", flag: "🇦🇺" },
  { name: "Toronto", country: "Canada", flag: "🇨🇦" },
  { name: "Seoul", country: "South Korea", flag: "🇰🇷" },
  { name: "Zurich", country: "Switzerland", flag: "🇨🇭" },
  { name: "Amsterdam", country: "Netherlands", flag: "🇳🇱" },
  { name: "Madrid", country: "Spain", flag: "🇪🇸" },
];

function formatTemp(celsius: number, unit: Unit): string {
  if (unit === "C") return `${Math.round(celsius)}°`;
  return `${Math.round((celsius * 9) / 5 + 32)}°`;
}

function formatSpeed(metersPerSec: number, unit: Unit): string {
  if (unit === "C") return `${(metersPerSec * 3.6).toFixed(1)} km/h`;
  return `${(metersPerSec * 2.237).toFixed(1)} mph`;
}

function formatDistance(meters: number, unit: Unit): string {
  if (unit === "C") return `${(meters / 1000).toFixed(1)} km`;
  return `${(meters / 1609.34).toFixed(1)} mi`;
}

function formatTime(unix: number, timezoneOffset: number): string {
  const date = new Date((unix + timezoneOffset) * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

function getCityLocalInfo(timezoneOffset: number): {
  timeStr: string;
  dateStr: string;
  isNight: boolean;
} {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const cityDate = new Date(utcMs + timezoneOffset * 1000);
  const hour = cityDate.getHours();
  const isNight = hour < 6 || hour >= 19;

  return {
    timeStr: cityDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    dateStr: cityDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }),
    isNight,
  };
}

function windDirection(deg: number): string {
  const dirs = [
    "North",
    "NNE",
    "North East",
    "ENE",
    "East",
    "ESE",
    "South East",
    "SSE",
    "South",
    "SSW",
    "South West",
    "WSW",
    "West",
    "WNW",
    "North West",
    "NNW",
  ];
  return dirs[Math.round(deg / 22.5) % 16];
}

function getWeatherEmoji(conditionId: number, icon: string): string {
  const isNight = icon.endsWith("n");
  if (conditionId >= 200 && conditionId < 300) return "⛈️";
  if (conditionId >= 300 && conditionId < 400) return "🌦️";
  if (conditionId >= 500 && conditionId < 600) return "🌧️";
  if (conditionId >= 600 && conditionId < 700) return "🌨️";
  if (conditionId >= 700 && conditionId < 800) return "🌫️";
  if (conditionId === 800) return isNight ? "🌙" : "☀️";
  if (conditionId === 801) return isNight ? "🌙" : "🌤️";
  if (conditionId === 802) return "⛅";
  return "☁️";
}

function getWeatherAdvice(w: WeatherData): {
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
} {
  const temp = w.main.temp;
  const cond = w.weather[0]?.main?.toLowerCase() || "";
  const wind = w.wind.speed;

  if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("thunderstorm")) {
    return {
      title: "Precipitation Expected",
      desc: "Wet conditions detected. Keep an umbrella handy and exercise caution on slick roadways.",
      badge: "Rain Alert",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }
  if (temp > 32) {
    return {
      title: "High Heat Conditions",
      desc: "Stay hydrated, use high-SPF sunscreen, and seek shade during midday peak hours.",
      badge: "Heat Index High",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }
  if (temp < 5) {
    return {
      title: "Chilly Temperatures",
      desc: "Cold air mass present. Dress warmly in thermal layers before heading outside.",
      badge: "Cold Warning",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    };
  }
  if (wind > 10) {
    return {
      title: "Breezy / Gusty Conditions",
      desc: "Noticeable crosswinds. Secure lightweight outdoor furniture or patio items.",
      badge: "Wind Advisory",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    };
  }
  return {
    title: "Optimal Weather Conditions",
    desc: "Mild temperatures and favorable atmospheric stability. Perfect for outdoor activities.",
    badge: "Pleasant & Clear",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
}

/* ───────── Stat Card Component with Radix Tooltip ───────── */
function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  sublabel,
  tooltip,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  sublabel?: string;
  tooltip: string;
  color: string;
}) {
  return (
    <Tooltip.Root delayDuration={150}>
      <Tooltip.Trigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative rounded-2xl bg-white border border-slate-200/90 p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-help"
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition-colors">
                {label}
              </span>
            </div>
            <Info className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-bold text-slate-400">{unit}</span>
            )}
          </div>

          {sublabel && (
            <p className="mt-1 text-[11px] font-medium text-slate-500 truncate">
              {sublabel}
            </p>
          )}
        </motion.div>
      </Tooltip.Trigger>

      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          className="z-[250] max-w-xs rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-xl shadow-slate-900/20 animate-in fade-in-0 zoom-in-95"
        >
          {tooltip}
          <Tooltip.Arrow className="fill-slate-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/* ───────── Main Weather Client ───────── */
export default function WeatherClient() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [locations, setLocations] = useState<GeoLocation[] | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [unit, setUnit] = useState<Unit>("C");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("weather_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveRecentSearch = useCallback((cityName: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
      const updated = [cityName, ...filtered].slice(0, 5);
      try {
        localStorage.setItem("weather_recent_searches", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  const fetchWeather = useCallback(
    async (query: string, lat?: number, lon?: number) => {
      setLoading(true);
      setError(null);

      try {
        let url: string;
        if (lat !== undefined && lon !== undefined) {
          url = `/api/weather?lat=${lat}&lon=${lon}`;
        } else {
          url = `/api/weather?city=${encodeURIComponent(query)}`;
        }

        const res = await fetch(url);
        const data: ApiResponse = await res.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        // If multiple geocoding locations found, open Radix Dialog
        if (data.locations && data.locations.length > 1 && lat === undefined) {
          setLocations(data.locations);
          setShowLocationDialog(true);
          setWeather(data.weather);
          if (data.forecast) setForecast(data.forecast);
        } else {
          setWeather(data.weather);
          setForecast(data.forecast || null);
          setLocations(data.locations || null);
          setShowLocationDialog(false);
          saveRecentSearch(data.weather.name);
        }
      } catch {
        setError("Failed to fetch weather data. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    },
    [saveRecentSearch]
  );

  // Initial load: Fetch London if no query
  useEffect(() => {
    fetchWeather("London");
  }, [fetchWeather]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const handleSelectLocation = (loc: GeoLocation) => {
    setShowLocationDialog(false);
    setCity(`${loc.name}${loc.state ? `, ${loc.state}` : ""}, ${loc.country}`);
    fetchWeather(loc.name, loc.lat, loc.lon);
  };

  // Geolocation trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        fetchWeather("", pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setIsLocating(false);
        setError("Could not access your location. Please check your browser permissions.");
      },
      { timeout: 8000 }
    );
  };

  const condition = weather?.weather?.[0];
  const localInfo = useMemo(() => {
    if (!weather) return null;
    return getCityLocalInfo(weather.timezone);
  }, [weather]);

  const advice = useMemo(() => {
    if (!weather) return null;
    return getWeatherAdvice(weather);
  }, [weather]);

  // Hourly Forecast filtering (next 8 slots)
  const hourlyForecast = useMemo(() => {
    if (!forecast?.list) return [];
    return forecast.list.slice(0, 8);
  }, [forecast]);

  // Daily Forecast grouping (next 5 days)
  const dailyForecast = useMemo(() => {
    if (!forecast?.list) return [];
    const daysMap: Record<
      string,
      {
        dt: number;
        min: number;
        max: number;
        condition: WeatherCondition;
        rainPop: number;
      }
    > = {};

    forecast.list.forEach((item) => {
      const dateKey = item.dt_txt.split(" ")[0];
      if (!daysMap[dateKey]) {
        daysMap[dateKey] = {
          dt: item.dt,
          min: item.main.temp_min,
          max: item.main.temp_max,
          condition: item.weather[0],
          rainPop: item.pop || 0,
        };
      } else {
        daysMap[dateKey].min = Math.min(daysMap[dateKey].min, item.main.temp_min);
        daysMap[dateKey].max = Math.max(daysMap[dateKey].max, item.main.temp_max);
        if ((item.pop || 0) > daysMap[dateKey].rainPop) {
          daysMap[dateKey].rainPop = item.pop || 0;
        }
      }
    });

    return Object.values(daysMap).slice(0, 5);
  }, [forecast]);

  // Sun progress calculation (0 to 100%)
  const sunProgress = useMemo(() => {
    if (!weather) return 50;
    const nowUnix = Math.floor(Date.now() / 1000);
    const sunrise = weather.sys.sunrise;
    const sunset = weather.sys.sunset;
    if (nowUnix <= sunrise) return 0;
    if (nowUnix >= sunset) return 100;
    return Math.round(((nowUnix - sunrise) / (sunset - sunrise)) * 100);
  }, [weather]);

  return (
    <Tooltip.Provider>
      <div className="relative overflow-hidden">
        {/* ─── Clean Header & Hero Section ─── */}
        <section className="relative bg-white border-b border-slate-200/70 pt-12 pb-14 sm:pt-16 sm:pb-18">
          {/* Subtle luminous glow behind search */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              style={{ contain: "paint" }}
              className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.035)_0%,transparent_70%)]"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 px-3.5 py-1.5 mb-5 shadow-2xs">
              <CloudSun className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-600">
                Live Global Atmospheric Conditions
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
              Weather{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Forecast
              </span>
            </h1>
            <p className="text-sm sm:text-base max-w-lg mx-auto text-slate-500 font-normal leading-relaxed">
              Explore live atmospheric temperatures, wind velocity, humidity, and
              multi-day forecasts for any city worldwide.
            </p>

            {/* ─── Search Bar with Geolocation Button ─── */}
            <form onSubmit={handleSubmit} className="mt-8 mx-auto max-w-xl">
              <div className="relative flex items-center group">
                <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search any city or country (e.g. Tokyo, Paris, Mumbai)..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200/90 bg-white py-3.5 pl-12 pr-32 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs hover:border-slate-300 transition-all"
                />

                {/* Clear Input */}
                {city && (
                  <button
                    type="button"
                    onClick={() => setCity("")}
                    className="absolute right-28 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}

                {/* GPS Location Button */}
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  title="Detect My Location"
                  className="absolute right-20 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition active:scale-95 disabled:opacity-50"
                >
                  {isLocating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                  ) : (
                    <Navigation className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Submit Search Button */}
                <button
                  type="submit"
                  disabled={loading || !city.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-95 disabled:opacity-40 transition-all"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </button>
              </div>
            </form>

            {/* ─── Toolbar: Popular City Chips + World Capitals Radix Select + Unit Switcher ─── */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {/* Quick Popular City Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 mr-0.5">
                  Popular:
                </span>
                {POPULAR_CITIES.slice(0, 5).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setCity(c.name);
                      fetchWeather(c.name);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-indigo-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all"
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>

              {/* Radix Select for World Capitals */}
              <div className="flex items-center gap-2">
                <Select.Root
                  onValueChange={(val) => {
                    setCity(val);
                    fetchWeather(val);
                  }}
                >
                  <Select.Trigger
                    aria-label="Select World Capital"
                    className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                  >
                    <Compass className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span>World Capitals</span>
                    <Select.Icon>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content
                      position="popper"
                      sideOffset={6}
                      className="z-[200] w-[220px] max-h-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-300/30 animate-in fade-in-0 zoom-in-95"
                    >
                      <Select.Viewport className="overflow-y-auto max-h-[280px] p-1">
                        {WORLD_CAPITALS.map((cap) => (
                          <Select.Item
                            key={cap.name}
                            value={cap.name}
                            className="flex cursor-pointer select-none items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none data-[highlighted]:bg-slate-100 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-700 transition"
                          >
                            <span className="text-sm">{cap.flag}</span>
                            <Select.ItemText>
                              <span>{cap.name}</span>
                            </Select.ItemText>
                            <span className="ml-auto text-[10px] text-slate-400 font-normal">
                              {cap.country}
                            </span>
                            <Select.ItemIndicator className="ml-1">
                              <Check className="h-3 w-3 text-indigo-600" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                {/* Radix Tabs for °C / °F Unit Toggle */}
                <Tabs.Root
                  value={unit}
                  onValueChange={(val) => setUnit(val as Unit)}
                  className="rounded-xl border border-slate-200 bg-slate-100/80 p-0.5 inline-flex"
                >
                  <Tabs.List className="flex items-center">
                    <Tabs.Trigger
                      value="C"
                      className="rounded-lg px-2.5 py-0.5 text-xs font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs text-slate-500 hover:text-slate-800"
                    >
                      °C
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="F"
                      className="rounded-lg px-2.5 py-0.5 text-xs font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs text-slate-500 hover:text-slate-800"
                    >
                      °F
                    </Tabs.Trigger>
                  </Tabs.List>
                </Tabs.Root>
              </div>
            </div>

            {/* Recent Searches Pills */}
            {recentSearches.length > 0 && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <History className="h-3 w-3" />
                <span>Recent:</span>
                {recentSearches.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setCity(r);
                      fetchWeather(r);
                    }}
                    className="font-medium text-slate-600 hover:text-indigo-600 hover:underline transition"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── Error Notification ─── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-6"
            >
              <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 shadow-xs">
                <CloudRain className="h-5 w-5 text-rose-500 shrink-0" />
                <p className="text-sm font-medium text-rose-800">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto h-7 w-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 hover:bg-rose-200 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Main Weather Content ─── */}
        {weather && condition && localInfo && (
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* 1. Hero Weather Card — Clean Crisp White */}
            <motion.div
              key={weather.name + weather.dt}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm"
            >
              {/* Top Row: Location + Local Time + Refresh */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                      {weather.name}
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-600">
                        {weather.sys.country}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      {localInfo.dateStr} • Local Time:{" "}
                      <strong className="text-slate-700">{localInfo.timeStr}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                    {weather.coord.lat.toFixed(2)}°N, {weather.coord.lon.toFixed(2)}°E
                  </span>
                  <button
                    onClick={() => fetchWeather(weather.name, weather.coord.lat, weather.coord.lon)}
                    disabled={loading}
                    title="Refresh conditions"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition active:scale-95"
                  >
                    <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Main Weather Information Display */}
              <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl sm:text-8xl font-black tracking-tight text-slate-900">
                      {formatTemp(weather.main.temp, unit)}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-slate-400">
                      {unit === "C" ? "Celsius" : "Fahrenheit"}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-800">
                      <span>{getWeatherEmoji(condition.id, condition.icon)}</span>
                      <span>{condition.description}</span>
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Feels like{" "}
                      <strong className="text-slate-800">
                        {formatTemp(weather.main.feels_like, unit)}
                      </strong>
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-xs font-bold text-slate-400">
                    <span className="text-slate-600">
                      High: {formatTemp(weather.main.temp_max, unit)}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600">
                      Low: {formatTemp(weather.main.temp_min, unit)}
                    </span>
                  </div>
                </div>

                {/* Big Condition Icon & Visual Badge */}
                <div className="flex flex-col items-center sm:items-end">
                  <span className="text-7xl sm:text-8xl leading-none filter drop-shadow-sm">
                    {getWeatherEmoji(condition.id, condition.icon)}
                  </span>
                  <span className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {condition.main}
                  </span>
                </div>
              </div>

              {/* Advisory Banner */}
              {advice && (
                <div
                  className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 ${advice.badgeColor} transition-all`}
                >
                  <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">{advice.title}</span>
                      <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                        {advice.badge}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 opacity-90">{advice.desc}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* 2. Hourly Timeline Forecast Cards (Next 24 Hours) */}
            {hourlyForecast.length > 0 && (
              <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Upcoming Hourly Forecast
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    Next 24 Hours
                  </span>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {hourlyForecast.map((h, i) => {
                    const timeLabel =
                      i === 0
                        ? "Now"
                        : new Date(h.dt * 1000).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            hour12: true,
                          });
                    const hCond = h.weather[0];

                    return (
                      <div
                        key={h.dt}
                        className={`flex min-w-[85px] flex-col items-center rounded-2xl p-3 text-center border transition-all ${
                          i === 0
                            ? "border-indigo-200 bg-indigo-50/40 shadow-xs"
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/70"
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-500">
                          {timeLabel}
                        </span>
                        <span className="my-2 text-2xl">
                          {getWeatherEmoji(hCond.id, hCond.icon)}
                        </span>
                        <span className="text-sm font-extrabold text-slate-900">
                          {formatTemp(h.main.temp, unit)}
                        </span>
                        {h.pop !== undefined && h.pop > 0 ? (
                          <div className="mt-1 flex items-center gap-0.5 text-[10px] font-bold text-blue-600">
                            <Umbrella className="h-2.5 w-2.5" />
                            <span>{Math.round(h.pop * 100)}%</span>
                          </div>
                        ) : (
                          <span className="mt-1 text-[10px] font-medium text-slate-400 capitalize truncate max-w-[70px]">
                            {hCond.main}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Comprehensive Atmospheric Stats Grid with Radix Tooltips */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>Atmospheric & Environmental Metrics</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                  icon={Droplets}
                  label="Humidity"
                  value={weather.main.humidity}
                  unit="%"
                  sublabel={
                    weather.main.humidity > 65
                      ? "Humid & Moist"
                      : weather.main.humidity < 35
                      ? "Dry Atmosphere"
                      : "Optimal Balance"
                  }
                  tooltip="Relative humidity is the ratio of current moisture in the air compared to maximum saturation."
                  color="bg-blue-500"
                />

                <StatCard
                  icon={Wind}
                  label="Wind Speed"
                  value={formatSpeed(weather.wind.speed, unit)}
                  sublabel={`Direction: ${windDirection(weather.wind.deg)}`}
                  tooltip="Sustained surface wind velocity measured at standard 10-meter atmospheric elevation."
                  color="bg-teal-500"
                />

                <StatCard
                  icon={Gauge}
                  label="Pressure"
                  value={weather.main.pressure}
                  unit="hPa"
                  sublabel={
                    weather.main.pressure >= 1013 ? "High System" : "Low System"
                  }
                  tooltip="Barometric atmospheric pressure. Standard sea-level pressure is 1013.25 hPa."
                  color="bg-purple-500"
                />

                <StatCard
                  icon={Eye}
                  label="Visibility"
                  value={formatDistance(weather.visibility, unit)}
                  sublabel={
                    weather.visibility >= 9000
                      ? "Clear Sight"
                      : weather.visibility >= 4000
                      ? "Moderate"
                      : "Low Visibility"
                  }
                  tooltip="Maximum horizontal distance at which prominent objects can be recognized."
                  color="bg-amber-500"
                />

                <StatCard
                  icon={Sunrise}
                  label="Sunrise"
                  value={formatTime(weather.sys.sunrise, weather.timezone)}
                  sublabel="Dawn time"
                  tooltip="Civil sunrise time calculated for this city's exact geographic coordinates."
                  color="bg-orange-400"
                />

                <StatCard
                  icon={Sunset}
                  label="Sunset"
                  value={formatTime(weather.sys.sunset, weather.timezone)}
                  sublabel="Dusk time"
                  tooltip="Civil sunset time calculated for this city's exact geographic coordinates."
                  color="bg-indigo-500"
                />

                <StatCard
                  icon={Cloud}
                  label="Cloudiness"
                  value={weather.clouds.all}
                  unit="%"
                  sublabel={
                    weather.clouds.all < 20
                      ? "Clear Sky"
                      : weather.clouds.all < 60
                      ? "Scattered Clouds"
                      : "Overcast"
                  }
                  tooltip="Cloud coverage fraction across the celestial dome."
                  color="bg-slate-500"
                />

                <StatCard
                  icon={Navigation}
                  label="Wind Gusts"
                  value={
                    weather.wind.gust
                      ? formatSpeed(weather.wind.gust, unit)
                      : "None"
                  }
                  sublabel={weather.wind.gust ? "Peak velocity" : "Calm gusts"}
                  tooltip="Short, sudden increases in wind speed lasting less than 20 seconds."
                  color="bg-cyan-500"
                />
              </div>
            </div>

            {/* 4. Sunlight & Daylight Arc Progression Card */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Solar Cycle & Daylight Progress
                  </h3>
                </div>
                <span className="text-xs font-bold text-indigo-600">
                  {sunProgress}% Daylight Complete
                </span>
              </div>

              {/* Daylight Progress Bar */}
              <div className="relative h-3 w-full rounded-full bg-slate-100 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-indigo-500 transition-all duration-500"
                  style={{ width: `${sunProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Sunrise className="h-3.5 w-3.5 text-orange-400" />
                  <span>Sunrise: {formatTime(weather.sys.sunrise, weather.timezone)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sunset className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Sunset: {formatTime(weather.sys.sunset, weather.timezone)}</span>
                </div>
              </div>
            </div>

            {/* 5. 5-Day Daily Forecast Overview */}
            {dailyForecast.length > 0 && (
              <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>5-Day Extended Forecast</span>
                </h3>

                <div className="divide-y divide-slate-100">
                  {dailyForecast.map((day, idx) => {
                    const dayName =
                      idx === 0
                        ? "Today"
                        : new Date(day.dt * 1000).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          });

                    return (
                      <div
                        key={day.dt}
                        className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                      >
                        <span className="w-28 text-xs font-bold text-slate-800">
                          {dayName}
                        </span>

                        <div className="flex items-center gap-2 min-w-[120px]">
                          <span className="text-xl">
                            {getWeatherEmoji(day.condition.id, day.condition.icon)}
                          </span>
                          <span className="text-xs font-medium text-slate-600 capitalize">
                            {day.condition.description}
                          </span>
                        </div>

                        {day.rainPop > 0 && (
                          <span className="text-[11px] font-bold text-blue-600 hidden sm:inline">
                            {Math.round(day.rainPop * 100)}% rain
                          </span>
                        )}

                        <div className="flex items-center gap-3 text-xs font-bold">
                          <span className="text-slate-900">
                            {formatTemp(day.max, unit)}
                          </span>
                          <span className="text-slate-400 font-medium">
                            {formatTemp(day.min, unit)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Radix UI Location Picker Dialog ─── */}
        <Dialog.Root open={showLocationDialog} onOpenChange={setShowLocationDialog}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-sm animate-in fade-in-0 duration-150" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[210] w-[92vw] max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200/90 outline-none animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <Dialog.Title className="text-base font-bold text-slate-900">
                      Select Location
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-500">
                      Multiple matches found for your query.
                    </Dialog.Description>
                  </div>
                </div>

                <Dialog.Close asChild>
                  <button className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Dialog.Close>
              </div>

              {/* Location options */}
              <div className="mt-4 flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
                {locations?.map((loc, i) => (
                  <button
                    key={`${loc.lat}-${loc.lon}-${i}`}
                    onClick={() => handleSelectLocation(loc)}
                    className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50 active:scale-[0.99]"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-900">
                        {loc.name}
                        {loc.state ? `, ${loc.state}` : ""}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {loc.country} • {loc.lat.toFixed(2)}°N, {loc.lon.toFixed(2)}°E
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition" />
                  </button>
                ))}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </Tooltip.Provider>
  );
}
