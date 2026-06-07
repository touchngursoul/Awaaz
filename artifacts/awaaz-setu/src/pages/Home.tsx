import { useLocation } from "wouter";
import { Shield, Lock, ArrowRight, CheckCircle, ChevronDown, ChevronUp, Users, FileText, TrendingUp, Phone } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Is my identity completely anonymous?",
    a: "Yes. Awaaz Setu does not collect any identifying information — no login, no email, no phone number, no IP logging. Your report is cryptographically anonymised before storage. Even our own administrators cannot trace it back to you.",
  },
  {
    q: "What happens after I submit a report?",
    a: "Your report is reviewed by a trained moderator within 24 hours. It is assigned a severity level (L1–L4) and routed to the appropriate support channel — a verified counselor, district officer, or institutional liaison. You can track progress using your unique token.",
  },
  {
    q: "Can I submit evidence securely?",
    a: "Yes. You can upload images, audio recordings, PDFs, and text screenshots. All evidence is encrypted end-to-end and stored in an isolated secure locker. It is only accessible to verified moderators handling your case.",
  },
  {
    q: "Is this a replacement for filing a police complaint?",
    a: "No. Awaaz Setu is a preventive safety and first-response routing system, not a legal complaint mechanism. For emergencies, please contact 112. For formal legal action, contact your local police station. We help you access the right support before or alongside formal processes.",
  },
  {
    q: "What is the Pilot Plan and how does my institution participate?",
    a: "The Awaaz Setu Pilot Plan is a structured 90-day government-partnered program. Institutions (schools, colleges, universities) register as pilot partners. We provide the platform, trained moderators, and monthly district-level reporting. Interested institutions can contact us through the government partnership portal.",
  },
  {
    q: "What is severity Level 4?",
    a: "Level 4 (Critical) is reserved for cases involving immediate physical danger, sexual abuse, or active suicidal ideation. Such cases are escalated immediately to District Protection Officers and, where applicable, law enforcement — all while preserving your anonymity.",
  },
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80 text-sm font-medium">System is live and secure</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your voice matters.<br />
              <span className="text-primary" style={{ color: "hsl(201,78%,65%)" }}>Your safety comes first.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-4 max-w-2xl">
              Awaaz Setu is a preventive safety and support routing system — not a public complaint or exposure wall. Every report is anonymous, encrypted, and routed to verified support.
            </p>
            <p className="text-base text-white/50 mb-10 italic">
              "Safe first step. Trusted support."
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                data-testid="button-report-hero"
                onClick={() => setLocation("/report")}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base"
              >
                <Lock className="w-5 h-5" />
                Speak Safely / Report Anonymously
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                data-testid="button-track-hero"
                onClick={() => setLocation("/track")}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium px-8 py-4 rounded-xl transition-all duration-200 text-base"
              >
                Track My Report
              </button>
            </div>
          </div>
        </div>
        <div className="h-8 bg-gradient-to-b from-transparent to-background relative" />
      </section>

      {/* Trust Statement */}
      <section className="bg-amber-50 border-y border-amber-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-900 text-sm">Important: Awaaz Setu is NOT a public complaint wall or exposure platform.</p>
            <p className="text-amber-700 text-sm">Reports are confidential, anonymised, and visible only to verified moderators. No report is published publicly under any circumstance.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">Three steps to safety</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Submit Anonymously", desc: "Fill a short, guided form. No login, no email, no phone. Your identity is never collected.", icon: Lock },
              { n: "2", title: "We Route Your Report", desc: "Trained moderators assess severity and connect you to a verified counselor, officer, or helpline.", icon: Users },
              { n: "3", title: "Track with Your Token", desc: "You receive a unique token. Use it anytime to check the status and actions taken on your report.", icon: FileText },
            ].map((item) => (
              <div key={item.n} className="relative bg-card border border-card-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute top-6 right-8 text-5xl font-black text-muted-foreground/10">{item.n}</div>
                <h3 className="font-bold text-secondary text-lg mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Partnership */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: "hsl(201,78%,65%)" }}>Government Partnership</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for institutional trust</h2>
            <p className="text-white/60 max-w-2xl mx-auto text-base">
              Awaaz Setu is designed to operate as a district-level government partner — providing structured, anonymised, compliance-ready safety infrastructure for schools, colleges, and communities.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerBenefits.map((b) => (
              <div key={b.title} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "hsl(201,78%,38%,0.3)" }}>
                  <b.icon className="w-5 h-5" style={{ color: "hsl(201,78%,65%)" }} />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{b.title}</h3>
                <p className="text-white/55 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
            {[
              { value: "247+", label: "Reports processed in pilot" },
              { value: "94%", label: "Triage completed within 24h" },
              { value: "18", label: "States in awareness network" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilot Plan */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">90-Day Pilot Plan</p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">From zero to district-ready</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mt-4 text-base">
              A structured onboarding for institutions and district offices ready to invest in preventive student safety.
            </p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-border -translate-x-1/2" />
            <div className="space-y-8">
              {pilotSteps.map((step, i) => (
                <div key={step.step} className={`flex flex-col md:flex-row gap-6 items-start md:items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div className="flex-1 bg-card border border-card-border rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-secondary text-base mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-md z-10">
                    <span className="text-white font-black text-sm">{step.step}</span>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Helpline Banner */}
      <section className="bg-red-50 border-y border-red-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Phone className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">If you or someone you know is in immediate crisis:</p>
              <p className="text-red-700 text-sm mt-0.5">
                Tele-MANAS: <strong>14416</strong> &nbsp;|&nbsp; iCall: <strong>9152987821</strong> &nbsp;|&nbsp; National Emergency: <strong>112</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">Common questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card border border-card-border rounded-xl overflow-hidden">
                <button
                  data-testid={`button-faq-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-secondary text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">You are not alone.</h2>
          <p className="text-white/75 mb-8 max-w-xl mx-auto">Take the first step. It is anonymous, it is safe, and it matters.</p>
          <button
            data-testid="button-report-cta"
            onClick={() => setLocation("/report")}
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors shadow-lg"
          >
            <Lock className="w-5 h-5" />
            Report Safely Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">Awaaz Setu</span>
          </div>
          <p className="text-white/40 text-xs text-center">
            Safe first step. Trusted support. &nbsp;|&nbsp; This platform is a demo for institutional and government preview.
          </p>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-white/50 text-xs">End-to-end encrypted</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
