import React, { useState, useEffect } from "react";
import {
  Cloud,
  DollarSign,
  Quote,
  Search,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Eye,
  Gauge,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

const API_BASE_URL = "http://localhost:5000/api";

// Search bar component
function SearchBar({ searchCity, setSearchCity, onSearch, loading }) {
  return (
    <div className="relative w-full max-w-lg mb-10">
      <input
        type="text"
        value={searchCity}
        onChange={(e) => setSearchCity(e.target.value)}
        placeholder="Search city weather..."
        className="w-full p-4 pl-12 pr-14 rounded-full border-2 border-white/60 shadow-lg text-lg focus:outline-none focus:border-white bg-white/70 placeholder-gray-600"
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        aria-label="Search city weather"
      />
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-6 h-6 cursor-pointer ${
          loading ? "animate-spin" : ""
        }`}
        onClick={onSearch}
        aria-hidden="true"
      />
      <button
        onClick={onSearch}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold shadow-lg transition disabled:opacity-60"
        disabled={loading}
        aria-label="Search button"
      >
        Go
      </button>
    </div>
  );
}

// Weather icon component
function WeatherIcon({ iconCode }) {
  if (!iconCode) return <Cloud className="w-24 h-24 text-slate-400" />;
  const code = iconCode.substring(0, 2);
  if (code === "01")
    return <Sun className="w-24 h-24 text-yellow-400 drop-shadow-lg" />;
  if (["09", "10", "11"].includes(code))
    return <CloudRain className="w-24 h-24 text-blue-400 drop-shadow-lg" />;
  return <Cloud className="w-24 h-24 text-slate-500 drop-shadow-lg" />;
}

// Weather detail cards
function WeatherStats({ weatherData }) {
  const stats = [
    { label: "Humidity", value: `${weatherData.main?.humidity}%`, icon: Droplets },
    { label: "Wind Speed", value: `${weatherData.wind?.speed} m/s`, icon: Wind },
    { label: "Visibility", value: `${(weatherData.visibility / 1000).toFixed(1)} km`, icon: Eye },
    { label: "Pressure", value: `${weatherData.main?.pressure} hPa`, icon: Gauge },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
      {stats.map(({ label, value, icon: Icon }, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition group border border-gray-200"
        >
          <Icon className="w-10 h-10 mx-auto mb-3 text-blue-700 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-3xl mb-2 text-center">{value}</h4>
          <p className="text-gray-700 text-center text-lg">{label}</p>
        </div>
      ))}
    </div>
  );
}

// Currency Converter Component
function CurrencyConverter({
  currencyAmount,
  setCurrencyAmount,
  fromCurrency,
  setFromCurrency,
  toCurrency,
  setToCurrency,
  convertCurrency,
  conversionResult,
  loading,
}) {
  return (
    <div className="max-w-xl mx-auto text-center space-y-6 bg-white p-8 rounded-3xl shadow-xl">
      <h2 className="text-4xl font-extrabold text-green-600 mb-6">💱 Currency Converter</h2>
      <input
        type="number"
        min="0"
        value={currencyAmount}
        onChange={(e) => setCurrencyAmount(e.target.value)}
        className="p-4 w-full rounded-2xl border border-gray-300 text-center focus:outline-none focus:border-green-500"
        placeholder="Enter amount"
        aria-label="Enter amount"
      />
      <div className="grid grid-cols-2 gap-4">
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="p-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-500"
          aria-label="From currency"
        >
          <option value="INR">INR ₹</option>
          <option value="USD">USD $</option>
          <option value="EUR">EUR €</option>
        </select>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="p-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-500"
          aria-label="To currency"
        >
          <option value="USD">USD $</option>
          <option value="EUR">EUR €</option>
          <option value="INR">INR ₹</option>
        </select>
      </div>
      <button
        onClick={convertCurrency}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl font-bold hover:scale-105 transition disabled:opacity-60"
        aria-label="Convert currency"
      >
        Convert
      </button>
      {conversionResult && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg text-green-800 font-semibold">
          {currencyAmount} {fromCurrency} = {conversionResult.result} {toCurrency}
        </div>
      )}
    </div>
  );
}

// Quote Display Component
function QuoteCard({ quote, fetchRandomQuote, loading }) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl text-center space-y-8">
      <blockquote className="text-3xl md:text-4xl italic text-blue-800 leading-relaxed min-h-[150px]">
        “{quote?.quote || "Loading..."}”
      </blockquote>
      <p className="text-xl text-blue-600 font-bold">— {quote?.author || ""}</p>
      <button
        onClick={fetchRandomQuote}
        disabled={loading}
        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-2xl hover:scale-105 transition font-semibold inline-flex items-center gap-2 disabled:opacity-60"
        aria-label="New Quote"
      >
        <RefreshCw className="w-5 h-5" />
        New Quote
      </button>
    </div>
  );
}

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [currencyAmount, setCurrencyAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [conversionResult, setConversionResult] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    if (activeTab === "weather" && !weatherData) fetchWeatherByCity("Hyderabad");
    if (activeTab === "quote" && !quote) fetchRandomQuote();
  }, [activeTab]);

  const fetchWeatherByCity = async (city) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/weather?city=${city}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setWeatherData(data);
      setError("");
    } catch (err) {
      setError("Unable to fetch weather data");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/quote/random`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setQuote(data);
      setError("");
    } catch {
      setError("Unable to fetch quote");
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/currency/convert?amount=${currencyAmount}&from=${fromCurrency}&to=${toCurrency}`
      );
      if (!res.ok) throw new Error("Failed to convert");
      const data = await res.json();
      setConversionResult(data);
      setError("");
    } catch {
      setError("Conversion failed");
      setConversionResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchCity.trim()) {
      fetchWeatherByCity(searchCity);
      setActiveTab("weather");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-500 to-cyan-600 flex flex-col items-center justify-start text-gray-900 py-10 px-4 sm:px-8">
      {/* Header */}
      <header className="text-center mb-10 select-none">
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-extrabold tracking-wide text-white drop-shadow-lg"
        >
          ByteXL
        </motion.h1>
        <p className="text-white/90 text-lg mt-2 font-semibold">
          Your Smart Information Dashboard 🌍
        </p>
      </header>

      {/* Search Bar */}
      <SearchBar
        searchCity={searchCity}
        setSearchCity={setSearchCity}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Tabs Selection */}
      {!activeTab && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-12 min-h-[60vh]">
          {[
            { id: "weather", icon: Cloud, color: "from-blue-500 to-cyan-400" },
            { id: "currency", icon: DollarSign, color: "from-green-500 to-teal-400" },
            { id: "quote", icon: Quote, color: "from-purple-500 to-pink-500" },
          ].map(({ id, icon: Icon, color }) => (
            <motion.button
              key={id}
              onClick={() => setActiveTab(id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-3xl bg-gradient-to-br ${color} w-80 h-80 flex flex-col justify-center items-center shadow-xl hover:shadow-2xl transition-all select-none`}
              aria-label={`Open ${id} tab`}
            >
              <Icon className="w-36 h-36 text-white mb-6" />
              <h3 className="font-bold text-4xl text-white capitalize">{id}</h3>
            </motion.button>
          ))}
        </div>
      )}

      {/* Active Tab Content */}
      {activeTab && (
        <motion.section
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-10 relative text-gray-900"
        >
          {/* Back Button */}
          <button
            aria-label="Back"
            onClick={() => setActiveTab("")}
            className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Loading Indicator */}
          {loading && (
            <div className="py-24 flex flex-col items-center">
              <div className="animate-spin h-14 w-14 border-4 border-gray-300 border-t-blue-500 rounded-full mb-6"></div>
              <p className="text-lg font-semibold text-gray-600">Loading...</p>
            </div>
          )}

          {/* Error Display */}
          {!loading && error && (
            <div className="text-center text-red-600 font-semibold py-8">
              {error}
            </div>
          )}

          {/* Weather Tab */}
          {!loading && activeTab === "weather" && weatherData && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                <WeatherIcon iconCode={weatherData.weather?.[0]?.icon} />
                <div>
                  <h2 className="text-5xl font-extrabold text-blue-700">{weatherData.name}</h2>
                  <p className="text-blue-800 text-lg font-semibold">{weatherData.sys?.country}</p>
                  <p className="text-blue-600 text-md mt-1 font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="text-7xl font-extrabold text-blue-700">
                {Math.round(weatherData.main?.temp)}°C
              </div>

              <p className="capitalize text-blue-600 text-xl font-semibold">
                {weatherData.weather?.[0]?.description}
              </p>

              <WeatherStats weatherData={weatherData} />
            </div>
          )}

          {/* Currency Converter Tab */}
          {!loading && activeTab === "currency" && (
            <CurrencyConverter
              currencyAmount={currencyAmount}
              setCurrencyAmount={setCurrencyAmount}
              fromCurrency={fromCurrency}
              setFromCurrency={setFromCurrency}
              toCurrency={toCurrency}
              setToCurrency={setToCurrency}
              convertCurrency={convertCurrency}
              conversionResult={conversionResult}
              loading={loading}
            />
          )}

          {/* Quote Tab */}
          {!loading && activeTab === "quote" && quote && (
            <QuoteCard quote={quote} fetchRandomQuote={fetchRandomQuote} loading={loading} />
          )}
        </motion.section>
      )}

      {/* Footer */}
      <footer className="mt-16 text-white text-sm select-none">
        Built with ❤️ by <span className="font-semibold">MR</span>
      </footer>
    </div>
  );
}
