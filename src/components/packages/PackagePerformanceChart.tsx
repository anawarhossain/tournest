"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MyPackageRow } from "@/app/api/packages/mine/route";

interface PackagePerformanceChartProps {
  packages: MyPackageRow[];
}

function truncate(text: string, max = 14) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default function PackagePerformanceChart({ packages }: PackagePerformanceChartProps) {
  const data = packages.map((p) => ({
    name: truncate(p.title),
    fullName: p.title,
    bookings: p.bookingsCount,
  }));

  return (
    <div className="rounded-2xl border border-neutral-200 p-5">
      <h2 className="text-sm font-semibold text-neutral-900 mb-4">My Package Performance</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              formatter={(value) => [String(value), "Bookings"]}
              labelFormatter={(_label, payload) => payload?.[0]?.payload?.fullName ?? _label}
            />
            <Bar dataKey="bookings" fill="#0f766e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
