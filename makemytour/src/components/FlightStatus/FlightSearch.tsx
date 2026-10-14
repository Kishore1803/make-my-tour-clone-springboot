"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import { getFlightStatus, searchFlights } from "@/api/FlightStatusapi";

interface FlightSearchProps {
  onResults: (flights: any[]) => void;
  onLoading?: (loading: boolean) => void;
}

export default function FlightSearch({
  onResults,
  onLoading,
}: FlightSearchProps) {
  const [searchType, setSearchType] = useState<"number" | "route">("number");
  const [flightNumber, setFlightNumber] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedFlightNumber = flightNumber.trim().replace(/\s+/g, "");
    const from = fromCity.trim();
    const to = toCity.trim();

    if (searchType === "number" && !normalizedFlightNumber) {
      setError("Please enter a flight number.");
      return;
    }

    if (searchType === "route" && (!from || !to)) {
      setError("Please enter both departure and destination cities.");
      return;
    }

    if (searchType === "route" && from.toLowerCase() === to.toLowerCase()) {
      setError("Departure and destination cities must be different.");
      return;
    }

    setIsSearching(true);
    onLoading?.(true);

    try {
      if (searchType === "number") {
        const response = await getFlightStatus(normalizedFlightNumber);
        onResults([response.data]);
      } else {
        const response = await searchFlights(from, to);
        const results = Array.isArray(response.data) ? response.data : [];

        onResults(results);

        if (results.length === 0) {
          setError("No flights found for this route.");
        }
      }
    } catch (err: unknown) {
      onResults([]);

      if (axios.isAxiosError(err)) {
        console.error("Flight API error:", {
          url: err.config?.url,
          status: err.response?.status,
          data: err.response?.data,
        });

        const status = err.response?.status;
        const responseData = err.response?.data;

        if (!err.response) {
          setError(
            "Cannot connect to the backend. Make sure Spring Boot is running on port 8081.",
          );
        } else if (status === 404) {
          setError(
            searchType === "number"
              ? `Flight ${normalizedFlightNumber} was not found.`
              : "No flights found for this route.",
          );
        } else if (status === 500) {
          setError(
            "The backend encountered an error while searching. Check the Spring Boot console for the root cause.",
          );
        } else {
          const serverMessage =
            typeof responseData === "string"
              ? responseData
              : responseData?.message;

          setError(
            serverMessage ||
              `Flight search failed (HTTP ${status}). Please try again.`,
          );
        }
      } else {
        console.error("Unexpected flight search error:", err);
        setError("An unexpected error occurred while searching.");
      }
    } finally {
      setIsSearching(false);
      onLoading?.(false);
    }
  };

  const handleReset = () => {
    setFlightNumber("");
    setFromCity("");
    setToCity("");
    setError("");
    onResults([]);
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Track Your Flight</h2>
        <p className="mt-1 text-sm text-gray-500">
          Search for a flight to check its latest status.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setSearchType("number");
            setError("");
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            searchType === "number"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Flight Number
        </button>

        <button
          type="button"
          onClick={() => {
            setSearchType("route");
            setError("");
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            searchType === "route"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Route Search
        </button>
      </div>

      <form onSubmit={handleSearch}>
        {searchType === "number" ? (
          <div>
            <label
              htmlFor="flightNumber"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Flight Number
            </label>
            <input
              id="flightNumber"
              type="text"
              value={flightNumber}
              onChange={(event) => setFlightNumber(event.target.value)}
              placeholder="e.g. 6E542"
              autoComplete="off"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="fromCity"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Departure City
              </label>
              <input
                id="fromCity"
                type="text"
                value={fromCity}
                onChange={(event) => setFromCity(event.target.value)}
                placeholder="e.g. Chennai"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="toCity"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Destination City
              </label>
              <input
                id="toCity"
                type="text"
                value={toCity}
                onChange={(event) => setToCity(event.target.value)}
                placeholder="e.g. Delhi"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSearching}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearching ? "Searching..." : "Search Flights"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSearching}
            className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            Clear
          </button>
        </div>
      </form>
    </section>
  );
}
