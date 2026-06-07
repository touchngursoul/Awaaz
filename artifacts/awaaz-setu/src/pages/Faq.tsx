import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, ChevronUp, Lock, ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "Is Awaaz Setu anonymous?",
    a: "Yes. Users can submit a report without providing any mandatory name, email address, or phone number. No login or registration is required. You can share your situation without revealing your identity.",
    tag: "Privacy",
  },
  {
    q: "Does Awaaz Setu file an FIR?",
    a: "No. Awaaz Setu is not a police portal, and it does not file FIRs. It can guide users toward official systems such as the nearest police station or the National Cyber Crime Portal, but it does not initiate legal proceedings on behalf of any user.",
    tag: "Scope",
  },
  {
    q: "Will my report be made public?",
    a: "No. Awaaz Setu does not publish reports. Reports are visible only to trained, authorized moderators handling your case. No report is shared publicly, posted online, or disclosed to any unauthorized party under any circumstance.",
    tag: "Privacy",
  },
  {
    q: "Does Awaaz Setu decide who is guilty?",
    a: "No. Awaaz Setu identifies urgency, risk level, and support need only. It does not make moral, legal, or factual judgements about any individual. Guilt can only be determined by a competent legal authority.",
    tag: "Scope",
  },
  {
    q: "What if someone submits a fake or malicious report?",
    a: "Fake, edited, AI-generated, misleading, or malicious reports are strictly prohibited. All users confirm at submission that their information is true. Suspicious reports may be reviewed, rejected, or flagged. Serious misuse may be reported to appropriate authorities.",
    tag: "Misuse",
  },
  {
    q: "Is evidence mandatory to submit a report?",
    a: "No. Evidence is helpful but never mandatory. You can still submit a complete report without any evidence. You will receive a token, and your report will be reviewed by a trained moderator.",
    tag: "Form",
  },
  {
    q: "Can Awaaz Setu help during an emergency?",
    a: "Awaaz Setu can show crisis guidance and verified helpline numbers. However, it is NOT an emergency response service. If you or someone near you is in immediate danger, please call 112 (Emergency), 14416 (Tele-MANAS), or a trusted person nearby immediately. Do not wait for an online response.",
    tag: "Crisis",
  },
  {
    q: "How is Awaaz Setu different from Tele-MANAS, NCW, the Cyber Crime Portal, or SHe-Box?",
    a: "Those are important official and support systems. Awaaz Setu is not competing with them. It acts as a safe first-step bridge — providing anonymous intake, evidence-aware documentation, severity triage, and token tracking — that helps users reach the right system with context, without fear or identity exposure.",
    tag: "Comparison",
  },
  {
    q: "Who will review reports in a production deployment?",
    a: "Only trained, authorized moderators, counselors, legal advisors, NGOs, or district-approved bodies — based on role and case type. Access is role-based, audited, and encrypted. This is a demo prototype; no real report review is happening in this version.",
    tag: "Operations",
  },
  {
    q: "Will users have to pay to submit a report?",
    a: "No. Core reporting should remain free for users. Platform sustainability can come from government grants, CSR partnerships, institutional dashboard subscriptions, and moderator training programs — not from individual users.",
    tag: "Access",
  },
];

const tags = ["All", ...Array.from(new Set(faqs.map((f) => f.tag)))];

const tagColors: Record<string, string> = {
  Privacy: "bg-blue-100 text-blue-700",
  Scope: "bg-indigo-100 text-indigo-700",
  Misuse: "bg-orange-100 text-orange-700",
  Form: "bg-green-100 text-green-700",
  Crisis: "bg-red-100 text-red-700",
  Comparison: "bg-purple-100 text-purple-700",
  Operations: "bg-teal-100 text-teal-700",
  Access: "bg-emerald-100 text-emerald-700",
};

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTag, setActiveTag] = useState("All");
  const [, setLocation] = useLocation();

  const filtered = activeTag === "All" ? faqs : faqs.filter((f) => f.tag === activeTag);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-secondary py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(201,78%,65%)" }}>FAQ</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-white/65 max-w-xl mx-auto text-sm">
            Answers to the most common questions about Awaaz Setu — its scope, anonymity, policies, and what it can and cannot do.
          </p>
        </div>
      </section>

      {/* Filter Tags */}
      <section className="pt-10 px-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => { setActiveTag(tag); setOpenIndex(null); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  activeTag === tag
                    ? "bg-primary text-white border-primary"
                    : "bg-card border-card-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-10 px-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {filtered.map((faq, i) => {
              const globalIndex = faqs.indexOf(faq);
              const isOpen = openIndex === globalIndex;
              return (
                <div key={globalIndex} className="bg-card border border-card-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                    className="w-full flex items-start justify-between px-6 py-5 text-left gap-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${tagColors[faq.tag] ?? "bg-muted text-muted-foreground"}`}>{faq.tag}</span>
                      <span className="font-medium text-secondary text-sm">{faq.q}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5">
                      <p className="text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-muted/30">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-bold text-secondary mb-3">Still have questions?</h2>
          <p className="text-muted-foreground text-sm mb-6">You can review our policies or try the anonymous report form to see how the system works.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setLocation("/policies")}
              className="flex items-center justify-center gap-2 bg-card border border-card-border text-secondary font-medium px-6 py-3 rounded-xl hover:bg-muted transition-colors text-sm"
            >
              Read Policies
            </button>
            <button
              onClick={() => setLocation("/report")}
              className="flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              <Lock className="w-4 h-4" />
              Report Anonymously
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
