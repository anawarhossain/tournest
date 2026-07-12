"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@heroui/react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { useSession, signOut } from "@/lib/auth-client";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Explore Packages" },
  { href: "/about", label: "About" },
];

const PRIVATE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Explore Packages" },
  { href: "/items/add", label: "Add Package" },
  { href: "/items/manage", label: "Manage My Packages" },
  { href: "/bookings", label: "My Bookings" },
];

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = session ? PRIVATE_LINKS : PUBLIC_LINKS;

  async function handleLogout() {
    await signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-neutral-200">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-teal">
          TourNest
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`text-sm font-medium transition-colors ${
                    active ? "text-teal" : "text-neutral-700 hover:text-teal"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {isPending ? null : session ? (
            <>
              <Link
                href="/profile"
                className="text-sm text-neutral-700 hover:text-teal transition-colors"
              >
                {session.user.name}
              </Link>
              <Button variant="outline" size="sm" onPress={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-neutral-700 hover:text-teal px-3 py-2"
              >
                Login
              </Link>
              <Button
                variant="primary"
                size="sm"
                className="bg-teal hover:opacity-90"
                onPress={() => router.push("/register")}
              >
                Register
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden text-neutral-700"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <FaXmark size={22} /> : <FaBars size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-neutral-200 px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2 text-sm font-medium text-neutral-700 hover:text-teal"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {session ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 text-sm font-medium text-neutral-700 hover:text-teal"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="block py-2 text-sm font-medium text-neutral-700 hover:text-teal"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block py-2 text-sm font-semibold text-teal"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
