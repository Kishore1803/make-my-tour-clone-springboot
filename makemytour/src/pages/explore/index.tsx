"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Sparkles,
  Waves,
  Mountain,
  Building2,
  Compass,
  Heart,
  ArrowRight,
  Plane,
  SlidersHorizontal,
  Star,
} from "lucide-react";

const destinations = [
  {
    name: "Goa",
    country: "India",
    category: "Beach",
    price: 4999,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85",
    description: "Golden beaches, sunsets and coastal adventures.",
    tag: "Trending",
  },
  {
    name: "Ooty",
    country: "Tamil Nadu, India",
    category: "Nature",
    price: 3499,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=85",
    description: "Green hills, tea gardens and peaceful escapes.",
    tag: "Nature escape",
  },
  {
    name: "Manali",
    country: "Himachal Pradesh, India",
    category: "Adventure",
    price: 6999,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=85",
    description: "Mountain views, snow and unforgettable trails.",
    tag: "Popular",
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    category: "City",
    price: 24999,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85",
    description: "Iconic skylines, shopping and desert experiences.",
    tag: "International",
  },
  {
    name: "Munnar",
    country: "Kerala, India",
    category: "Nature",
    price: 3999,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=900&q=85",
    description: "Misty mountains and endless tea plantations.",
    tag: "Hidden gem",
  },
  {
    name: "Singapore",
    country: "Singapore",
    category: "City",
    price: 19999,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=85",
    description: "Futuristic attractions, gardens and city lights.",
    tag: "Top rated",
  },
];

const categories = [
  { name: "All", icon: Compass },
  { name: "Beach", icon: Waves },
  { name: "Nature", icon: Mountain },
  { name: "Adventure", icon: Compass },
  { name: "City", icon: Building2 },
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxBudget, setMaxBudget] = useState("50000");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const matchesSearch =
        destination.name.toLowerCase().includes(search.toLowerCase()) ||
        destination.country.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || destination.category === category;

      const matchesBudget = destination.price <= Number(maxBudget);

      return matchesSearch && matchesCategory && matchesBudget;
    });
  }, [search, category, maxBudget]);

  const toggleFavorite = (name: string) => {
    setFavorites((previous) =>
      previous.includes(name)
        ? previous.filter((item) => item !== name)
        : [...previous, name],
    );
  };

  const exploreDestination = (name: string) => {
    // Change this route to match your destination details page.
    window.location.href = `/explore/${encodeURIComponent(name.toLowerCase())}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=90')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-blue-950/30" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-cyan-200 backdrop-blur">
            <Sparkles size={16} />
            Discover your next adventure
          </div>

          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-6xl">
            The world is waiting.
            <span className="block text-cyan-300">Go explore it.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Discover amazing destinations, hidden gems and unforgettable
            experiences for every kind of traveller.
          </p>

          <div className="mt-9 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-2xl sm:flex-row">
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search className="shrink-0 text-slate-400" size={21} />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                aria-label="Search destinations"
              />
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("destinations")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore <ArrowRight size={18} />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <MapPin size={15} /> India & worldwide
            </span>
            <span className="text-slate-500">•</span>
            <span>Beaches, mountains and city escapes</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Find your vibe
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Explore by interest
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setCategory(name)}
              className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                category === name
                  ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              <Icon size={17} />
              {name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured banner */}
      <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-blue-900 to-cyan-800 p-7 sm:p-10 lg:p-12">
          <div className="relative z-10 max-w-xl">
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-cyan-200">
              YOUR NEXT GETAWAY
            </span>
            <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
              New places. New stories.
            </h2>
            <p className="mt-3 max-w-md leading-7 text-blue-100">
              From peaceful hill stations to vibrant cities, find a trip that
              feels like you.
            </p>
            <button
              onClick={() => {
                setCategory("All");
                setMaxBudget("50000");
                document
                  .getElementById("destinations")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-900 transition hover:bg-cyan-100"
            >
              Find your destination <ArrowRight size={18} />
            </button>
          </div>
          <Plane
            className="absolute -right-3 -top-2 h-40 w-40 rotate-12 text-white/10 sm:right-8 sm:top-4 sm:h-64 sm:w-64"
            strokeWidth={1}
          />
        </div>
      </section>

      {/* Destinations */}
      <section
        id="destinations"
        className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Handpicked for you
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Discover destinations
            </h2>
            <p className="mt-2 text-slate-500">
              Find the right place for your next escape.
            </p>
          </div>

          <label className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm sm:self-auto">
            <SlidersHorizontal size={17} className="text-slate-500" />
            <span className="font-medium">Budget</span>
            <select
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="max-w-32 bg-transparent font-semibold text-blue-700 outline-none"
              aria-label="Maximum budget"
            >
              <option value="50000">Any budget</option>
              <option value="5000">Under ₹5,000</option>
              <option value="10000">Under ₹10,000</option>
              <option value="25000">Under ₹25,000</option>
            </select>
          </label>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          {filteredDestinations.length} destinations found
        </p>

        {filteredDestinations.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDestinations.map((destination) => (
              <article
                key={destination.name}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={`${destination.name} travel destination`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow">
                    {destination.tag}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(destination.name)}
                    aria-label={`${
                      favorites.includes(destination.name) ? "Remove" : "Add"
                    } ${destination.name} ${
                      favorites.includes(destination.name) ? "from" : "to"
                    } favorites`}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow transition hover:scale-110"
                  >
                    <Heart
                      size={19}
                      className={
                        favorites.includes(destination.name)
                          ? "fill-rose-500 text-rose-500"
                          : "text-slate-700"
                      }
                    />
                  </button>

                  <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-sm font-bold text-slate-900 shadow">
                    <Star size={15} className="fill-amber-400 text-amber-400" />
                    {destination.rating}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <MapPin size={14} />
                        {destination.country}
                      </p>
                    </div>
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">
                      {destination.category}
                    </span>
                  </div>

                  <p className="mt-4 min-h-12 text-sm leading-6 text-slate-500">
                    {destination.description}
                  </p>

                  <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Starting from</p>
                      <p className="mt-1 text-xl font-extrabold text-slate-900">
                        ₹{destination.price.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-slate-400">
                        per person · estimated
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => exploreDestination(destination.name)}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Explore <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <Search className="mx-auto text-slate-400" size={35} />
            <h3 className="mt-4 text-lg font-bold">No destinations found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another search or change your filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setMaxBudget("50000");
              }}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Recommendation CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="flex flex-col justify-between gap-6 rounded-3xl border border-blue-100 bg-blue-50 p-7 sm:flex-row sm:items-center sm:p-10">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-white p-3 text-blue-600 shadow-sm">
              <Sparkles size={25} />
            </div>
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Looking for something special?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Discover travel ideas tailored to your interests and budget.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCategory("All");
              setSearch("");
              setMaxBudget("50000");
              document
                .getElementById("destinations")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore all <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
