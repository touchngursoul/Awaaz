import { useLocation } from "wouter";
import { Shield, Lock, ArrowRight, CheckCircle, ChevronDown, ChevronUp, Users, FileText, TrendingUp, Phone, XCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";

const trustChips = [
  "Anonymous first-step",
  "No public naming",
  "No guilt declaration",
  "Token-based follow-up",
  "Authorized referral",
  "Demo-only prototype",
];

const faqs = [
  {
    q: "Is Awaaz Setu anonymous?",
    a: "Yes. Users can submit without mandatory name, email, or phone. No login or registration is required.",
  },
  {
    q: "Does Awaaz Setu file an FIR?",
    a: "No. It is not a police portal. It can guide users toward official systems such as the Cyber Crime Portal or the nearest police station.",
  },
  {
    q: "Will my report be made public?",
    a: "No. Awaaz Setu does not publish reports. Reports are visible only to authorized, trained moderators — never publicly.",
  },
  {
    q: "Does Awaaz Setu decide who is guilty?",
    a: "No. It only identifies urgency, risk, and support need. Guilt can only be determined by a competent legal authority.",
  },
  {
    q: "Is evidence mandatory?",
    a: "No. Evidence is helpful but never mandatory. You can still submit a complete report without any evidence.",
  },
  {
    q: "Can Awaaz Setu help during an emergency?",
    a: "Awaaz Setu can show guidance and helplines, but it is NOT an emergency response service. If in immediate danger, call 112 or 14416 directly.",
  },
];

const whatItIs = [
  {
    num: "01",
    title: "Anonymous Intake Layer",
    desc: "Users can share their situation without mandatory login, registration, email, or phone number. Your identity is never collected.",
  },
  {
    num: "02",
    title: "Evidence-Aware Documentation",
    desc: "Users may upload screenshots, messages, photos, PDFs, audio, or documents in demo mode. Evidence is helpful but not mandatory.",
  },
  {
    num: "03",
    title: "Severity Triage",
    desc: "Reports are categorized into L1, L2, L3, or L4 based on urgency and risk. Awaaz Setu does not decide guilt — only urgency.",
  },
  {
    num: "04",
    title: "Token-Based Follow-Up",
    desc: "After submission, users receive a unique anonymous token such as AWZ-4821-K. Use it anytime to track your report status.",
  },
  {
    num: "05",
    title: "Support Routing",
    desc: "Depending on the case, the system guides users toward counselors, NGOs, legal advisors, Cyber Crime Portal, Tele-MANAS, NCW, SHe-Box, or district committee.",
  },
  {
    num: "06",
    title: "Government Insight",
    desc: "Anonymous aggregated trends help district administration understand safety concerns without exposing personal identities.",
  },
];

const isNotItems = [
  "Not an FIR platform",
  "Not a police replacement",
  "Not a court or legal body",
  "Not a public complaint wall",
  "Not a revenge or exposure tool",
  "Not an emergency response service",
  "Not a place to declare anyone guilty",
];

const isItems = [
  "Safe first-step system",
  "Anonymous intake layer",
  "Evidence-aware documentation tool",
  "Severity triage system",
  "Support routing bridge",
  "Preventive safety governance tool",
];

const partnerBenefits = [
  {
    icon: Shield,
    title: "Zero Liability Routing",
    desc: "Institutions receive structured support requests through official channels, with clear escalation protocols and documented compliance.",
  },
  {
    icon: TrendingUp,
    title: "District-Level Insights",
    desc: "Monthly anonymised reports help district education officers identify emerging distress patterns and allocate resources proactively.",
  },
  {
    icon: Users,
    title: "Trained Moderator Network",
    desc: "We provide vetted, trained moderators who triage reports using standardised frameworks aligned with POCSO, UGC, and NCPCR guidelines.",
  },
  {
    icon: FileText,
    title: "Compliance Ready",
    desc: "Every report is logged with timestamp integrity, maintaining a legally defensible audit trail for government audits and inspections.",
  },
];

const pilotSteps = [
  { step: "01", title: "Institution Onboards", desc: "School, college, or district education office registers as a pilot partner with a signed MoU." },
  { step: "02", title: "Deployment in 72 Hours", desc: "QR codes and awareness posters deployed across campus. Students can report via web or printed token." },
  { step: "03", title: "Moderation Begins", desc: "All reports triaged by trained moderators within 24 hours. Severity assigned using standardised rubrics." },
  { step: "04", title: "Monthly Reporting", desc: "Anonymised district-level insights delivered to government stakeholders. No individual data shared." },
];

export function Home() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, hsl(201,78%,50%) 0%, transparent 60%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80 text-sm font-medium">System is live and secure</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              A safe first step<br />
              <span style={{ color: "hsl(201,78%,65%)" }}>before crisis begins.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-4 max-w-2xl">
              Awaaz Setu helps people share distress safely, preserve context, identify risk, and reach the right support system.
            </p>
            <p className="text-sm text-white/45 italic mb-8">
              "Safe first step. Trusted support."
            </p>

            {/* Trust Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {trustChips.map((chip) => (
                <span key={chip} className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium text-white/80">
                  <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                  {chip}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                data-testid="button-report-hero"
                onClick={() => setLocation("/report")}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
              >
                <Lock className="w-4 h-4" />
                Speak Safely / Report Anonymously
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLocation("/how-it-works")}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium px-7 py-3.5 rounded-xl transition-all duration-200 text-sm"
              >
                How It Works
              </button>
              <a
                href="tel:14416"
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-3.5 rounded-xl transition-all duration-200 text-sm"
              >
                <Phone className="w-4 h-4" />
                I Need Help Now
              </a>
            </div>
          </div>
        </div>

        {/* Visual Flow Card */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 inline-flex flex-wrap items-center gap-2 sm:gap-3">
            {["Report", "Token", "Severity Review", "Support Routing"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="text-white text-xs font-medium">{step}</span>
                </div>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div className="h-8 bg-gradient-to-b from-transparent to-background relative" />
      </section>

      {/* Important Positioning */}
      <section className="bg-amber-50 border-y border-amber-200 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center">
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-900 text-sm">"Awaaz Setu is not built for public blame. It is built for safety, early support, and responsible routing."</p>
            <p className="text-amber-700 text-xs mt-0.5">Reports are confidential, anonymised, and visible only to verified moderators. No report is published publicly under any circumstance.</p>
          </div>
        </div>
      </section>

      {/* What Awaaz Setu IS */}
      <section className="py-20 bg-background px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">What Awaaz Setu Is</p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">Six core capabilities</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Awaaz Setu does not replace existing helplines, police, courts, government portals, hospitals, NGOs, or official complaint authorities. It acts as a safe first-step bridge that helps silent users reach the right support system.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatItIs.map((item) => (
              <div key={item.num} className="relative bg-card border border-card-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="absolute top-5 right-5 text-4xl font-black text-muted-foreground/8">{item.num}</div>
                <h3 className="font-bold text-secondary text-base mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What it IS and IS NOT */}
      <section className="py-20 bg-muted/30 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">What Awaaz Setu IS and IS NOT</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-green-800 text-base">Awaaz Setu IS</h3>
              </div>
              <ul className="space-y-3">
                {isItems.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-green-900">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-red-800 text-base">Awaaz Setu IS NOT</h3>
              </div>
              <ul className="space-y-3">
                {isNotItems.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-red-900">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — quick 3-step */}
      <section className="py-20 bg-background px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">Three steps to safety</h2>
            <p className="text-muted-foreground text-sm">
              <button onClick={() => setLocation("/how-it-works")} className="text-primary hover:underline font-medium">See the full 7-step process →</button>
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "1", title: "Submit Anonymously", desc: "Fill a short, guided form. No login, no email, no phone. Your identity is never collected.", icon: Lock },
              { n: "2", title: "We Route Your Report", desc: "Trained moderators assess severity and connect you to a verified counselor, officer, or helpline.", icon: Users },
              { n: "3", title: "Track with Your Token", desc: "You receive a unique token. Use it anytime to check the status and actions taken on your report.", icon: FileText },
            ].map((item) => (
              <div key={item.n} className="relative bg-card border border-card-border rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="absolute top-5 right-6 text-5xl font-black text-muted-foreground/8">{item.n}</div>
                <h3 className="font-bold text-secondary text-base mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Partnership */}
      <section className="py-20 bg-secondary px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: "hsl(201,78%,65%)" }}>Government Partnership</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Built for institutional trust</h2>
            <p className="text-white/60 max-w-2xl mx-auto text-sm">
              Awaaz Setu is designed to operate as a district-level government partner — providing structured, anonymised, compliance-ready safety infrastructure for schools, colleges, and communities.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {partnerBenefits.map((b) => (
              <div key={b.title} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: "hsl(201,78%,38%,0.3)" }}>
                  <b.icon className="w-4 h-4" style={{ color: "hsl(201,78%,65%)" }} />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{b.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-5 text-center">
            {[
              { value: "247+", label: "Reports processed in pilot" },
              { value: "94%", label: "Triage completed within 24h" },
              { value: "18", label: "States in awareness network" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => setLocation("/government")}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              See full Government Value page <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Pilot Plan */}
      <section className="py-20 bg-background px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">90-Day Pilot Plan</p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">From zero to district-ready</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              A structured onboarding for institutions and district offices ready to invest in preventive student safety.
            </p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-border -translate-x-1/2" />
            <div className="space-y-7">
              {pilotSteps.map((step, i) => (
                <div key={step.step} className={`flex flex-col md:flex-row gap-5 items-start md:items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div className="flex-1 bg-card border border-card-border rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold text-secondary text-base mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-md z-10">
                    <span className="text-white font-black text-xs">{step.step}</span>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Helpline Banner */}
      <section className="bg-red-50 border-y border-red-200 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-800 text-sm">If you or someone you know is in immediate crisis:</p>
            <p className="text-red-700 text-xs mt-0.5">
              Tele-MANAS: <strong>14416</strong> &nbsp;|&nbsp; iCall: <strong>9152987821</strong> &nbsp;|&nbsp; Vandrevala: <strong>+91 9999 666 555</strong> &nbsp;|&nbsp; National Emergency: <strong>112</strong>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">Common questions</h2>
            <button onClick={() => setLocation("/faq")} className="text-sm text-primary hover:underline font-medium">See all 10 FAQs →</button>
          </div>
          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card border border-card-border rounded-xl overflow-hidden">
                <button
                  data-testid={`button-faq-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-muted/40 transition-colors"
                >
                  <span className="font-medium text-secondary text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-muted-foreground text-sm leading-relaxed border-t border-border pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <AlertTriangle className="w-3.5 h-3.5 text-white/70" />
            <span className="text-white/80 text-xs">Demo prototype — not in production use</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">You are not alone.</h2>
          <p className="text-white/70 mb-7 max-w-xl mx-auto text-sm">Take the first step. It is anonymous, it is safe, and it matters.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              data-testid="button-report-cta"
              onClick={() => setLocation("/report")}
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-7 py-3.5 rounded-xl hover:bg-white/90 transition-colors shadow-lg text-sm"
            >
              <Lock className="w-4 h-4" />
              Report Safely Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLocation("/track")}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-7 py-3.5 rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              Track My Report
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
