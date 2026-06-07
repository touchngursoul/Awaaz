import { useState } from "react";
import { Shield, FileText, Lock, AlertTriangle, Baby, Phone } from "lucide-react";

const policies = [
  {
    id: "privacy",
    icon: Lock,
    title: "Privacy Policy",
    color: "text-blue-600 bg-blue-50",
    content: [
      {
        heading: "Minimum Information Collection",
        text: "Awaaz Setu collects the minimum necessary information to process a support request. Users can submit reports without providing any mandatory name, email address, or phone number.",
      },
      {
        heading: "No Mandatory Identity",
        text: "The system is designed for anonymous intake. No identity is required to submit a report, receive a token, or track a report status.",
      },
      {
        heading: "Optional Contact",
        text: "Optional contact information is collected only if the user explicitly chooses to request follow-up support and voluntarily provides it.",
      },
      {
        heading: "No Public Reports",
        text: "Reports are never made public. They are visible only to authorized, trained moderators and authorized district-level personnel assigned to the case.",
      },
      {
        heading: "Token Privacy",
        text: "Each user receives a unique anonymous token. The token does not contain any personal identifier and cannot be traced back to the user without their disclosure.",
      },
      {
        heading: "Demo Prototype Notice",
        text: "This is a prototype. In this version, no data is permanently stored on a server. All demonstration data is mock data or temporary session data. Do not submit real sensitive personal information in this demo.",
      },
    ],
  },
  {
    id: "terms",
    icon: FileText,
    title: "Terms of Use",
    color: "text-indigo-600 bg-indigo-50",
    content: [
      {
        heading: "Responsible Use",
        text: "Users must submit true, responsible, and accurate information to the best of their knowledge. The platform is designed for genuine support-seeking, not misuse.",
      },
      {
        heading: "No Guilt Declaration",
        text: "Awaaz Setu does not declare guilt. It identifies urgency and support need only. Users must not use the platform to publicly accuse, expose, or shame any individual.",
      },
      {
        heading: "Not a Replacement for Authorities",
        text: "Awaaz Setu does not replace police, courts, hospitals, emergency services, government portals, or official complaint authorities. In immediate danger, contact emergency services.",
      },
      {
        heading: "Platform Scope",
        text: "This platform is designed for preventive safety, early intervention, evidence-aware documentation, and support routing only. It is not a legal, investigative, or law enforcement tool.",
      },
      {
        heading: "Demo Disclaimer",
        text: "This is a prototype demo intended for evaluation by government, NGO, and funding stakeholders. It is not currently in production use.",
      },
    ],
  },
  {
    id: "evidence",
    icon: Shield,
    title: "Evidence Handling Policy",
    color: "text-teal-600 bg-teal-50",
    content: [
      {
        heading: "Types of Evidence Accepted",
        text: "Evidence may include screenshots, text messages, photos, audio recordings, video clips, PDFs, or other documents relevant to the incident being reported.",
      },
      {
        heading: "Evidence Is Optional",
        text: "Evidence is helpful but never mandatory. Users can submit a report without any evidence and will still receive a token and triage review.",
      },
      {
        heading: "Demo Upload Notice",
        text: "In this prototype, all upload functionality is demo-only. No actual file is transmitted to any server. The upload animation and progress bar are visual demonstrations only.",
      },
      {
        heading: "Production Standards",
        text: "In a production deployment, evidence must be encrypted end-to-end, access-controlled, stored in government-approved infrastructure, and accessible only to authorized personnel on a need-to-know basis.",
      },
      {
        heading: "No Viral Evidence",
        text: "Evidence submitted to Awaaz Setu is never published, shared publicly, or distributed. It is used solely for triage and authorized support routing.",
      },
      {
        heading: "Custody of Serious Evidence",
        text: "Serious evidence (child abuse, sexual assault, criminal threats) must be handled through legally authorized channels and not retained by Awaaz Setu as a private evidence locker.",
      },
    ],
  },
  {
    id: "false-report",
    icon: AlertTriangle,
    title: "False Report & Misuse Policy",
    color: "text-orange-600 bg-orange-50",
    content: [
      {
        heading: "Prohibited Report Types",
        text: "Fake, edited, AI-generated, misleading, malicious, or revenge-based reports are strictly prohibited. Such reports can harm innocent individuals and undermine the trust of genuine users.",
      },
      {
        heading: "Review and Flagging",
        text: "Suspicious reports may be reviewed, rejected, or flagged by trained moderators. Reports showing patterns of misuse will be escalated to oversight authorities.",
      },
      {
        heading: "Consent Statement",
        text: "All users confirm at submission that the information shared is true to the best of their knowledge. False consent can carry legal consequences.",
      },
      {
        heading: "Protecting Respondents",
        text: "Awaaz Setu is built to protect vulnerable users. It equally recognizes the risk of harm to individuals who may be falsely reported and has safeguards in place to prevent platform misuse.",
      },
      {
        heading: "No Public Naming",
        text: "Awaaz Setu does not publicly name or expose any individual — reporter or respondent — under any circumstance.",
      },
    ],
  },
  {
    id: "child",
    icon: Baby,
    title: "Child Safety Policy",
    color: "text-pink-600 bg-pink-50",
    content: [
      {
        heading: "Special Protection for Minors",
        text: "Reports involving minors, bad touch, grooming, blackmail, abuse, or exploitation must be handled with extra care, legal caution, and involvement of authorized child protection channels.",
      },
      {
        heading: "POCSO Alignment",
        text: "Cases involving minors that fall under the Protection of Children from Sexual Offences (POCSO) Act must be escalated to legal authorities. Awaaz Setu cannot serve as a substitute for mandatory POCSO reporting.",
      },
      {
        heading: "Anonymous Intake for Children",
        text: "Children and youth can use Awaaz Setu as a safe first-step to share their situation anonymously, receive token-based tracking, and be guided toward authorized child protection systems.",
      },
      {
        heading: "Trained Moderator Review",
        text: "Reports involving minors are reviewed with heightened care and routed to appropriate child welfare or legal authorities based on the nature and severity of the case.",
      },
      {
        heading: "Child Helpline",
        text: "For immediate child safety concerns, users are directed to CHILDLINE: 1098 — a 24-hour emergency response service for children in distress.",
      },
    ],
  },
  {
    id: "crisis",
    icon: Phone,
    title: "Crisis Support Disclaimer",
    color: "text-red-600 bg-red-50",
    content: [
      {
        heading: "Not an Emergency Service",
        text: "Awaaz Setu is a preventive safety and anonymous support-routing system. It is NOT an emergency response service, a helpline, a hospital, or a police service.",
      },
      {
        heading: "Immediate Danger",
        text: "If someone is in immediate physical danger, please do not wait for an online response. Contact emergency services (112), a trusted person nearby, or the nearest hospital immediately.",
      },
      {
        heading: "Mental Health Crisis",
        text: "If you or someone you know is experiencing a mental health crisis or suicidal ideation, please call Tele-MANAS (14416 / 1800-891-4416) or iCall (9152987821) immediately.",
      },
      {
        heading: "Crisis Keywords",
        text: "If users type crisis-related keywords during report submission, Awaaz Setu automatically displays a Crisis Support Overlay with verified helpline numbers and guidance to seek immediate help.",
      },
      {
        heading: "Response Time Disclaimer",
        text: "Awaaz Setu does not guarantee real-time response. For immediate crises, always contact verified emergency services or helplines directly.",
      },
      {
        heading: "Helplines",
        text: "Emergency: 112 | Tele-MANAS: 14416 | iCall: 9152987821 | Cyber Crime: 1930 | Women Helpline: 181 | Child Help: 1098 | Vandrevala Foundation: +91 9999 666 555",
      },
    ],
  },
];

export function Policies() {
  const [activeId, setActiveId] = useState("privacy");
  const active = policies.find((p) => p.id === activeId)!;

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-secondary py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(201,78%,65%)" }}>Policy Center</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Our policies and commitments</h1>
          <p className="text-white/65 max-w-xl mx-auto text-sm">
            Awaaz Setu is built on trust. Read our policies to understand how we handle your data, evidence, and support requests responsibly.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-card border border-card-border rounded-2xl p-3 lg:sticky lg:top-20">
                {policies.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveId(p.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors mb-1 ${
                      activeId === p.id
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <p.icon className="w-4 h-4 flex-shrink-0" />
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active.color}`}>
                    <active.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-secondary">{active.title}</h2>
                </div>
                <div className="space-y-6">
                  {active.content.map((section, i) => (
                    <div key={i} className="border-b border-border pb-6 last:border-0 last:pb-0">
                      <h3 className="font-bold text-secondary text-sm mb-2">{section.heading}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{section.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Prototype Disclaimer:</strong> This is a demo prototype for evaluation purposes. These policies represent our intended framework for a production deployment. Formal legal review is required before any production launch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
