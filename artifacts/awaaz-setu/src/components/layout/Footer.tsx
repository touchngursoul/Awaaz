import { Link } from "wouter";
import { Shield } from "lucide-react";

const policyLinks = [
  { href: "/policies", label: "Privacy Policy" },
  { href: "/policies", label: "Terms of Use" },
  { href: "/policies", label: "Evidence Handling Policy" },
  { href: "/policies", label: "False Report Policy" },
  { href: "/policies", label: "Child Safety Policy" },
  { href: "/policies", label: "Crisis Support Disclaimer" },
];

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-white/10">
      {/* Disclaimer Banner */}
      <div className="bg-amber-900/30 border-b border-amber-700/30 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-amber-200/80 text-xs text-center leading-relaxed">
            <strong className="text-amber-200">Disclaimer:</strong> Awaaz Setu is a support, documentation, early-intervention, and referral platform. It does not replace police, court, hospital, emergency services, helplines, government portals, or official complaint authorities. In immediate danger, contact emergency services or a trusted person near you.
          </p>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">Awaaz Setu</span>
            </div>
            <p className="text-white/40 text-xs max-w-xs leading-relaxed">Safe first step. Trusted support. A demo prototype for government, NGO, and funding stakeholder preview.</p>
          </div>

          {/* Policy Links */}
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Policies</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
              {policyLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white/40 hover:text-white/70 text-xs transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Helplines */}
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Crisis Helplines</p>
            <div className="space-y-1.5">
              {[
                { label: "Emergency", number: "112" },
                { label: "Tele-MANAS", number: "14416" },
                { label: "Cyber Crime", number: "1930" },
                { label: "Women Helpline", number: "181" },
                { label: "Child Help", number: "1098" },
              ].map((h) => (
                <div key={h.label} className="flex items-center gap-2">
                  <span className="text-white/40 text-xs">{h.label}:</span>
                  <span className="text-white/70 text-xs font-bold font-mono">{h.number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">© 2025 Awaaz Setu. Demo prototype — not in production use.</p>
          <p className="text-white/25 text-xs">This platform is a demo for institutional and government preview only.</p>
        </div>
      </div>
    </footer>
  );
}
