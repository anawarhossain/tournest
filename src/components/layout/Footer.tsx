import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
} from "react-icons/fa6";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Explore Packages" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook", Icon: FaFacebook },
  { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
  { href: "https://youtube.com", label: "YouTube", Icon: FaYoutube },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* About */}
        <div className="md:col-span-1">
          <Link href="/" className="text-xl font-bold text-teal">
            TourNest
          </Link>
          <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
            আপনার পরবর্তী ভ্রমণের গন্তব্য খুঁজুন ও বুক করুন — Cox&apos;s Bazar
            থেকে Sundarban, Sylhet পর্যন্ত বাংলাদেশের সেরা ট্যুর প্যাকেজগুলো এক
            জায়গায়।
          </p>
          <div className="flex gap-3 mt-4">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 hover:bg-teal hover:text-white transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-neutral-900 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-neutral-600 hover:text-teal transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-neutral-900 mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm text-neutral-600">
            <li className="flex items-start gap-2">
              <FaLocationDot className="mt-0.5 shrink-0 text-teal" size={14} />
              <span>Gulshan Avenue, Dhaka 1212, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="shrink-0 text-teal" size={14} />
              <a
                href="tel:+8801700000000"
                className="hover:text-teal transition-colors"
              >
                +880 1700-000000
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="shrink-0 text-teal" size={14} />
              <a
                href="mailto:support@tournest.com"
                className="hover:text-teal transition-colors"
              >
                support@tournest.com
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter placeholder note (functional widget arrives on the Home page, Phase 10) */}
        <div>
          <h3 className="font-semibold text-neutral-900 mb-4">Stay Updated</h3>
          <p className="text-sm text-neutral-600">
            নতুন ট্যুর প্যাকেজ ও অফার সম্পর্কে জানতে Home পেজের Newsletter
            সেকশনে সাবস্ক্রাইব করুন।
          </p>
        </div>
      </div>

      <div className="border-t border-neutral-200 py-4">
        <p className="text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} TourNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
