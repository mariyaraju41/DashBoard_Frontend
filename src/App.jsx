import React, { useState, useEffect } from "react";
import {
  Cloud,
  DollarSign,
  Quote,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Sparkles,
  RefreshCw,
  MapPin,
  Search,
  Eye,
  Gauge,
  ArrowRightLeft,
  ChevronRight,
  Zap,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

const API_BASE_URL = "http://localhost:5000/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("weather");
  const [weatherData, setWeatherData] = useState(null);
  const [currencyAmount, setCurrencyAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [conversionResult, setConversionResult] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch weather or quotes automatically
  useEffect(() => {
    if (activeTab === "weather" && !weatherData) fetchWeatherByCity("Hyderabad");
    if (activeTab === "quote" && !quote) fetchRandomQuote();
  }, [activeTab]);

  // Fetch weather
  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/weather?city=${city}`);
      const data = await res.json();
      setWeatherData(data);
      setError("");
    } catch (err) {
      setError("Unable to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch quote
  const fetchRandomQuote = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/quote/random`);
      const data = await res.json();
      setQuote(data);
      setError("");
    } catch (err) {
      setError("Unable to fetch quote");
    } finally {
      setLoading(false);
    }
  };

  // Convert currency
  const convertCurrency = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/currency/convert?amount=${currencyAmount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await res.json();
      setConversionResult(data);
      setError("");
    } catch (err) {
      setError("Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    if (!iconCode) return <Cloud className="w-24 h-24" />;
    const code = iconCode.substring(0, 2);
    if (code === "01")
      return <Sun className="w-24 h-24 text-yellow-400 drop-shadow-lg" />;
    if (code === "09" || code === "10" || code === "11")
      return <CloudRain className="w-24 h-24 text-blue-400 drop-shadow-lg" />;
    return <Cloud className="w-24 h-24 text-slate-400 drop-shadow-lg" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* HEADER */}
      <header className="flex justify-between items-center px-10 py-6 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-lg">
        <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          InfoHub Dashboard
        </h1>
        <nav className="flex gap-6">
          {["weather", "currency", "quote"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize font-semibold hover:text-pink-400 transition ${
                activeTab === tab ? "text-pink-400" : "text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* TAB BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-10 py-10">
        {[
          { id: "weather", icon: Cloud, color: "from-blue-500 to-cyan-400" },
          { id: "currency", icon: DollarSign, color: "from-emerald-500 to-teal-400" },
          { id: "quote", icon: Quote, color: "from-purple-500 to-pink-500" },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden group rounded-3xl bg-gradient-to-br ${tab.color} p-6 shadow-2xl ${
              activeTab === tab.id ? "ring-4 ring-white/40" : ""
            }`}
          >
            <tab.icon className="w-10 h-10 mb-3 mx-auto opacity-90 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-xl text-center capitalize">{tab.id}</h3>
          </motion.button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <main className="px-10 pb-20">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10"
        >
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin h-12 w-12 border-4 border-white/20 border-t-pink-400 rounded-full mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-red-300 font-semibold py-4">{error}</div>
          )}

          {/* WEATHER TAB */}
          {!loading && activeTab === "weather" && weatherData && (
            <div className="space-y-8 text-center">
              <div className="flex justify-center items-center gap-6">
                {getWeatherIcon(weatherData.weather?.[0]?.icon)}
                <div>
                  <h2 className="text-6xl font-bold">{weatherData.name}</h2>
                  <p className="text-blue-300 text-lg">{weatherData.sys?.country}</p>
                  <p className="text-blue-200">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="text-7xl font-extrabold">
                {Math.round(weatherData.main?.temp)}°C
              </div>
              <p className="capitalize text-blue-200 text-lg">
                {weatherData.weather?.[0]?.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {[
                  {
                    icon: Droplets,
                    label: "Humidity",
                    value: `${weatherData.main?.humidity}%`,
                  },
                  {
                    icon: Wind,
                    label: "Wind Speed",
                    value: `${weatherData.wind?.speed} m/s`,
                  },
                  {
                    icon: Eye,
                    label: "Visibility",
                    value: `${(weatherData.visibility / 1000).toFixed(1)} km`,
                  },
                  {
                    icon: Gauge,
                    label: "Pressure",
                    value: `${weatherData.main?.pressure} hPa`,
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 rounded-2xl p-5 backdrop-blur hover:bg-white/20 transition"
                  >
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-300" />
                    <h4 className="font-bold text-2xl">{stat.value}</h4>
                    <p className="text-slate-300">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* CURRENCY TAB */}
          {!loading && activeTab === "currency" && (
            <div className="max-w-xl mx-auto text-center space-y-6">
              <h2 className="text-4xl font-bold mb-6 text-emerald-300">
                💱 Currency Converter
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  type="number"
                  value={currencyAmount}
                  onChange={(e) => setCurrencyAmount(e.target.value)}
                  className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                  placeholder="Enter amount"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="INR">INR ₹</option>
                    <option value="USD">USD $</option>
                    <option value="EUR">EUR €</option>
                  </select>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="USD">USD $</option>
                    <option value="EUR">EUR €</option>
                    <option value="INR">INR ₹</option>
                  </select>
                </div>
                <button
                  onClick={convertCurrency}
                  className="mt-4 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-2xl font-bold hover:scale-105 transition"
                >
                  Convert
                </button>
              </div>

              {conversionResult && (
                <div className="mt-6 bg-white/10 p-6 rounded-2xl border border-white/20">
                  <p className="text-slate-300 text-lg mb-2">
                    {conversionResult.amount} {conversionResult.from} =
                  </p>
                  <p className="text-4xl font-extrabold text-white mb-2">
                    {conversionResult.result} {conversionResult.to}
                  </p>
                  <p className="text-emerald-200 text-sm">
                    Rate: 1 {conversionResult.from} = {conversionResult.rate}{" "}
                    {conversionResult.to}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* QUOTES TAB */}
          {!loading && activeTab === "quote" && quote && (
            <div className="text-center space-y-8">
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl md:text-4xl font-semibold italic text-white leading-relaxed"
              >
                “{quote.quote}”
              </motion.blockquote>
              <p className="text-xl text-pink-300 font-bold">— {quote.author}</p>
              <button
                onClick={fetchRandomQuote}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:scale-105 transition font-semibold inline-flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                New Quote
              </button>
            </div>
          )}
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-6 text-white/50 text-sm border-t border-white/10">
        Built with ❤️ by <span className="text-pink-400 font-semibold">MR</span>
      </footer>
    </div>
  );
}
