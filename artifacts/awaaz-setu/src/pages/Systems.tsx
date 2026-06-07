import { CheckCircle, XCircle } from "lucide-react";

const systems = [
  {
    name: "Tele-MANAS",
    focus: "Mental health support",
    doesWell: "Counselling and mental health assistance by trained professionals over the phone",
    gap: "Written anonymous intake, evidence context, token tracking, and structured support routing",
  },
  {
    name: "Vandrevala / iCALL",
    focus: "Counseling support",
    doesWell: "Emotional and crisis support via trained counselors",
    gap: "Evidence-aware reporting, severity triage, and institutional routing",
  },
  {
    name: "National Cyber Crime Portal (cybercrime.gov.in)",
    focus: "Cybercrime reporting",
    doesWell: "Official cybercrime complaints and investigation routing",
    gap: "Early identification of cyber blackmail, safe pre-complaint guidance, and anonymous first-step intake",
  },
  {
    name: "NCW (National Commission for Women)",
    focus: "Women complaints",
    doesWell: "Women grievance redressal and policy advocacy",
    gap: "Anonymous first-step before formal complaint — lowers barrier for users who fear identity exposure",
  },
  {
    name: "SHe-Box",
    focus: "Workplace sexual harassment",
    doesWell: "POSH-related complaint routing for workplace cases",
    gap: "Broader student, youth, cyber, mental distress, and institutional pressure support beyond workplace scope",
  },
  {
    name: "POSH Compliance Firms",
    focus: "Workplace compliance",
    doesWell: "IC committee setup, POSH training, and compliance documentation",
    gap: "Victim-first anonymous early warning, pre-complaint safety layer, and institutional safety dashboard",
  },
  {
    name: "POCSO / NCPCR Channels",
    focus: "Child protection",
    doesWell: "Legal reporting and protection orders for child abuse cases",
    gap: "Anonymous early warning layer before official complaint — especially for cases where children fear reporting",
  },
];

const isItems = [
  "Safe first-step system",
  "Anonymous intake layer",
  "Evidence-aware documentation tool",
  "Severity triage system",
  "Support routing bridge",
  "Preventive safety governance tool",
  "Token-based anonymous tracking",
];

const isNotItems = [
  "Not an FIR platform",
  "Not a police replacement",
  "Not a court or legal body",
  "Not a public complaint wall",
  "Not a revenge or exposure tool",
  "Not a political platform",
  "Not an emergency response service",
  "Not a place to declare anyone guilty",
];

export function Systems() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(201,78%,65%)" }}>System Comparison</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Awaaz Setu and existing systems</h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto">
            Awaaz Setu does not compete with existing systems. It fills the gap before users reach those systems.
          </p>
        </div>
      </section>

      {/* IS / IS NOT */}
      <section className="py-20 bg-background px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary">What Awaaz Setu IS — and IS NOT</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
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

      {/* Comparison Table */}
      <section className="py-20 bg-muted/30 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Existing Systems vs Awaaz Setu</p>
            <h2 className="text-3xl font-bold text-secondary mb-4">The gap Awaaz Setu fills</h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Every existing system listed below is important and effective in its scope. Awaaz Setu is not a replacement. It is the safe first-step bridge that helps users reach the right system.
            </p>
          </div>

          <div className="space-y-4">
            {systems.map((s) => (
              <div key={s.name} className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-secondary/5 border-b border-border px-6 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-bold text-secondary text-base">{s.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium">{s.focus}</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                  <div className="px-6 py-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-2">What it does well</p>
                    <p className="text-sm text-foreground leading-relaxed">{s.doesWell}</p>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Gap Awaaz Setu fills</p>
                    <p className="text-sm text-foreground leading-relaxed">{s.gap}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
            <p className="text-secondary font-semibold text-base mb-2">"Awaaz Setu does not replace these systems."</p>
            <p className="text-muted-foreground text-sm">It acts as the safe first-step bridge that helps users reach the right system without fear, barriers, or identity exposure.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
