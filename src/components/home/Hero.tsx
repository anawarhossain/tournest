"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SLIDES = [
  {
    title: "Cox's Bazar",
    subtitle: "Walk the world's longest natural sea beach",
    gradient: "from-teal-700 via-teal-600 to-cyan-600",
  },
  {
    title: "Sundarban",
    subtitle: "Cruise through the largest mangrove forest on Earth",
    gradient: "from-emerald-800 via-emerald-700 to-teal-600",
  },
  {
    title: "Sylhet",
    subtitle: "Wander through rolling tea gardens and misty hills",
    gradient: "from-green-700 via-teal-700 to-emerald-600",
  },
  {
    title: "Bandarban",
    subtitle: "Chase clouds across the highest peaks in Bangladesh",
    gradient: "from-sky-800 via-teal-700 to-emerald-700",
  },
];

const SLIDE_INTERVAL_MS = 5000;

export default function Hero() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = searchInput.trim();
    router.push(query ? `/packages?search=${encodeURIComponent(query)}` : "/packages");
  }

  const slide = SLIDES[activeIndex];

  return (
    <section className={`relative h-[65vh] min-h-120 bg-linear-to-br ${slide.gradient} transition-colors duration-700`}>
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative h-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <span className="text-sm font-medium text-white/80 tracking-wide uppercase mb-2">
          Discover Bangladesh
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white">{slide.title}</h1>
        <p className="mt-3 text-white/90 text-base sm:text-lg max-w-xl">{slide.subtitle}</p>

        <form onSubmit={handleSearch} className="mt-8 w-full max-w-xl">
          <div className="relative">
            <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search destinations, e.g. Cox's Bazar…"
              className="w-full rounded-full bg-white pl-11 pr-32 py-3.5 text-sm text-neutral-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-teal px-5 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Search
            </button>
          </div>
        </form>

        <Link
          href="/packages"
          className="mt-5 text-sm font-medium text-white underline underline-offset-4 hover:text-white/80"
        >
          or Explore All Packages →
        </Link>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((s, index) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to ${s.title} slide`}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
