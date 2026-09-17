"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

/* ───────── Types ───────── */
interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
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

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
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

interface ApiResponse {
  locations: GeoLocation[];
  weather: WeatherData;
  error?: string;
}

/* ───────── Helpers ───────── */
function formatTime(unix: number, timezoneOffset: number): string {
  const date = new Date((unix + timezoneOffset) * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

function windDirection(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
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

const POPULAR_CITIES = [
  "London", "New York", "Tokyo", "Paris", "Mumbai",
  "Sydney", "Dubai", "Singapore", "Toronto", "Berlin",
];

/* ───────── Stat Card ───────── */
function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300"
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className={`h-8 w-8 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-slate-900">{value}</span>
        {unit && (
          <span className="text-xs font-semibold text-slate-400">{unit}</span>
        )}
      </div>
    </motion.div>
  );
}

/* ───────── Location Picker ───────── */
function LocationPicker({
  locations,
  onSelect,
  onClose,
}: {
  locations: GeoLocation[];
  onSelect: (loc: GeoLocation) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Multiple Locations Found
            </h3>
            <p className="text-xs text-slate-500">Select the correct one</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {locations.map((loc, i) => (
            <button
              key={`${loc.lat}-${loc.lon}`}
              onClick={() => onSelect(loc)}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3.5 text-left transition hover:bg-indigo-50 hover:border-indigo-200 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                  {i + 1}
                </span>
                <div>
                  <span className="text-sm font-bold text-slate-900">
                    {loc.name}
                  </span>
                  {loc.state && (
                    <span className="text-xs text-slate-500">
                      , {loc.state}
                    </span>
                  )}
                  <span className="ml-1.5 text-xs font-semibold text-slate-400">
                    {loc.country}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────── Main Component ───────── */
export default function WeatherClient() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locations, setLocations] = useState<GeoLocation[] | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
          setWeather(null);
          return;
        }

        // If multiple locations and no lat/lon was specified, show picker
        if (
          data.locations &&
          data.locations.length > 1 &&
          lat === undefined
        ) {
          setLocations(data.locations);
          setShowPicker(true);
          setWeather(data.weather);
        } else {
          setWeather(data.weather);
          setLocations(data.locations || null);
          setShowPicker(false);
        }
      } catch {
        setError("Failed to fetch weather data. Please try again.");
        setWeather(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) fetchWeather(city.trim());
  };

  const handleLocationSelect = (loc: GeoLocation) => {
    setShowPicker(false);
    setCity(`${loc.name}${loc.state ? `, ${loc.state}` : ""}, ${loc.country}`);
    fetchWeather(loc.name, loc.lat, loc.lon);
  };

  const handlePopularCity = (c: string) => {
    setCity(c);
    fetchWeather(c);
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const condition = weather?.weather?.[0];

  return (
    <>
      {/* ─── Hero / Search Section — Clean White ─── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 py-16 sm:py-24">
        {/* Subtle ambient decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            style={{ contain: "paint" }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.04)_0%,transparent_70%)]"
          />
          <div
            style={{ contain: "paint" }}
            className="absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.03)_0%,transparent_70%)]"
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 mb-6">
              <CloudSun className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-slate-500">
                Real-time Weather • OpenWeatherMap
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
              Weather{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Forecast
              </span>
            </h1>
            <p className="text-base max-w-lg mx-auto leading-relaxed text-slate-500">
              Search any city worldwide to get live weather conditions,
              temperature, humidity, wind, and more.
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="mt-8 mx-auto max-w-xl"
          >
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search city… e.g. London, Tokyo, Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-13 pr-28 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all"
              />
              <button
                type="submit"
                disabled={loading || !city.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-slate-900/15 transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </motion.form>

          {/* Popular Cities */}
          {!weather && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              <span className="text-xs font-medium text-slate-400 mr-1">
                Popular:
              </span>
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => handlePopularCity(c)}
                  className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 active:scale-95"
                >
                  {c}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── Error State ─── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto max-w-3xl px-4 sm:px-6 mt-6 relative z-20"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 px-5 py-4 shadow-sm">
              <CloudRain className="h-5 w-5 text-rose-500 shrink-0" />
              <p className="text-sm font-medium text-rose-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto h-7 w-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-200 transition shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Weather Result ─── */}
      <AnimatePresence>
        {weather && condition && (
          <motion.section
            key={weather.name + weather.dt}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 relative z-20"
          >
            {/* Main Weather Card — White with subtle border */}
            <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-lg shadow-slate-200/50 overflow-hidden relative">
              {/* Subtle decorative circles */}
              <div
                style={{ contain: "paint" }}
                className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.04)_0%,transparent_70%)] -translate-y-1/3 translate-x-1/4"
              />
              <div
                style={{ contain: "paint" }}
                className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.03)_0%,transparent_70%)] translate-y-1/3 -translate-x-1/4"
              />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-500">
                      {weather.name}, {weather.sys.country}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-7xl sm:text-8xl font-black tracking-tighter text-slate-900">
                      {Math.round(weather.main.temp)}
                    </span>
                    <span className="text-3xl font-bold text-slate-300">
                      °C
                    </span>
                  </div>
                  <p className="text-sm font-medium capitalize mt-1 text-slate-500">
                    Feels like {Math.round(weather.main.feels_like)}°C •{" "}
                    {condition.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-400">
                    <span>H: {Math.round(weather.main.temp_max)}°</span>
                    <span>L: {Math.round(weather.main.temp_min)}°</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-8xl leading-none">
                    {getWeatherEmoji(condition.id, condition.icon)}
                  </span>
                  <span className="mt-2 text-xs font-bold capitalize text-slate-400">
                    {condition.main}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                icon={Droplets}
                label="Humidity"
                value={weather.main.humidity}
                unit="%"
                color="bg-blue-500"
              />
              <StatCard
                icon={Wind}
                label="Wind"
                value={weather.wind.speed.toFixed(1)}
                unit={`m/s ${windDirection(weather.wind.deg)}`}
                color="bg-teal-500"
              />
              <StatCard
                icon={Gauge}
                label="Pressure"
                value={weather.main.pressure}
                unit="hPa"
                color="bg-purple-500"
              />
              <StatCard
                icon={Eye}
                label="Visibility"
                value={(weather.visibility / 1000).toFixed(1)}
                unit="km"
                color="bg-amber-500"
              />
              <StatCard
                icon={Sunrise}
                label="Sunrise"
                value={formatTime(weather.sys.sunrise, weather.timezone)}
                color="bg-orange-400"
              />
              <StatCard
                icon={Sunset}
                label="Sunset"
                value={formatTime(weather.sys.sunset, weather.timezone)}
                color="bg-indigo-500"
              />
              <StatCard
                icon={Thermometer}
                label="Feels Like"
                value={Math.round(weather.main.feels_like)}
                unit="°C"
                color="bg-rose-500"
              />
              <StatCard
                icon={Navigation}
                label="Wind Gust"
                value={weather.wind.gust?.toFixed(1) ?? "—"}
                unit={weather.wind.gust ? "m/s" : ""}
                color="bg-cyan-500"
              />
            </div>

            {/* Coordinates Footer */}
            <div className="mt-6 text-center">
              <span className="text-[11px] font-medium text-slate-400">
                📍 {weather.coord.lat.toFixed(4)}°N, {weather.coord.lon.toFixed(4)}°E
                {" • "}
                Updated {new Date(weather.dt * 1000).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── Location Picker Modal ─── */}
      <AnimatePresence>
        {showPicker && locations && locations.length > 1 && (
          <LocationPicker
            locations={locations}
            onSelect={handleLocationSelect}
            onClose={() => setShowPicker(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
