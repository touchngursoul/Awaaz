import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/report", label: "Report Safely" },
  { href: "/track", label: "Track Report" },
  { href: "/awareness", label: "Awareness" },
];

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-sm shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Shield className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-bold text-secondary text-base tracking-tight">Awaaz Setu</span>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5 hidden sm:block">Safe first step. Trusted support.</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className={`ml-2 px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                location === "/admin"
                  ? "bg-secondary text-white border-secondary"
                  : "border-secondary/30 text-secondary hover:bg-secondary hover:text-white"
              }`}
            >
              Admin
            </Link>
          </nav>

          <button
            data-testid="button-mobile-menu"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border pb-4 pt-2">
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
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block mx-1 my-0.5 px-4 py-2.5 text-sm font-medium text-secondary border border-secondary/30 rounded-md hover:bg-secondary hover:text-white transition-colors"
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
