import Link from "next/link";
import { FaUmbrellaBeach, FaMountain, FaPersonHiking, FaLandmark } from "react-icons/fa6";
import type { PackageCategory } from "@/types";

const CATEGORIES: { name: PackageCategory; icon: typeof FaUmbrellaBeach; description: string }[] = [
  { name: "Beach", icon: FaUmbrellaBeach, description: "Sun, sand & sea" },
  { name: "Hill", icon: FaMountain, description: "Misty peaks & valleys" },
  { name: "Adventure", icon: FaPersonHiking, description: "Trek, cruise & explore" },
  { name: "Cultural", icon: FaLandmark, description: "Heritage & history" },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">Browse by Category</h2>
        <p className="text-neutral-500 text-sm mt-1">Find the kind of trip that fits your mood.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CATEGORIES.map(({ name, icon: Icon, description }) => (
          <Link
            key={name}
            href={`/packages?category=${name}`}
            className="group rounded-2xl border border-neutral-200 p-6 text-center hover:border-teal hover:shadow-md transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal mx-auto group-hover:bg-teal group-hover:text-white transition-colors">
              <Icon size={20} />
            </div>
            <h3 className="mt-3 font-semibold text-neutral-900">{name}</h3>
            <p className="text-xs text-neutral-500 mt-1">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
