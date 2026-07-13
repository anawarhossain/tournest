import type { Metadata } from "next";
import PackagesExploreClient from "./PackagesExploreClient";

export const metadata: Metadata = {
  title: "Explore Tour Packages — TourNest",
  description:
    "Search and filter tour packages across Bangladesh by category, price, and location — Cox's Bazar, Sundarban, Sylhet, and more.",
  openGraph: {
    title: "Explore Tour Packages — TourNest",
    description:
      "Search and filter tour packages across Bangladesh by category, price, and location.",
  },
};

export default function ExplorePackagesPage() {
  return <PackagesExploreClient />;
}
