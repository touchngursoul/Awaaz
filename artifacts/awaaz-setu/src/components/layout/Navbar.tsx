import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/report", label: "Report Safely" },
  { href: "/track", label: "Track Report" },
  { href: "/government", label: "Government Value" },
  { href: "/awareness", label: "Awareness Data" },
  { href: "/systems", label: "Systems" },
  { href: "/policies", label: "Policies" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-sm shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-bold text-secondary text-sm tracking-tight">Awaaz Setu</span>
              <p className="text-[9px] text-muted-foreground leading-none mt-0.5 hidden sm:block">Safe first step. Trusted support.</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-0.5 mx-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden xl:flex items-center gap-2 flex-shrink-0">
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                location === "/admin"
                  ? "bg-secondary text-white border-secondary"
                  : "border-secondary/30 text-secondary hover:bg-secondary hover:text-white"
              }`}
            >
              Admin Demo
            </Link>
            <a
              href="tel:14416"
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
            >
              <Phone className="w-3 h-3" />
              14416
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            data-testid="button-mobile-menu"
            onClick={() => setOpen(!open)}
            className="xl:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="xl:hidden border-t border-border pb-4 pt-2 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-md mx-1 my-0.5 transition-colors ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mx-1 mt-2 pt-2 border-t border-border space-y-1">
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-secondary border border-secondary/30 rounded-md hover:bg-secondary hover:text-white transition-colors"
              >
                Admin Demo
              </Link>
              <a
                href="tel:14416"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-md"
              >
                <Phone className="w-4 h-4" />
                I Need Help Now — 14416
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
