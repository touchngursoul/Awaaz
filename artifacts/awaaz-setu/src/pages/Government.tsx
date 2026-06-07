import { useLocation } from "wouter";
import { Shield, TrendingUp, Users, FileText, Lock, BarChart2, GitBranch, ArrowRight, CheckCircle } from "lucide-react";

const valueCards = [
  {
    icon: TrendingUp,
    title: "Early Warning Signals",
    desc: "Identify distress, bullying, cyber blackmail, and harassment patterns before they escalate into public crisis, protests, or institutional breakdown.",
  },
  {
    icon: Shield,
    title: "Crisis Prevention",
    desc: "Help users seek support before self-harm, viral exposure, or institutional breakdown. Early intervention reduces risk for individuals and institutions alike.",
  },
  {
    icon: Users,
    title: "Public Trust",
    desc: "Citizens feel the system is listening even when they fear formal complaints. Anonymous reporting lowers the barrier to seeking help.",
  },
  {
    icon: Lock,
    title: "Women and Youth Safety Image",
    desc: "District can present a safety-first model for students, women, and vulnerable groups — improving its reputation as a responsive, modern administration.",
  },
  {
    icon: GitBranch,
    title: "Administrative Efficiency",
    desc: "Cases can be categorized and routed to the right support instead of random escalation, saving administrative time and resources.",
  },
  {
    icon: BarChart2,
    title: "Anonymous Safety Trends",
    desc: "District can view aggregated data without exposing victims — understanding safety patterns without compromising anyone's identity.",
  },
  {
    icon: FileText,
    title: "Better Routing",
    desc: "Users guided toward Tele-MANAS, Cyber Crime Portal, NCW, SHe-Box, NGO, legal aid, or district committee — the right system for each type of case.",
  },
  {
    icon: CheckCircle,
    title: "Compliance Ready",
    desc: "Designed with POCSO, UGC anti-ragging, POSH, and NCPCR guidelines in mind. Every report is timestamped and audit-ready.",
  },
];

const partnershipRows = [
  { work: "Website / Portal Design", body: "Awaaz Team" },
  { work: "Anonymous Report Intake", body: "Awaaz Setu" },
  { work: "Token System", body: "Awaaz Setu" },
  { work: "Basic Triage", body: "Awaaz Setu + Trained Moderator" },
  { work: "Serious Evidence Custody", body: "Authorized Partner / Government-Approved Storage" },
  { work: "Child Abuse Escalation", body: "Legal Authority / Child Protection System" },
  { work: "Police Action", body: "Police / Authorized Body" },
  { work: "Mental Health Support", body: "Verified Counselor / NGO" },
  { work: "Data Governance Oversight", body: "District Nominated Officer / Authorized Committee" },
];

const phases = [
  {
    phase: "Phase 1",
    title: "Controlled Demo",
    color: "bg-blue-600",
    light: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    items: [
      "Website prototype walkthrough",
      "Policy validation with legal advisors",
      "Legal / counselor / NGO review",
      "No public launch at this stage",
    ],
  },
  {
    phase: "Phase 2",
    title: "Closed Pilot",
    color: "bg-primary",
    light: "bg-indigo-50 border-indigo-200",
    text: "text-indigo-800",
    items: [
      "1–2 colleges or youth groups",
      "Limited, invited users only",
      "No public campaign or media",
      "Feedback on trust, safety language, form clarity, severity tagging",
    ],
  },
  {
    phase: "Phase 3",
    title: "Government-Guided District Pilot",
    color: "bg-green-600",
    light: "bg-green-50 border-green-200",
    text: "text-green-800",
    items: [
      "MLA / district administration guidance",
      "NGO / counselor / legal support structure",
      "Monthly anonymous trend report to administration",
      "No public naming of individuals",
      "Serious cases routed to authorized systems",
    ],
  },
];

const metrics = [
  "Reports received",
  "Support requests",
  "High-risk cases identified",
  "Cases routed to support",
  "Fake reports flagged",
  "Anonymous district trends",
  "User trust feedback",
];

export function Government() {
  const [, setLocation] = useLocation();

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(201,78%,65%)" }}>Government Value</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">How Awaaz Setu helps district administration</h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto mb-6">
            For government, the value is not monetary profit. It is public trust, crisis prevention, administrative efficiency, safer youth and women systems, and anonymous safety insights.
          </p>
          <div className="inline-block bg-white/10 border border-white/20 rounded-xl px-6 py-3">
            <p className="text-white/80 text-sm italic">"Awaaz Setu is not a complaint replacement system. It is a preventive governance tool."</p>
          </div>
        </div>
      </section>

      {/* Value Cards */}
      <section className="py-20 bg-background px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">District Value Proposition</p>
            <h2 className="text-3xl font-bold text-secondary">8 ways Awaaz Setu helps district administration</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valueCards.map((card) => (
              <div key={card.title} className="bg-card border border-card-border rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-secondary text-sm mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Model */}
      <section className="py-20 bg-muted/30 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Partnership Model</p>
            <h2 className="text-3xl font-bold text-secondary mb-4">Public Safety Partnership — Who does what</h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Awaaz Setu should not become a private evidence locker. Serious evidence custody and emergency escalation must be handled through authorized partners or government-approved systems.
            </p>
          </div>
          <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 bg-secondary text-white text-xs font-bold uppercase tracking-wider px-6 py-3">
              <div>Work / Responsibility</div>
              <div>Responsible Body</div>
            </div>
            {partnershipRows.map((row, i) => (
              <div key={row.work} className={`grid grid-cols-2 px-6 py-3.5 text-sm gap-4 ${i % 2 === 0 ? "bg-background" : "bg-muted/30"}`}>
                <div className="font-medium text-secondary">{row.work}</div>
                <div className="text-muted-foreground">{row.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* District Pilot Plan */}
      <section className="py-20 bg-background px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">District Pilot Plan</p>
            <h2 className="text-3xl font-bold text-secondary mb-4">3-Phase Government Pilot</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">A structured, cautious, responsible rollout designed to build trust before scale.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {phases.map((p) => (
              <div key={p.phase} className={`border rounded-2xl p-6 ${p.light}`}>
                <div className={`inline-flex items-center gap-2 ${p.color} text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4`}>
                  {p.phase}
                </div>
                <h3 className={`font-bold text-base mb-4 ${p.text}`}>{p.title}</h3>
                <ul className="space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Pilot Success Metrics */}
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-secondary text-base mb-4">Pilot Success Metrics</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {metrics.map((m) => (
                <div key={m} className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Interested in a pilot partnership?</h2>
          <p className="text-white/60 text-sm mb-8">
            Awaaz Setu is open to district administration, NGO partners, and institutional stakeholders for controlled pilot discussions.
          </p>
          <button
            onClick={() => setLocation("/report")}
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
          >
            View Demo
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
