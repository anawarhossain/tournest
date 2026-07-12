import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "TourNest — Discover & Book Tour Packages in Bangladesh",
  description:
    "Browse, publish, and book tour & travel packages across Bangladesh — Cox's Bazar, Sundarban, Sylhet, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" data-theme="light">
      {/* No HeroUIProvider needed — HeroUI v3 is provider-less by design */}
      <body className="min-h-screen bg-background text-foreground antialiased">
        <QueryProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
