import { useLocation } from "wouter";
import { Lock, FileText, Search, Tag, Hash, Share2, Eye, ArrowRight, AlertTriangle } from "lucide-react";

const steps = [
  {
    icon: Lock,
    num: "01",
    title: "User shares concern anonymously",
    desc: "No login, no mandatory identity, no public exposure. You choose how much to share. Even a brief description is enough to begin.",
    note: "Your IP address is never logged. No cookies. No tracking.",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600 bg-blue-100",
  },
  {
    icon: FileText,
    num: "02",
    title: "User adds incident details",
    desc: "Date, time, location, category, a personal statement, and optional evidence. Evidence is helpful but never mandatory.",
    note: "You only share what you feel safe sharing.",
    color: "bg-indigo-50 border-indigo-200",
    iconColor: "text-indigo-600 bg-indigo-100",
  },
  {
    icon: Search,
    num: "03",
    title: "System checks risk signals",
    desc: "Keyword-based detection scans for crisis or self-harm phrases. If detected, an immediate Crisis Support overlay appears with verified helplines.",
    note: "If you are in immediate danger, please call 112 or 14416.",
    color: "bg-red-50 border-red-200",
    iconColor: "text-red-600 bg-red-100",
  },
  {
    icon: Tag,
    num: "04",
    title: "Severity level assigned",
    desc: "Your report is categorised on a 4-point scale — L1 (Low) to L4 (Critical) — based on category, seriousness, and risk signals.",
    note: "Awaaz Setu does not decide guilt. It only identifies urgency, risk, and support need.",
    color: "bg-yellow-50 border-yellow-200",
    iconColor: "text-yellow-700 bg-yellow-100",
  },
  {
    icon: Hash,
    num: "05",
    title: "Token generated",
    desc: "After submission, you receive a unique anonymous token (e.g. AWZ-4821-K). This is your only way to check the status of your report — no account needed.",
    note: "Save your token. Do not share it publicly.",
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-700 bg-green-100",
  },
  {
    icon: Share2,
    num: "06",
    title: "Support routing suggested",
    desc: "Based on severity and category, the system guides you toward the right support: mental health counselor, NGO, legal advisor, Cyber Crime Portal, women helpline, district committee, or emergency guidance.",
    note: "Awaaz Setu does not replace official systems. It helps you reach them.",
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-700 bg-purple-100",
  },
  {
    icon: Eye,
    num: "07",
    title: "User tracks report by token",
    desc: "At any time, enter your token on the Track Report page to see the current status, timeline, and actions taken — all without revealing your identity.",
    note: "No account. No password. Your identity stays anonymous throughout.",
    color: "bg-teal-50 border-teal-200",
    iconColor: "text-teal-700 bg-teal-100",
  },
];

const severityLevels = [
  { level: "L1", label: "Low Risk", color: "bg-green-500", textColor: "text-green-800", bg: "bg-green-50 border-green-200", examples: "Emotional sharing, normal stress, one-time bullying, guidance request" },
  { level: "L2", label: "Medium Risk", color: "bg-yellow-400", textColor: "text-yellow-800", bg: "bg-yellow-50 border-yellow-200", examples: "Repeated harassment, threats, cyber harassment, institutional pressure, feeling unsafe" },
  { level: "L3", label: "High Risk", color: "bg-orange-500", textColor: "text-orange-800", bg: "bg-orange-50 border-orange-200", examples: "Sexual harassment, serious blackmail, self-harm thoughts, severe mental distress, stalking, repeated threats" },
  { level: "L4", label: "Critical", color: "bg-red-600", textColor: "text-red-800", bg: "bg-red-50 border-red-200", examples: "Active self-harm plan, someone in immediate danger, child abuse, active physical danger, suicidal intent" },
];

export function HowItWorks() {
  const [, setLocation] = useLocation();

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(201,78%,65%)" }}>How It Works</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">From first step to support routing</h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto">
            A transparent look at every step of the Awaaz Setu process — designed for safety, anonymity, and responsible support.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-background px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.num} className={`border rounded-2xl p-6 sm:p-8 ${step.color}`}>
                <div className="flex gap-5 items-start">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${step.iconColor}`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black text-muted-foreground/50 font-mono">{step.num}</span>
                      <h3 className="font-bold text-secondary text-lg">{step.title}</h3>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed mb-3">{step.desc}</p>
                    <div className="inline-flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{step.note}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Severity Guide */}
      <section className="py-20 bg-muted/30 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Severity Triage</p>
            <h2 className="text-3xl font-bold text-secondary mb-4">How severity is assessed</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Severity is assigned by a trained moderator based on category, seriousness selected by the user, and keyword signals. Awaaz Setu does not decide guilt. It only identifies urgency and support need.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {severityLevels.map((s) => (
              <div key={s.level} className={`border rounded-xl p-5 ${s.bg}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}>
                    <span className="text-white text-xs font-black">{s.level}</span>
                  </div>
                  <h3 className={`font-bold text-sm ${s.textColor}`}>{s.label}</h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{s.examples}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> Awaaz Setu does not declare anyone guilty. Severity is assigned only to determine urgency and appropriate support routing — not to make legal or moral judgements.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to take the first step?</h2>
          <p className="text-white/70 text-sm mb-8">Anonymous, safe, and routed to the right support.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setLocation("/report")}
              className="flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors shadow-lg text-sm"
            >
              <Lock className="w-4 h-4" />
              Report Anonymously
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLocation("/track")}
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              Track Existing Report
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
