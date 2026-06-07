import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import {
  FileText, AlertTriangle, CheckCircle, Clock, Eye, EyeOff, X,
  ChevronRight, Users, Activity, Search, Shield, Phone, Flag,
  ArrowRight, GitBranch, Lock, Info, Clipboard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimelineEvent {
  status: string;
  timestamp: string;
  description: string;
}
interface AuditEntry {
  action: string;
  timestamp: string;
  actor: string;
}
interface AdminReport {
  id: string;
  token: string;
  category: string;
  categoryLabel: string;
  district: string;
  submittedAt: string;
  severity: "L1" | "L2" | "L3" | "L4";
  status: string;
  statement: string;
  seriousness: string;
  supportPreference: string;
  evidenceFiles: string[];
  timeline: TimelineEvent[];
  auditLog: AuditEntry[];
  suggestedRouting: string[];
  riskNotes: string;
  fromUser?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_SUBMITTED = "awaaz_submitted_reports";
const LS_OVERRIDES = "awaaz_report_overrides";

const SEVERITY_CONFIG: Record<string, { label: string; classes: string; dot: string; border: string }> = {
  L1: { label: "L1 Low", classes: "bg-green-100 text-green-800 border-green-200", dot: "bg-green-500", border: "border-l-green-400" },
  L2: { label: "L2 Medium", classes: "bg-yellow-100 text-yellow-800 border-yellow-200", dot: "bg-yellow-500", border: "border-l-yellow-400" },
  L3: { label: "L3 High", classes: "bg-orange-100 text-orange-800 border-orange-200", dot: "bg-orange-500", border: "border-l-orange-400" },
  L4: { label: "L4 Critical", classes: "bg-red-100 text-red-800 border-red-200", dot: "bg-red-500", border: "border-l-red-500" },
};

const CHART_COLORS = ["hsl(201,78%,38%)", "hsl(38,85%,55%)", "hsl(4,75%,54%)", "hsl(140,60%,40%)", "hsl(270,55%,55%)", "hsl(180,55%,40%)"];

const ACTIONS: { id: string; label: string; newStatus: string; icon: typeof Users; style: string }[] = [
  { id: "route_counselor", label: "Route to Counselor", newStatus: "Routed to Counselor", icon: Users, style: "bg-primary text-white hover:bg-primary/90" },
  { id: "route_ngo", label: "Route to NGO Partner", newStatus: "Routed to NGO Partner", icon: GitBranch, style: "bg-indigo-600 text-white hover:bg-indigo-700" },
  { id: "escalate_district", label: "Escalate to District Committee", newStatus: "Escalated to District Committee", icon: AlertTriangle, style: "bg-orange-600 text-white hover:bg-orange-700" },
  { id: "suggest_cyber", label: "Suggest Cyber Crime Portal", newStatus: "Cyber Crime Portal Suggested", icon: Shield, style: "bg-teal-600 text-white hover:bg-teal-700" },
  { id: "suggest_telemanas", label: "Suggest Tele-MANAS", newStatus: "Tele-MANAS Referral Suggested", icon: Phone, style: "bg-rose-600 text-white hover:bg-rose-700" },
  { id: "need_details", label: "Mark — Need More Details", newStatus: "Need More Details Requested", icon: Info, style: "bg-card border border-card-border text-secondary hover:bg-muted" },
  { id: "under_review", label: "Mark — Under Review", newStatus: "Under Review", icon: Clock, style: "bg-card border border-card-border text-secondary hover:bg-muted" },
  { id: "resolved", label: "Mark — Resolved", newStatus: "Resolved", icon: CheckCircle, style: "bg-green-600 text-white hover:bg-green-700" },
  { id: "flag_suspicious", label: "Flag — Suspicious Report", newStatus: "Flagged — Suspicious Report", icon: Flag, style: "bg-card border border-red-200 text-red-700 hover:bg-red-50" },
  { id: "close_case", label: "Close Case", newStatus: "Case Closed", icon: X, style: "bg-card border border-card-border text-muted-foreground hover:bg-muted" },
];

// ─── Base Mock Reports ────────────────────────────────────────────────────────

const BASE_REPORTS: AdminReport[] = [
  {
    id: "AWZ-4821-K",
    token: "AWZ-4821-K",
    category: "bullying",
    categoryLabel: "Bullying",
    district: "Patna, Bihar",
    submittedAt: "2024-12-10T09:15:00Z",
    severity: "L2",
    status: "Under Review",
    statement:
      "I have been experiencing consistent bullying from a group of classmates for the past three months. They exclude me from group activities, spread false rumors about me online, and have begun following me after school hours. I have not told teachers because I fear retaliation.",
    seriousness: "I feel unsafe",
    supportPreference: "Token-based updates only",
    evidenceFiles: ["screenshot_chat_01.png", "audio_note.mp3"],
    timeline: [
      { status: "Report Received", timestamp: "2024-12-10T09:15:00Z", description: "Anonymous report securely received and logged." },
      { status: "Severity Assigned: L2", timestamp: "2024-12-10T14:00:00Z", description: "Assessed as Level 2 (Medium) by trained moderator." },
      { status: "Moderator Review Started", timestamp: "2024-12-11T08:30:00Z", description: "Case assigned to moderator for detailed review." },
    ],
    auditLog: [
      { action: "Report received and logged", timestamp: "2024-12-10T09:15:00Z", actor: "System" },
      { action: "Severity assessment completed — L2", timestamp: "2024-12-10T14:00:00Z", actor: "Moderator-A" },
      { action: "Report opened by District Officer", timestamp: "2024-12-11T09:00:00Z", actor: "District Officer" },
    ],
    suggestedRouting: ["Institution Anti-Bullying Committee", "Verified Counselor", "District Youth Safety Contact"],
    riskNotes: "Persistent pattern over 3 months. Offline following indicates potential physical risk escalation.",
  },
  {
    id: "AWZ-9134-M",
    token: "AWZ-9134-M",
    category: "mental_distress",
    categoryLabel: "Mental Distress",
    district: "Gopalganj, Bihar",
    submittedAt: "2024-12-08T16:42:00Z",
    severity: "L3",
    status: "Routed to Counselor",
    statement:
      "I have been feeling extremely overwhelmed with academic pressure and family expectations. I am unable to sleep, losing interest in food and daily activities, and feel a constant sense of hopelessness. I do not know who to speak to and feel very alone.",
    seriousness: "I need guidance",
    supportPreference: "I want counselor support",
    evidenceFiles: ["statement.pdf"],
    timeline: [
      { status: "Report Received", timestamp: "2024-12-08T16:42:00Z", description: "Anonymous report securely received." },
      { status: "Severity Assigned: L3", timestamp: "2024-12-08T19:00:00Z", description: "Assessed as Level 3 (High) — priority review triggered." },
      { status: "Routed to Verified Counselor", timestamp: "2024-12-09T09:00:00Z", description: "Case routed to a verified mental health counselor." },
      { status: "Follow-up Recommended", timestamp: "2024-12-10T11:00:00Z", description: "Counselor recommends follow-up session within 48 hours." },
    ],
    auditLog: [
      { action: "Report received and logged", timestamp: "2024-12-08T16:42:00Z", actor: "System" },
      { action: "High priority flag set", timestamp: "2024-12-08T19:00:00Z", actor: "Moderator-B" },
      { action: "Routed to counselor network", timestamp: "2024-12-09T09:00:00Z", actor: "District Officer" },
      { action: "Status changed to Routed to Counselor", timestamp: "2024-12-09T09:00:00Z", actor: "District Officer" },
    ],
    suggestedRouting: ["Tele-MANAS (14416)", "Verified Counselor", "iCall (9152987821)"],
    riskNotes: "Prolonged mental distress. Sleep disruption and appetite loss noted. No immediate self-harm indicators but prompt support is critical.",
  },
  {
    id: "AWZ-7062-X",
    token: "AWZ-7062-X",
    category: "self_harm_risk",
    categoryLabel: "Self-Harm Risk",
    district: "Muzaffarpur, Bihar",
    submittedAt: "2024-12-13T22:05:00Z",
    severity: "L4",
    status: "Urgent Protocol Suggested",
    statement:
      "I am going through an extremely difficult time and I have been thinking about harming myself. I feel like no one understands and there is no way out. I am sharing this because I do not know what else to do. Please help.",
    seriousness: "I feel like harming myself",
    supportPreference: "I need urgent support guidance",
    evidenceFiles: [],
    timeline: [
      { status: "Report Received", timestamp: "2024-12-13T22:05:00Z", description: "Anonymous report received. L4 crisis protocol triggered." },
      { status: "Severity Assigned: L4", timestamp: "2024-12-13T22:15:00Z", description: "Assessed as Level 4 (Critical). Immediate protocol activated." },
      { status: "Emergency Support Notice Triggered", timestamp: "2024-12-13T22:30:00Z", description: "Crisis notice sent. Tele-MANAS and district protection channels notified." },
      { status: "Escalation Protocol Suggested", timestamp: "2024-12-14T08:00:00Z", description: "District-level escalation recommended. Counselor coordination in progress." },
    ],
    auditLog: [
      { action: "Critical L4 flag auto-set by system", timestamp: "2024-12-13T22:15:00Z", actor: "System" },
      { action: "Emergency protocol triggered", timestamp: "2024-12-13T22:30:00Z", actor: "System" },
      { action: "District officer notified", timestamp: "2024-12-14T07:00:00Z", actor: "Moderator-A" },
      { action: "Report opened by District Officer", timestamp: "2024-12-14T08:00:00Z", actor: "District Officer" },
    ],
    suggestedRouting: ["Tele-MANAS (14416) — URGENT", "Emergency Services (112)", "Vandrevala Foundation (+91 9999 666 555)", "District Protection Officer"],
    riskNotes: "CRITICAL: Self-harm ideation explicitly stated. Immediate crisis support required. Do not delay. Authorized escalation protocol must be followed.",
  },
  {
    id: "AWZ-2258-P",
    token: "AWZ-2258-P",
    category: "institutional_pressure",
    categoryLabel: "Institutional Pressure",
    district: "Gaya, Bihar",
    submittedAt: "2024-12-14T10:20:00Z",
    severity: "L1",
    status: "Resources Shared",
    statement:
      "My college administration is pressuring me to withdraw my representation in a student body election. I feel this is unfair but I do not know how to raise it officially without risking my academic standing.",
    seriousness: "I only want to share safely",
    supportPreference: "I want to stay fully anonymous",
    evidenceFiles: ["call_log.txt"],
    timeline: [
      { status: "Report Received", timestamp: "2024-12-14T10:20:00Z", description: "Anonymous report securely received." },
      { status: "Severity Assigned: L1", timestamp: "2024-12-14T12:00:00Z", description: "Assessed as Level 1 (Low). Support resources being prepared." },
      { status: "Resources Shared", timestamp: "2024-12-14T14:30:00Z", description: "Student rights and institutional grievance resources shared." },
    ],
    auditLog: [
      { action: "Report received and logged", timestamp: "2024-12-14T10:20:00Z", actor: "System" },
      { action: "Low severity assessment completed", timestamp: "2024-12-14T12:00:00Z", actor: "Moderator-C" },
      { action: "Resources and guidance document shared", timestamp: "2024-12-14T14:30:00Z", actor: "Moderator-C" },
    ],
    suggestedRouting: ["Moderator Review", "Student Grievance Portal", "Legal Advisor (if escalated)"],
    riskNotes: "Low urgency. User seeking guidance on formal process. No physical risk indicated.",
  },
  {
    id: "AWZ-6681-B",
    token: "AWZ-6681-B",
    category: "cyber_blackmail",
    categoryLabel: "Cyber Blackmail",
    district: "Siwan, Bihar",
    submittedAt: "2024-12-12T14:35:00Z",
    severity: "L3",
    status: "Legal Guidance Suggested",
    statement:
      "An unknown person has accessed my private photos and is threatening to share them unless I comply with financial demands. This started two weeks ago and has escalated to daily messages through social media.",
    seriousness: "I am being threatened",
    supportPreference: "Token-based updates only",
    evidenceFiles: ["screenshot_chat_01.png", "screenshot_demand_message.png"],
    timeline: [
      { status: "Report Received", timestamp: "2024-12-12T14:35:00Z", description: "Anonymous report securely received." },
      { status: "Severity Assigned: L3", timestamp: "2024-12-12T17:00:00Z", description: "Assessed as Level 3 (High) — active cyber blackmail with threat." },
      { status: "Legal Guidance Suggested", timestamp: "2024-12-13T09:00:00Z", description: "Guidance provided: report to Cyber Crime Portal and consult legal advisor." },
    ],
    auditLog: [
      { action: "Report received and logged", timestamp: "2024-12-12T14:35:00Z", actor: "System" },
      { action: "Cyber blackmail pattern identified", timestamp: "2024-12-12T17:00:00Z", actor: "Moderator-A" },
      { action: "Legal guidance document shared", timestamp: "2024-12-13T09:00:00Z", actor: "Moderator-A" },
    ],
    suggestedRouting: ["Cyber Crime Portal (1930 / cybercrime.gov.in)", "Legal Advisor", "NGO Support"],
    riskNotes: "Active financial extortion with escalating pattern. Evidence preservation is critical. Cyber Crime Portal referral is priority action.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCategoryLabel(cat: string): string {
  const MAP: Record<string, string> = {
    bullying: "Bullying", ragging: "Ragging", cyber_blackmail: "Cyber Blackmail",
    institutional_pressure: "Institutional Pressure", bad_touch: "Bad Touch",
    mental_distress: "Mental Distress", self_harm_risk: "Self-Harm Risk", other: "Other",
    cyber_harassment: "Cyber Harassment", sexual_harassment: "Sexual Harassment",
    workplace_harassment: "Workplace Harassment", stalking: "Stalking", physical_threat: "Physical Threat",
  };
  return MAP[cat] ?? cat;
}

function getSuggestedRouting(category: string, severity: string): string[] {
  if (severity === "L4") return ["Tele-MANAS (14416) — URGENT", "Emergency Services (112)", "Vandrevala Foundation", "District Protection Officer"];
  if (category.includes("mental") || category.includes("distress") || category.includes("self_harm")) return ["Tele-MANAS (14416)", "Verified Counselor", "iCall (9152987821)"];
  if (category.includes("cyber")) return ["Cyber Crime Portal (1930 / cybercrime.gov.in)", "Legal Advisor", "NGO Support"];
  if (category.includes("touch") || category.includes("sexual") || category.includes("harassment")) return ["NGO Partner", "Legal Advisor", "Women Helpline (181)"];
  if (category.includes("bullying") || category.includes("ragging")) return ["Institution Anti-Bullying Committee", "Verified Counselor", "District Youth Safety Contact"];
  if (category.includes("institutional")) return ["Moderator Review", "Legal Advisor", "District Committee (if escalated)"];
  return ["Verified Counselor", "Awareness Resources", "Student Support Desk"];
}

function computeSeverity(category: string, seriousness: string): AdminReport["severity"] {
  const s = seriousness.toLowerCase();
  if (s.includes("harming myself") || s.includes("immediate danger")) return "L4";
  if (category === "bad_touch" || category === "ragging" || category === "self_harm_risk") return "L3";
  if ((category === "cyber_blackmail" || category === "bullying" || category === "mental_distress") && (s.includes("threatened") || s.includes("unsafe"))) return "L3";
  if (category === "cyber_blackmail" || category === "bullying" || category === "mental_distress" || category === "cyber_harassment" || category === "sexual_harassment") return "L2";
  return "L1";
}

function loadLocalSubmitted(): AdminReport[] {
  try {
    const raw = localStorage.getItem(LS_SUBMITTED);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Array<Record<string, unknown>>;
    return arr.map((r) => {
      const cat = (r.category as string) ?? "other";
      const seriousness = (r.seriousness as string) ?? "I only want to share safely";
      const severity = computeSeverity(cat, seriousness);
      const categoryLabel = getCategoryLabel(cat);
      const token = (r.token as string) ?? "";
      const submittedAt = (r.submittedAt as string) ?? new Date().toISOString();
      const evidenceFiles = (r.evidenceFiles as string[]) ?? [];
      return {
        id: token,
        token,
        category: cat,
        categoryLabel,
        district: (r.district as string) ?? "Not specified",
        submittedAt,
        severity,
        status: "Report Received",
        statement: (r.statement as string) ?? "",
        seriousness,
        supportPreference: (r.supportPreference as string) ?? "Token-based updates only",
        evidenceFiles,
        timeline: [
          { status: "Report Received", timestamp: submittedAt, description: "Anonymous report submitted via Awaaz Setu Report Form." },
          { status: `Severity Assigned: ${severity}`, timestamp: new Date(new Date(submittedAt).getTime() + 30 * 60000).toISOString(), description: `Auto-assessed as ${severity} based on category and seriousness.` },
        ],
        auditLog: [
          { action: "Report submitted via user form", timestamp: submittedAt, actor: "System" },
          { action: `Severity ${severity} auto-assigned`, timestamp: new Date(new Date(submittedAt).getTime() + 30 * 60000).toISOString(), actor: "System" },
        ],
        suggestedRouting: getSuggestedRouting(cat, severity),
        riskNotes: severity === "L4" ? "CRITICAL: Self-harm ideation detected. Immediate authorized protocol required." : severity === "L3" ? "High severity. Priority review and support routing required." : "Standard review.",
        fromUser: true,
      } as AdminReport;
    });
  } catch {
    return [];
  }
}

interface Overrides {
  [id: string]: {
    status: string;
    timeline: TimelineEvent[];
    auditLog: AuditEntry[];
  };
}

function loadOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(LS_OVERRIDES);
    return raw ? (JSON.parse(raw) as Overrides) : {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Overrides) {
  localStorage.setItem(LS_OVERRIDES, JSON.stringify(overrides));
}

function applyOverrides(reports: AdminReport[], overrides: Overrides): AdminReport[] {
  return reports.map((r) => {
    const ov = overrides[r.id];
    if (!ov) return r;
    return { ...r, status: ov.status, timeline: ov.timeline, auditLog: ov.auditLog };
  });
}

function fmt(ts: string) {
  return new Date(ts).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Small Components ─────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const cfg = SEVERITY_CONFIG[severity] ?? { label: severity, classes: "bg-muted text-muted-foreground border-border", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: typeof FileText; label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-black text-secondary mb-0.5">{value}</div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      {sub && <div className="text-xs text-muted-foreground/60 mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function ReportDetailModal({
  report,
  onClose,
  onAction,
}: {
  report: AdminReport;
  onClose: () => void;
  onAction: (id: string, newStatus: string, label: string) => void;
}) {
  const [statementVisible, setStatementVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "timeline" | "audit">("details");
  const isL4 = report.severity === "L4";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-card-border rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b border-border ${isL4 ? "bg-red-50 border-red-200" : ""}`}>
          <div className="flex items-center gap-3">
            {isL4 && <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />}
            <div>
              <h2 className="font-bold text-secondary">Report Detail</h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">{report.token}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* L4 Alert */}
        {isL4 && (
          <div className="mx-5 mt-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-800">Critical case. Immediate authorized escalation protocol may be required.</p>
              <p className="text-xs text-red-700 mt-0.5">Awaaz Setu is not an emergency response service. In immediate danger, emergency services or verified crisis support must be contacted.</p>
            </div>
          </div>
        )}

        {/* Demo disclaimer */}
        <div className="mx-5 mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-800">Demo-only admin view. In production, evidence access must be role-based, encrypted, audited, and legally reviewed.</p>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-4 flex gap-1 border-b border-border">
          {(["details", "timeline", "audit"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg capitalize transition-colors ${activeTab === t ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            >
              {t === "audit" ? "Audit Log" : t === "timeline" ? "Timeline" : "Details"}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === "details" && (
            <>
              {/* Meta grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Category", value: report.categoryLabel },
                  { label: "District", value: report.district },
                  { label: "Submitted", value: new Date(report.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) },
                  { label: "Status", value: report.status },
                ].map((item) => (
                  <div key={item.label} className="bg-muted/40 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-xs font-semibold text-secondary leading-snug">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Severity + seriousness + support */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1.5">Severity Level</p>
                  <SeverityBadge severity={report.severity} />
                </div>
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Seriousness</p>
                  <p className="text-xs font-medium text-secondary">{report.seriousness}</p>
                </div>
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Support Preference</p>
                  <p className="text-xs font-medium text-secondary">{report.supportPreference}</p>
                </div>
              </div>

              {/* Statement */}
              <div className="bg-muted/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Anonymous Statement</p>
                  <button
                    onClick={() => setStatementVisible(!statementVisible)}
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    {statementVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {statementVisible ? "Hide" : "View Statement"}
                  </button>
                </div>
                {statementVisible ? (
                  <p className="text-sm text-foreground leading-relaxed">{report.statement || "(No statement provided)"}</p>
                ) : (
                  <div className="h-10 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Click "View Statement" to reveal anonymised content</p>
                  </div>
                )}
              </div>

              {/* Evidence */}
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Evidence Files</p>
                {report.evidenceFiles.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No evidence submitted</p>
                ) : (
                  <>
                    <div className="space-y-2">
                      {report.evidenceFiles.map((f) => (
                        <div key={f} className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-2.5">
                          <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-foreground flex-1">{f}</span>
                          <span className="text-xs text-muted-foreground italic">Demo reference only</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Evidence files shown here are mock/demo references only. No real file has been uploaded.</p>
                  </>
                )}
              </div>

              {/* Suggested Routing */}
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Suggested Routing</p>
                <div className="flex flex-wrap gap-2">
                  {report.suggestedRouting.map((r) => (
                    <span key={r} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium">
                      <ArrowRight className="w-3 h-3" />
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Risk Notes */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800 mb-0.5">Risk Assessment Notes</p>
                  <p className="text-xs text-amber-700 leading-relaxed">{report.riskNotes}</p>
                </div>
              </div>
            </>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-0">
              {report.timeline.map((ev, i) => (
                <div key={i} className="flex gap-4 pb-5">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${i === report.timeline.length - 1 ? "border-primary bg-primary" : "border-green-500 bg-green-500"}`}>
                      {i === report.timeline.length - 1 ? <Clock className="w-3.5 h-3.5 text-white" /> : <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                    {i < report.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-secondary text-sm">{ev.status}</p>
                    <p className="text-xs text-muted-foreground mb-1">{fmt(ev.timestamp)}</p>
                    <p className="text-xs text-foreground leading-relaxed">{ev.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "audit" && (
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mb-4">
                <Clipboard className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs text-amber-800 font-medium">Demo Audit Log — local only, not persistent across sessions</span>
              </div>
              <div className="space-y-2">
                {report.auditLog.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 bg-muted/30 rounded-xl px-4 py-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-secondary font-medium">{entry.action}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{fmt(entry.timestamp)}</span>
                        <span className="text-xs text-primary font-medium">— {entry.actor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-border p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Admin Actions</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a.id}
                onClick={() => onAction(report.id, a.newStatus, a.label)}
                className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors ${a.style}`}
              >
                <a.icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-center leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────

type View = "dashboard" | "all" | "critical" | "resolved";

export function Admin() {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [allReports, setAllReports] = useState<AdminReport[]>([]);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Load data on mount
  useEffect(() => {
    const submitted = loadLocalSubmitted();
    const ov = loadOverrides();
    // Merge: base + user-submitted (user overrides base if same token, unlikely but safe)
    const submittedIds = new Set(submitted.map((r) => r.id));
    const base = BASE_REPORTS.filter((r) => !submittedIds.has(r.id));
    const merged = applyOverrides([...base, ...submitted], ov);
    setAllReports(merged);
    setOverrides(ov);
  }, []);

  // Refresh when window gets focus (user may have just submitted a report)
  useEffect(() => {
    function onFocus() {
      const submitted = loadLocalSubmitted();
      const ov = loadOverrides();
      const submittedIds = new Set(submitted.map((r) => r.id));
      const base = BASE_REPORTS.filter((r) => !submittedIds.has(r.id));
      const merged = applyOverrides([...base, ...submitted], ov);
      setAllReports(merged);
      setOverrides(ov);
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  function handleAction(id: string, newStatus: string, label: string) {
    const now = new Date().toISOString();
    setAllReports((prev) => {
      const updated = prev.map((r) => {
        if (r.id !== id) return r;
        const newTimeline: TimelineEvent[] = [
          ...r.timeline,
          { status: newStatus, timestamp: now, description: `Admin action taken: ${label}.` },
        ];
        const newAuditLog: AuditEntry[] = [
          ...r.auditLog,
          { action: `Status changed to "${newStatus}"`, timestamp: now, actor: "District Officer (Demo)" },
        ];
        const updated = { ...r, status: newStatus, timeline: newTimeline, auditLog: newAuditLog };
        // Persist override
        const newOv: Overrides = {
          ...overrides,
          [id]: { status: newStatus, timeline: newTimeline, auditLog: newAuditLog },
        };
        setOverrides(newOv);
        saveOverrides(newOv);
        return updated;
      });
      // Update selectedReport if open
      if (selectedReport?.id === id) {
        const newSel = updated.find((r) => r.id === id);
        if (newSel) setSelectedReport(newSel);
      }
      return updated;
    });
    toast({ title: `Report ${id}`, description: `${label} — status updated.` });
    setSelectedReport(null);
  }

  // Analytics
  const stats = useMemo(() => {
    const total = allReports.length;
    const critical = allReports.filter((r) => r.severity === "L4" && !["Resolved", "Case Closed"].includes(r.status)).length;
    const resolved = allReports.filter((r) => ["Resolved", "Case Closed", "Action Completed", "Resources Shared"].includes(r.status)).length;
    const pending = allReports.filter((r) => ["Report Received", "Need More Details Requested"].includes(r.status)).length;
    const routed = allReports.filter((r) => r.status.toLowerCase().includes("routed") || r.status.toLowerCase().includes("escalated") || r.status.toLowerCase().includes("suggested")).length;
    const flagged = allReports.filter((r) => r.status.toLowerCase().includes("flagged")).length;

    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = { L1: 0, L2: 0, L3: 0, L4: 0 };
    const byDistrict: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    allReports.forEach((r) => {
      byCategory[r.categoryLabel] = (byCategory[r.categoryLabel] ?? 0) + 1;
      bySeverity[r.severity] = (bySeverity[r.severity] ?? 0) + 1;
      const d = r.district.split(",")[0];
      byDistrict[d] = (byDistrict[d] ?? 0) + 1;
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    });

    const categoryData = Object.entries(byCategory).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
    const severityData = Object.entries(bySeverity).map(([name, count]) => ({ name, count }));
    const districtData = Object.entries(byDistrict).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6);
    const statusData = Object.entries(byStatus).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);

    return { total, critical, resolved, pending, routed, flagged, categoryData, severityData, districtData, statusData };
  }, [allReports]);

  // Filtered + sorted reports for table
  const tableReports = useMemo(() => {
    let r = [...allReports];
    if (activeView === "critical") r = r.filter((x) => x.severity === "L4" || x.severity === "L3");
    if (activeView === "resolved") r = r.filter((x) => ["Resolved", "Case Closed", "Action Completed", "Resources Shared"].includes(x.status));
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((x) => x.token.toLowerCase().includes(q) || x.categoryLabel.toLowerCase().includes(q) || x.district.toLowerCase().includes(q));
    }
    if (filterSeverity) r = r.filter((x) => x.severity === filterSeverity);
    if (filterStatus) r = r.filter((x) => x.status === filterStatus);
    r.sort((a, b) => {
      const ta = new Date(a.submittedAt).getTime();
      const tb = new Date(b.submittedAt).getTime();
      return sortDir === "desc" ? tb - ta : ta - tb;
    });
    return r;
  }, [allReports, activeView, search, filterSeverity, filterStatus, sortDir]);

  const allStatuses = useMemo(() => Array.from(new Set(allReports.map((r) => r.status))), [allReports]);

  const sidebarItems: { id: View; label: string; icon: typeof Activity; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "all", label: "All Reports", icon: FileText, badge: stats.total },
    { id: "critical", label: "Critical Cases", icon: AlertTriangle, badge: stats.critical },
    { id: "resolved", label: "Resolved", icon: CheckCircle, badge: stats.resolved },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onAction={handleAction}
        />
      )}

      {/* Demo Banner */}
      <div className="bg-amber-600 text-white text-xs text-center py-2 px-4 font-medium">
        Demo Admin Panel — For district officer, NGO, legal advisor, and funding stakeholder preview only. Not production-ready.
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 min-h-screen bg-sidebar border-r border-sidebar-border sticky top-0 h-screen">
          <div className="p-5 border-b border-sidebar-border">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-sidebar-foreground/60" />
              <p className="text-sidebar-foreground/50 text-xs uppercase tracking-widest">Admin Portal</p>
            </div>
            <p className="text-sidebar-foreground font-bold text-sm">District Officer</p>
            <div className="inline-flex items-center gap-1.5 mt-2 bg-green-500/20 border border-green-400/30 rounded-full px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 text-xs font-medium">Demo Live</span>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeView === item.id
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${item.id === "critical" && item.badge > 0 ? "bg-red-500 text-white" : "bg-sidebar-foreground/20 text-sidebar-foreground/70"}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-sidebar-border">
            <div className="bg-sidebar-accent rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Lock className="w-3 h-3 text-sidebar-foreground/40" />
                <p className="text-sidebar-foreground/40 text-xs">Demo Mode</p>
              </div>
              <p className="text-sidebar-foreground/60 text-xs leading-relaxed">All actions are local. No real data is stored on any server.</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top Bar */}
          <div className="border-b border-border bg-card px-6 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-8 z-10">
            <div>
              <h1 className="font-bold text-secondary capitalize">
                {activeView === "dashboard" ? "Dashboard Overview" : activeView === "all" ? "All Reports" : activeView === "critical" ? "Critical Cases" : "Resolved Cases"}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">Awaaz Setu — District Admin Panel · {stats.total} total reports</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile sidebar links */}
              <div className="flex md:hidden gap-1">
                {sidebarItems.map((item) => (
                  <button key={item.id} onClick={() => setActiveView(item.id)}
                    className={`px-2 py-1.5 rounded text-xs font-medium ${activeView === item.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                    {item.label.split(" ")[0]}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-800 text-xs font-medium">System Live</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {/* Stat Cards — always visible */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <StatCard icon={FileText} label="Total Reports" value={stats.total} sub="All time" color="bg-primary/10 text-primary" />
              <StatCard icon={AlertTriangle} label="Active Critical" value={stats.critical} sub="L4 active" color="bg-red-100 text-red-600" />
              <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved} sub="Cases closed" color="bg-green-100 text-green-600" />
              <StatCard icon={Clock} label="Pending Triage" value={stats.pending} sub="Awaiting review" color="bg-yellow-100 text-yellow-600" />
              <StatCard icon={ArrowRight} label="Cases Routed" value={stats.routed} sub="Support connected" color="bg-blue-100 text-blue-600" />
              <StatCard icon={Flag} label="Flagged Reports" value={stats.flagged} sub="Suspicious review" color="bg-purple-100 text-purple-600" />
            </div>

            {/* Charts — only on Dashboard view */}
            {activeView === "dashboard" && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-secondary text-sm mb-0.5">Reports by Category</h3>
                  <p className="text-xs text-muted-foreground mb-4">Incident type distribution</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={stats.categoryData} margin={{ left: -20 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} cursor={{ fill: "hsl(216,20%,93%)" }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {stats.categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-secondary text-sm mb-0.5">Severity Breakdown</h3>
                  <p className="text-xs text-muted-foreground mb-4">Report distribution by level</p>
                  <div className="space-y-3">
                    {stats.severityData.map((sv, i) => {
                      const total = stats.total || 1;
                      const pct = (sv.count / total) * 100;
                      const clr = ["bg-green-500", "bg-yellow-400", "bg-orange-500", "bg-red-600"][i];
                      return (
                        <div key={sv.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-secondary">{sv.name}</span>
                            <span className="text-sm font-bold text-secondary">{sv.count}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className={`h-2 rounded-full transition-all ${clr}`} style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{pct.toFixed(1)}%</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-secondary text-sm mb-0.5">Reports by District</h3>
                  <p className="text-xs text-muted-foreground mb-4">Top 6 districts</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={stats.districtData} layout="vertical" margin={{ left: 10, right: 10 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={60} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} cursor={{ fill: "hsl(216,20%,93%)" }} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="hsl(201,78%,38%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-secondary text-sm mb-0.5">Status Breakdown</h3>
                  <p className="text-xs text-muted-foreground mb-4">Current status distribution</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={stats.statusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 9 }}>
                        {stats.statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Reports Table */}
            <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="font-bold text-secondary text-sm flex-1">
                    {activeView === "critical" ? "Critical & High-Risk Cases" : activeView === "resolved" ? "Resolved Cases" : "Incoming Reports"}
                    {" "}
                    <span className="text-muted-foreground font-normal">({tableReports.length})</span>
                  </h3>
                  <button
                    onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors"
                  >
                    {sortDir === "desc" ? "Newest first" : "Oldest first"}
                  </button>
                </div>
                {/* Search + Filters */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-xl px-3 py-2 flex-1 min-w-[160px]">
                    <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search token, category, district…"
                      className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none flex-1"
                    />
                    {search && <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>}
                  </div>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="text-xs border border-border rounded-xl px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">All Severities</option>
                    <option value="L1">L1 — Low</option>
                    <option value="L2">L2 — Medium</option>
                    <option value="L3">L3 — High</option>
                    <option value="L4">L4 — Critical</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-xs border border-border rounded-xl px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">All Statuses</option>
                    {allStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {(search || filterSeverity || filterStatus) && (
                    <button onClick={() => { setSearch(""); setFilterSeverity(""); setFilterStatus(""); }}
                      className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-xl px-3 py-2 transition-colors">
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Token ID", "Category", "District", "Date", "Severity", "Status", "Action"].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tableReports.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground text-sm">
                          No reports match the current filters.
                        </td>
                      </tr>
                    ) : tableReports.map((report) => (
                      <tr
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        className={`hover:bg-muted/30 transition-colors cursor-pointer border-l-2 ${SEVERITY_CONFIG[report.severity]?.border ?? ""}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-secondary text-xs">{report.token}</span>
                            {report.fromUser && <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-1.5 py-0.5 font-medium">New</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-foreground text-xs">{report.categoryLabel}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{report.district}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {new Date(report.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </td>
                        <td className="px-4 py-3"><SeverityBadge severity={report.severity} /></td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground max-w-[120px] block truncate">{report.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }}
                            className="flex items-center gap-1 text-xs text-primary hover:underline font-medium whitespace-nowrap"
                          >
                            View <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Production Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Production Readiness Note:</strong> A production version must include secure login, role-based access control, encryption at rest and in transit, evidence access restrictions, immutable audit logs, legal review, verified counselor onboarding, and a government-approved escalation workflow. This demo is for evaluation purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
