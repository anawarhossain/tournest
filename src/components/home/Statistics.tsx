"use client";

import { FaBox, FaUsers, FaLocationDot, FaStar } from "react-icons/fa6";
import { useHomeStats } from "@/hooks/useHomeStats";
import { useCountUp } from "@/hooks/useCountUp";

function StatItem({
  icon: Icon,
  value,
  suffix,
  label,
  ready,
}: {
  icon: typeof FaBox;
  value: number;
  suffix?: string;
  label: string;
  ready: boolean;
}) {
  const animated = useCountUp(value, 1200, ready);

  return (
    <div className="text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white mx-auto">
        <Icon size={20} />
      </div>
      <p className="mt-3 text-3xl font-bold text-white">
        {ready ? animated : 0}
        {suffix}
      </p>
      <p className="text-sm text-white/70 mt-1">{label}</p>
    </div>
  );
}

export default function Statistics() {
  const { data, isLoading } = useHomeStats();
  const ready = !isLoading && !!data;

  return (
    <section className="bg-teal py-16">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <StatItem icon={FaBox} value={data?.totalPackages ?? 0} label="Tour Packages" ready={ready} />
        <StatItem icon={FaUsers} value={data?.totalTravelers ?? 0} suffix="+" label="Happy Travelers" ready={ready} />
        <StatItem
          icon={FaLocationDot}
          value={data?.totalDestinations ?? 0}
          label="Destinations"
          ready={ready}
        />
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white mx-auto">
            <FaStar size={20} />
          </div>
          {/* A decimal average doesn't suit the integer count-up animation — shown directly instead. */}
          <p className="mt-3 text-3xl font-bold text-white">{ready ? (data?.avgRating ?? 0).toFixed(1) : "0.0"}</p>
          <p className="text-sm text-white/70 mt-1">Average Rating</p>
        </div>
      </div>
    </section>
  );
}
