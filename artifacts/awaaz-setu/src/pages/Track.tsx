import { useState, useEffect } from "react";
import { Search, CheckCircle, Clock, AlertTriangle, Shield, X, Info, Lock } from "lucide-react";
import { useTrackReport, getTrackReportQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrackTimeline {
  status: string;
  timestamp: string;
  description: string;
  severity?: string;
}

interface TrackOverride {
  status: string;
  timeline: TrackTimeline[];
  auditLog: { action: string; timestamp: string; actor: string }[];
  verificationStatus?: "anonymous" | "verified";
  withdrawalReason?: string;
  withdrawalDate?: string;
  correctionNote?: string;
}

interface TrackData {
  token: string;
  category: string;
  district: string;
  submittedAt: string;
  status: string;
  severity: string;
  timeline: TrackTimeline[];
  verificationStatus: "anonymous" | "verified";
  withdrawalReason?: string;
  withdrawalDate?: string;
  correctionNote?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_SUBMITTED = "awaaz_submitted_reports";
const LS_OVERRIDES = "awaaz_report_overrides";

const SEVERITY_COLORS: Record<string, string> = {
  L1: "bg-green-100 text-green-800 border-green-200",
  L2: "bg-yellow-100 text-yellow-800 border-yellow-200",
  L3: "bg-orange-100 text-orange-800 border-orange-200",
  L4: "bg-red-100 text-red-800 border-red-200",
};

const WITHDRAW_REASONS = [
  "Submitted in anger",
  "Issue resolved on its own",
  "Wrong information was added",
  "I do not want further support",
  "Duplicate report",
  "Other reason",
];

const BLOCKED_BY_STATUS = [
  "Withdrawn by Reporter",
  "Case Closed",
  "Withdrawal Approved After Review",
  "Safety Escalation Suggested",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryLabel(cat: string): string {
  const MAP: Record<string, string> = {
    bullying: "Bullying", ragging: "Ragging", cyber_blackmail: "Cyber Blackmail",
    cyber_harassment: "Cyber Harassment", institutional_pressure: "Institutional Pressure",
    bad_touch: "Bad Touch", sexual_harassment: "Sexual Harassment",
    mental_distress: "Mental Distress", stalking: "Stalking", physical_threat: "Physical Threat",
    self_harm_risk: "Self-Harm Risk", workplace_harassment: "Workplace Harassment", other: "Other",
  };
  return MAP[cat] ?? cat;
}

function computeSeverity(category: string, seriousness: string): string {
  const s = (seriousness ?? "").toLowerCase();
  if (s.includes("harming myself") || s.includes("immediate danger")) return "L4";
  if (["bad_touch", "ragging", "sexual_harassment", "self_harm_risk"].includes(category)) return "L3";
  if (["cyber_blackmail", "bullying", "stalking", "physical_threat"].includes(category) && (s.includes("threatened") || s.includes("unsafe"))) return "L3";
  if (["cyber_blackmail", "bullying", "mental_distress", "cyber_harassment", "workplace_harassment"].includes(category)) return "L2";
  return "L1";
}

function loadOverrides(): Record<string, TrackOverride> {
  try { return JSON.parse(localStorage.getItem(LS_OVERRIDES) ?? "{}") as Record<string, TrackOverride>; }
  catch { return {}; }
}

function writeOverride(token: string, fields: Partial<TrackOverride>) {
  const all = loadOverrides();
  all[token] = { ...(all[token] ?? { status: "", timeline: [], auditLog: [] }), ...fields };
  localStorage.setItem(LS_OVERRIDES, JSON.stringify(all));
  return all[token];
}

function findLocalReport(token: string): TrackData | null {
  try {
    const submitted = JSON.parse(localStorage.getItem(LS_SUBMITTED) ?? "[]") as Array<Record<string, unknown>>;
    const found = submitted.find((r) => (r.token as string) === token);
    if (!found) return null;
    const overrides = loadOverrides();
    const ov = overrides[token];
    const cat = (found.category as string) ?? "other";
    const seriousness = (found.seriousness as string) ?? "";
    const severity = computeSeverity(cat, seriousness);
    const submittedAt = (found.submittedAt as string) ?? new Date().toISOString();
    const baseTimeline: TrackTimeline[] = [
      { status: "Report Received", timestamp: submittedAt, description: "Anonymous report submitted via Awaaz Setu." },
      { status: `Severity Assigned: ${severity}`, timestamp: new Date(new Date(submittedAt).getTime() + 30 * 60000).toISOString(), description: `Auto-assessed as ${severity} based on category and seriousness level.` },
    ];
    return {
      token,
      category: getCategoryLabel(cat),
      district: (found.district as string) ?? "Not specified",
      submittedAt,
      status: ov?.status ?? "Report Received",
      severity,
      timeline: ov?.timeline ?? baseTimeline,
      verificationStatus: (found.verificationStatus as "anonymous" | "verified") ?? ov?.verificationStatus ?? "anonymous",
      withdrawalReason: ov?.withdrawalReason,
      withdrawalDate: ov?.withdrawalDate,
      correctionNote: ov?.correctionNote,
    };
  } catch { return null; }
}

function fmt(ts: string) {
  return new Date(ts).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Timeline Event Component ─────────────────────────────────────────────────

function TimelineEvent({ event, isLast, isLatest }: { event: TrackTimeline; isLast: boolean; isLatest: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${isLatest && !isLast ? "border-primary bg-primary" : "border-green-500 bg-green-500"}`}>
          {isLatest && !isLast ? <Clock className="w-4 h-4 text-white" /> : <CheckCircle className="w-4 h-4 text-white" />}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
      </div>
      <div className={`${isLast ? "pb-0" : "pb-6"}`}>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="font-semibold text-secondary text-sm">{event.status}</p>
          {event.severity && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${SEVERITY_COLORS[event.severity] ?? "bg-muted text-muted-foreground border-border"}`}>{event.severity}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-1">{fmt(event.timestamp)}</p>
        <p className="text-sm text-foreground leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
}

// ─── Withdraw Modal ───────────────────────────────────────────────────────────

function WithdrawModal({ severity, onClose, onConfirm }: {
  severity: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [checked, setChecked] = useState(false);
  const isHighRisk = severity === "L3" || severity === "L4";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-card-border rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className={`px-6 py-5 flex items-center justify-between ${isHighRisk ? "bg-orange-600" : "bg-amber-600"}`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-white" />
            <h2 className="text-white font-bold">{isHighRisk ? "Request Withdrawal Review" : "Withdraw this report?"}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          {isHighRisk ? (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-800 font-semibold mb-1.5">This report may involve higher safety risk.</p>
              <p className="text-xs text-orange-700 leading-relaxed">A withdrawal request will be reviewed for safety before any action is stopped. Awaaz Setu may continue safety guidance if risk is found.</p>
            </div>
          ) : (
            <p className="text-sm text-foreground leading-relaxed">
              You can withdraw this L1/L2 report if you do not want further action. Awaaz Setu will stop further demo action on this report. This does not mean the information was false. It only means you do not want to continue the report process.
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Reason for {isHighRisk ? "review request" : "withdrawal"}</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select a reason</option>
              {WITHDRAW_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <label className="flex items-start gap-3 cursor-pointer bg-amber-50 border border-amber-200 rounded-xl p-3">
            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mt-0.5 w-4 h-4 flex-shrink-0" />
            <span className="text-xs text-amber-800 leading-relaxed">
              I understand that {isHighRisk ? "this review request will be reviewed for safety before any action is stopped" : "withdrawal stops further demo action on this report"}.
            </span>
          </label>

          <div className="bg-muted/50 border border-border rounded-xl p-3 text-xs text-muted-foreground leading-relaxed">
            For low-risk cases, withdrawal may stop further action. For serious safety concerns, self-harm risk, child safety, violence, sexual assault, or emergency signals, Awaaz Setu may show safety guidance and require authorized review. Awaaz Setu does not delete legal obligations or emergency responsibilities.
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors">Cancel</button>
            <button
              disabled={!reason || !checked}
              onClick={() => onConfirm(reason)}
              className={`flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${isHighRisk ? "bg-orange-600 hover:bg-orange-700" : "bg-amber-600 hover:bg-amber-700"}`}
            >
              {isHighRisk ? "Submit Review Request" : "Confirm Withdrawal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Correct Modal ────────────────────────────────────────────────────────────

function CorrectModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (note: string) => void }) {
  const [note, setNote] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-card-border rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="bg-primary px-6 py-5 flex items-center justify-between">
          <h2 className="text-white font-bold">Add a Correction Note</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">Your original statement will not be changed or deleted. This correction note will be added separately alongside it for moderator review.</p>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Describe what needs to be corrected or clarified in your original report..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors">Cancel</button>
            <button disabled={note.trim().length < 5} onClick={() => onConfirm(note.trim())}
              className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
              Add Correction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pause Modal ──────────────────────────────────────────────────────────────

function PauseModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-card-border rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="bg-secondary px-6 py-5 flex items-center justify-between">
          <h2 className="text-white font-bold">Pause support request?</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">You can pause support request and return later using the same token. The report will remain in the system and no further support action will be taken until you return.</p>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
            <p className="text-xs text-primary/80 leading-relaxed">Pausing does not delete your report. You can resume by tracking your token and choosing to continue support request.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 transition-colors">Pause Support Request</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Verify Modal ─────────────────────────────────────────────────────────────

function VerifyModal({ onClose, onVerified }: { onClose: () => void; onVerified: () => void }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handleSimulate() {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-card-border rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="bg-primary px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold">Optional Trust Verification</h2>
            <p className="text-white/60 text-xs mt-0.5">Demo simulation only — no real verification happens</p>
          </div>
          {!done && <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-4 h-4" /></button>}
        </div>
        <div className="p-6">
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <p className="font-bold text-secondary text-lg mb-1">Verified Identity — Hidden</p>
              <p className="text-sm text-muted-foreground mb-6">Your identity remains hidden and is not displayed in the report or admin view.</p>
              <button onClick={() => { onVerified(); onClose(); }} className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                Done — Apply Trust Seal
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Simulating DigiLocker-style verification…</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-foreground leading-relaxed">This demo simulates a DigiLocker-style trust verification. No real Aadhaar, DigiLocker, or government authentication is happening.</p>
              <div className="space-y-2 py-1">
                {[
                  "Aadhaar number will not be shown in report",
                  "Identity will not be visible publicly",
                  "Normal admin view shows only verification status",
                  "Verification helps reduce fake reporting",
                  "You can still continue fully anonymously",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors">Continue Anonymously</button>
                <button onClick={handleSimulate} className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Verify Safely — Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Track Component ─────────────────────────────────────────────────────

export function Track() {
  const { toast } = useToast();
  const [inputToken, setInputToken] = useState("");
  const [submittedToken, setSubmittedToken] = useState("");
  const [localData, setLocalData] = useState<TrackData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const { data: apiData, isLoading, error } = useTrackReport(
    { token: submittedToken },
    { query: { enabled: !!submittedToken, queryKey: getTrackReportQueryKey({ token: submittedToken }) } }
  );

  // Merge API data with localStorage overrides
  useEffect(() => {
    if (!apiData) return;
    const overrides = loadOverrides();
    const ov = overrides[submittedToken];
    setLocalData({
      token: apiData.token,
      category: apiData.category,
      district: apiData.district,
      submittedAt: apiData.submittedAt,
      status: ov?.status ?? apiData.currentStatus,
      severity: (apiData.severity as string) ?? "L1",
      timeline: ov?.timeline ?? (apiData.events as TrackTimeline[]),
      verificationStatus: ov?.verificationStatus ?? "anonymous",
      withdrawalReason: ov?.withdrawalReason,
      withdrawalDate: ov?.withdrawalDate,
      correctionNote: ov?.correctionNote,
    });
    setNotFound(false);
  }, [apiData, submittedToken]);

  // When API fails, check localStorage for user-submitted tokens
  useEffect(() => {
    if (!error) return;
    const local = findLocalReport(submittedToken);
    if (local) { setLocalData(local); setNotFound(false); }
    else { setLocalData(null); setNotFound(true); }
  }, [error, submittedToken]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = inputToken.trim().toUpperCase();
    setLocalData(null);
    setNotFound(false);
    setSubmittedToken(cleaned);
  }

  function applyAction(
    newStatus: string,
    timelineEntry: TrackTimeline,
    auditAction: string,
    extras?: Partial<TrackOverride>
  ) {
    const now = new Date().toISOString();
    const overrides = loadOverrides();
    const existing = overrides[submittedToken];
    const currentTimeline = existing?.timeline ?? localData?.timeline ?? [];
    const newTimeline = [...currentTimeline, timelineEntry];
    const newAuditLog = [...(existing?.auditLog ?? []), { action: auditAction, timestamp: now, actor: "Reporter (anonymous token)" }];
    writeOverride(submittedToken, { status: newStatus, timeline: newTimeline, auditLog: newAuditLog, ...(existing ?? {}), ...extras });
    setLocalData((prev) => prev ? { ...prev, status: newStatus, timeline: newTimeline, ...extras } : prev);
  }

  function handleWithdraw(reason: string) {
    const now = new Date().toISOString();
    const isHighRisk = localData?.severity === "L3" || localData?.severity === "L4";
    const newStatus = isHighRisk ? "Withdrawal Review Requested" : "Withdrawn by Reporter";
    const desc = isHighRisk
      ? "Reporter requested withdrawal review. Safety review required before any action is stopped."
      : "Report withdrawn by reporter using anonymous token.";
    const audit = isHighRisk
      ? "High-risk withdrawal review requested through token tracking page."
      : "Withdrawal requested through token tracking page.";
    applyAction(newStatus, { status: newStatus, timestamp: now, description: desc }, audit, {
      withdrawalReason: reason,
      withdrawalDate: now,
    });
    setShowWithdraw(false);
    toast({
      title: isHighRisk ? "Withdrawal review requested" : "Report withdrawn",
      description: isHighRisk
        ? "Your request will be reviewed for safety before any action is stopped."
        : "Your report has been withdrawn. No further demo action will be taken unless a safety risk is found.",
    });
  }

  function handleCorrect(note: string) {
    const now = new Date().toISOString();
    applyAction("Correction Added", { status: "Correction Added", timestamp: now, description: "Reporter added a correction note alongside the original report." }, "Correction note added by reporter.", { correctionNote: note });
    setShowCorrect(false);
    toast({ title: "Correction note added", description: "Your correction has been added alongside the original report." });
  }

  function handlePause() {
    const now = new Date().toISOString();
    applyAction("Paused by Reporter", { status: "Paused by Reporter", timestamp: now, description: "Support request paused by reporter using anonymous token." }, "Support request paused through token tracking page.");
    setShowPause(false);
    toast({ title: "Support request paused", description: "You can return anytime using your token to resume." });
  }

  function handleVerified() {
    const overrides = loadOverrides();
    const existing = overrides[submittedToken] ?? { status: localData?.status ?? "", timeline: localData?.timeline ?? [], auditLog: [] };
    writeOverride(submittedToken, { ...existing, verificationStatus: "verified" });
    setLocalData((prev) => prev ? { ...prev, verificationStatus: "verified" } : prev);
    toast({ title: "Trust seal applied", description: "Verified Identity — Hidden seal added to your report." });
  }

  // Action availability
  const isAlreadyTerminal = localData ? BLOCKED_BY_STATUS.some((s) => localData.status === s) : false;
  const isWithdrawnOrPaused = localData ? ["Withdrawn by Reporter", "Paused by Reporter", "Withdrawal Review Requested"].includes(localData.status) : false;
  const isHighRisk = localData ? ["L3", "L4"].includes(localData.severity) : false;
  const canWithdraw = !!localData && !isAlreadyTerminal && !isWithdrawnOrPaused && !isHighRisk;
  const canRequestReview = !!localData && !isAlreadyTerminal && isHighRisk && localData.status !== "Withdrawal Review Requested";
  const canCorrect = !!localData && !["Withdrawn by Reporter", "Case Closed", "Withdrawal Approved After Review"].includes(localData.status);
  const canPause = !!localData && !["Paused by Reporter", "Withdrawn by Reporter", "Case Closed"].includes(localData.status);
  const canVerify = !!localData && localData.verificationStatus !== "verified";

  const sampleTokens = [
    { token: "AWZ-4821-K", label: "L2 · Bullying · Patna" },
    { token: "AWZ-9134-M", label: "L3 · Mental Distress · Gopalganj" },
    { token: "AWZ-7062-X", label: "L4 · Self-Harm Risk · Muzaffarpur" },
    { token: "AWZ-2258-P", label: "L1 · Institutional Pressure · Gaya" },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      {showWithdraw && localData && <WithdrawModal severity={localData.severity} onClose={() => setShowWithdraw(false)} onConfirm={handleWithdraw} />}
      {showCorrect && <CorrectModal onClose={() => setShowCorrect(false)} onConfirm={handleCorrect} />}
      {showPause && <PauseModal onClose={() => setShowPause(false)} onConfirm={handlePause} />}
      {showVerify && <VerifyModal onClose={() => setShowVerify(false)} onVerified={handleVerified} />}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Track Your Report</h1>
          <p className="text-muted-foreground text-sm">Enter your token to check status, manage actions, and update your report. No account needed.</p>
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-xs text-amber-700 font-medium">Demo — uses mock and locally-stored data only</span>
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              data-testid="input-token"
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="e.g. AWZ-4821-K"
              className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground uppercase"
            />
            <button
              data-testid="button-track-search"
              type="submit"
              disabled={inputToken.trim().length < 5}
              className="flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors whitespace-nowrap text-sm"
            >
              <Search className="w-4 h-4" /> Track
            </button>
          </form>
          <div className="mt-5">
            <p className="text-xs text-muted-foreground mb-3">Try a demo token:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleTokens.map((t) => (
                <button
                  key={t.token}
                  data-testid={`button-sample-token-${t.token}`}
                  onClick={() => { setInputToken(t.token); setSubmittedToken(t.token); setLocalData(null); setNotFound(false); }}
                  className="flex items-center justify-between text-xs px-3 py-2.5 rounded-lg bg-muted hover:bg-muted-foreground/10 text-secondary border border-border transition-colors text-left"
                >
                  <span className="font-mono font-bold">{t.token}</span>
                  <span className="text-muted-foreground ml-2">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Looking up your report...</p>
          </div>
        )}

        {/* Not found */}
        {notFound && !isLoading && (
          <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm text-center">
            <AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-secondary mb-2">Token not found</h3>
            <p className="text-muted-foreground text-sm">
              No demo report found for <span className="font-mono font-bold">{submittedToken}</span>. Submit a report first or use one of the demo tokens above.
            </p>
          </div>
        )}

        {/* Report data */}
        {localData && !isLoading && (
          <div className="space-y-4">
            {/* Status Card */}
            <div className={`bg-card border border-card-border rounded-2xl p-6 shadow-sm ${localData.severity === "L4" ? "border-l-4 border-l-red-500" : ""}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider">Report Token</p>
                  <p data-testid="text-tracked-token" className="font-black text-secondary text-xl font-mono">{localData.token}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider">Status</p>
                  <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${
                    localData.status.includes("Withdrawn") ? "bg-amber-100 border border-amber-200"
                    : localData.status === "Paused by Reporter" ? "bg-gray-100 border border-gray-200"
                    : localData.status === "Withdrawal Review Requested" ? "bg-orange-100 border border-orange-200"
                    : "bg-primary/10 border border-primary/20"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      localData.status.includes("Withdrawn") ? "bg-amber-500"
                      : localData.status === "Paused by Reporter" ? "bg-gray-400"
                      : localData.status === "Withdrawal Review Requested" ? "bg-orange-500"
                      : "bg-primary animate-pulse"
                    }`} />
                    <span className={`text-xs font-semibold ${
                      localData.status.includes("Withdrawn") ? "text-amber-800"
                      : localData.status === "Paused by Reporter" ? "text-gray-600"
                      : localData.status === "Withdrawal Review Requested" ? "text-orange-800"
                      : "text-primary"
                    }`}>{localData.status}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border mb-4">
                <div><p className="text-xs text-muted-foreground mb-0.5">Category</p><p className="text-sm font-medium text-secondary">{localData.category}</p></div>
                <div><p className="text-xs text-muted-foreground mb-0.5">District</p><p className="text-sm font-medium text-secondary">{localData.district}</p></div>
                <div><p className="text-xs text-muted-foreground mb-0.5">Submitted</p><p className="text-sm font-medium text-secondary">{new Date(localData.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p></div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Severity</p>
                  <span className={`inline-flex text-xs font-bold px-2 py-0.5 rounded-full border ${SEVERITY_COLORS[localData.severity] ?? "bg-muted"}`}>{localData.severity}</span>
                </div>
              </div>

              {/* Trust / Verification Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Trust Status:</span>
                  {localData.verificationStatus === "verified" ? (
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 border border-green-200 rounded-full px-2.5 py-1 text-xs font-semibold">
                      <CheckCircle className="w-3 h-3" /> Verified Identity — Hidden
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1 text-xs font-medium">
                      <Lock className="w-3 h-3" /> Anonymous Report
                    </span>
                  )}
                </div>
                {canVerify && (
                  <button onClick={() => setShowVerify(true)} className="text-xs text-primary hover:underline font-medium">
                    Add Trust Verification Later — Demo
                  </button>
                )}
              </div>

              {/* Withdrawal info */}
              {localData.withdrawalReason && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  <p className="font-semibold mb-0.5">Withdrawal Reason: {localData.withdrawalReason}</p>
                  {localData.withdrawalDate && <p className="text-amber-600 mt-0.5">Requested: {fmt(localData.withdrawalDate)}</p>}
                </div>
              )}

              {/* Correction note */}
              {localData.correctionNote && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
                  <p className="font-semibold mb-1">Correction Note (added by reporter):</p>
                  <p className="leading-relaxed">{localData.correctionNote}</p>
                </div>
              )}

              {/* User action buttons */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Options</p>
                {(canWithdraw || canRequestReview || canCorrect || canPause) ? (
                  <div className="flex flex-wrap gap-2">
                    {canWithdraw && (
                      <button onClick={() => setShowWithdraw(true)} className="flex items-center gap-1.5 text-xs font-medium px-4 py-2.5 rounded-xl border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors">
                        <X className="w-3.5 h-3.5" /> Withdraw Report
                      </button>
                    )}
                    {canRequestReview && (
                      <button onClick={() => setShowWithdraw(true)} className="flex items-center gap-1.5 text-xs font-medium px-4 py-2.5 rounded-xl border border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors">
                        <AlertTriangle className="w-3.5 h-3.5" /> Request Withdrawal Review
                      </button>
                    )}
                    {canCorrect && (
                      <button onClick={() => setShowCorrect(true)} className="flex items-center gap-1.5 text-xs font-medium px-4 py-2.5 rounded-xl border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
                        <Info className="w-3.5 h-3.5" /> Correct My Report
                      </button>
                    )}
                    {canPause && (
                      <button onClick={() => setShowPause(true)} className="flex items-center gap-1.5 text-xs font-medium px-4 py-2.5 rounded-xl border border-border text-muted-foreground bg-muted hover:bg-muted-foreground/10 transition-colors">
                        <Clock className="w-3.5 h-3.5" /> Pause Support Request
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No further actions available for this report status.</p>
                )}
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  For serious safety concerns or emergency situations, Awaaz Setu may require authorized review regardless of reporter preferences.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-secondary text-sm uppercase tracking-wider mb-6">Status Timeline</h3>
              <div className="space-y-0">
                {localData.timeline.map((event, i) => (
                  <TimelineEvent key={i} event={event} isLast={i === localData.timeline.length - 1} isLatest={i === localData.timeline.length - 1} />
                ))}
              </div>
            </div>

            {/* Privacy note */}
            <div className="bg-accent/40 border border-accent-border rounded-xl p-4 flex items-start gap-3">
              <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground leading-relaxed">
                Your identity remains completely anonymous throughout this process. The moderator team cannot see who you are — only the content and token of your report. Trust verification, if added, is not visible to the public or normal dashboard view.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
