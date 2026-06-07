import { Router, type IRouter } from "express";
import {
  GetAdminReportParams,
  RouteReportParams,
  RouteReportBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const MOCK_REPORTS = [
  {
    id: "rpt-001",
    token: "AWZ-4821-K",
    category: "Bullying",
    district: "Chennai, Tamil Nadu",
    submittedAt: "2024-12-10T09:15:00Z",
    severity: "L2",
    status: "Routed to Counselor",
    assignedTo: "Counselor Priya Nair",
    statement: "I have been consistently targeted by a group of seniors in my hostel. They mock my appearance, exclude me from activities, and have started spreading false rumors about me online. It has affected my ability to focus on studies and I am experiencing severe anxiety. I am afraid to report to the warden as the senior students have influence.",
    evidenceFiles: [
      { name: "screenshot_chat.png", type: "image/png", size: "1.2 MB" },
      { name: "voice_note.mp3", type: "audio/mpeg", size: "3.4 MB" },
    ],
    timeline: [
      { status: "Report Received", timestamp: "2024-12-10T09:15:00Z", description: "Report securely logged.", severity: null },
      { status: "Severity Assigned: L2", timestamp: "2024-12-10T14:00:00Z", description: "Assessed as L2 (Medium).", severity: "L2" },
      { status: "Routed to Counselor", timestamp: "2024-12-11T09:00:00Z", description: "Routed to Verified Counselor Priya Nair.", severity: "L2" },
    ],
  },
  {
    id: "rpt-002",
    token: "AWZ-7392-M",
    category: "Ragging",
    district: "Bengaluru, Karnataka",
    submittedAt: "2024-12-08T16:42:00Z",
    severity: "L4",
    status: "Action Completed",
    assignedTo: "District Anti-Ragging Committee",
    statement: "On multiple occasions over the past two weeks, senior students have forced me to perform humiliating tasks late at night. I was made to stand for hours, denied sleep, and physically handled. I fear retaliation if I complain officially. Several other juniors are facing the same.",
    evidenceFiles: [
      { name: "incident_report.pdf", type: "application/pdf", size: "524 KB" },
    ],
    timeline: [
      { status: "Report Received", timestamp: "2024-12-08T16:42:00Z", description: "Report securely logged.", severity: null },
      { status: "Severity Assigned: L4", timestamp: "2024-12-08T18:00:00Z", description: "Assessed as L4 (Critical).", severity: "L4" },
      { status: "Escalated to District Committee", timestamp: "2024-12-09T08:30:00Z", description: "Escalated under UGC Regulations.", severity: "L4" },
      { status: "Action Completed", timestamp: "2024-12-12T10:00:00Z", description: "Committee action completed.", severity: "L4" },
    ],
  },
  {
    id: "rpt-003",
    token: "AWZ-2847-P",
    category: "Mental Distress",
    district: "Pune, Maharashtra",
    submittedAt: "2024-12-13T08:20:00Z",
    severity: "L1",
    status: "Support Resources Shared",
    assignedTo: null,
    statement: "I have been under extreme pressure from my family regarding my exam results. I feel hopeless and isolated. I have not been sleeping properly for the past month. I do not have anyone to talk to.",
    evidenceFiles: [],
    timeline: [
      { status: "Report Received", timestamp: "2024-12-13T08:20:00Z", description: "Report securely logged.", severity: null },
      { status: "Severity Assigned: L1", timestamp: "2024-12-13T10:00:00Z", description: "Assessed as L1 (Low).", severity: "L1" },
      { status: "Support Resources Shared", timestamp: "2024-12-13T11:30:00Z", description: "Mental wellness resources shared.", severity: "L1" },
    ],
  },
  {
    id: "rpt-004",
    token: "AWZ-9156-R",
    category: "Cyber Blackmail",
    district: "Patna, Bihar",
    submittedAt: "2024-12-14T22:05:00Z",
    severity: "L3",
    status: "Pending Triage",
    assignedTo: null,
    statement: "Someone from my class has obtained private photos of me and is threatening to share them unless I comply with their demands. I am terrified and do not know what to do. I cannot tell my parents.",
    evidenceFiles: [
      { name: "threat_message.txt", type: "text/plain", size: "2 KB" },
    ],
    timeline: [
      { status: "Report Received", timestamp: "2024-12-14T22:05:00Z", description: "Report securely logged.", severity: null },
    ],
  },
  {
    id: "rpt-005",
    token: "AWZ-3312-G",
    category: "Institutional Pressure",
    district: "Mumbai, Maharashtra",
    submittedAt: "2024-12-12T14:30:00Z",
    severity: "L2",
    status: "Under Review",
    assignedTo: null,
    statement: "Our professor has been making comments that unfairly target certain students based on their background. Students who raise concerns are given lower marks. I have documented several such instances.",
    evidenceFiles: [
      { name: "grade_comparison.xlsx", type: "application/vnd.ms-excel", size: "89 KB" },
      { name: "class_notes_photo.jpg", type: "image/jpeg", size: "2.1 MB" },
    ],
    timeline: [
      { status: "Report Received", timestamp: "2024-12-12T14:30:00Z", description: "Report securely logged.", severity: null },
      { status: "Severity Assigned: L2", timestamp: "2024-12-12T16:00:00Z", description: "Assessed as L2 (Medium).", severity: "L2" },
    ],
  },
  {
    id: "rpt-006",
    token: "AWZ-6601-T",
    category: "Bad Touch",
    district: "Delhi",
    submittedAt: "2024-12-11T19:10:00Z",
    severity: "L4",
    status: "Escalated",
    assignedTo: "District Child Protection Officer",
    statement: "A staff member at my school has been making me uncomfortable with inappropriate physical contact during after-school activities. I am scared to tell anyone at school.",
    evidenceFiles: [],
    timeline: [
      { status: "Report Received", timestamp: "2024-12-11T19:10:00Z", description: "Report securely logged.", severity: null },
      { status: "Severity Assigned: L4", timestamp: "2024-12-11T20:00:00Z", description: "Assessed as L4 (Critical).", severity: "L4" },
      { status: "Escalated to District Committee", timestamp: "2024-12-12T08:00:00Z", description: "Routed to District Child Protection Officer.", severity: "L4" },
    ],
  },
];

router.get("/admin/reports", async (_req, res): Promise<void> => {
  const summaries = MOCK_REPORTS.map(({ id, token, category, district, submittedAt, severity, status, assignedTo }) => ({
    id, token, category, district, submittedAt, severity, status, assignedTo,
  }));
  res.json(summaries);
});

router.get("/admin/reports/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetAdminReportParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: "Invalid report ID" });
    return;
  }

  const report = MOCK_REPORTS.find((r) => r.id === params.data.id);
  if (!report) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  res.json(report);
});

router.post("/admin/reports/:id/route", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = RouteReportParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: "Invalid report ID" });
    return;
  }

  const body = RouteReportBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const report = MOCK_REPORTS.find((r) => r.id === params.data.id);
  if (!report) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  const actionMap: Record<string, { status: string; assignedTo: string }> = {
    route_counselor: { status: "Routed to Counselor", assignedTo: "Verified Counselor (Auto-assigned)" },
    escalate_district: { status: "Escalated", assignedTo: "District Committee" },
  };

  const update = actionMap[body.data.action] ?? { status: "Updated", assignedTo: report.assignedTo ?? "" };
  report.status = update.status;
  report.assignedTo = update.assignedTo;

  const { id, token, category, district, submittedAt, severity, status, assignedTo } = report;
  res.json({ id, token, category, district, submittedAt, severity, status, assignedTo });
});

router.get("/admin/stats", async (_req, res): Promise<void> => {
  res.json({
    totalReports: 247,
    activeCritical: 12,
    resolved: 189,
    pendingTriage: 46,
    categoryBreakdown: [
      { category: "Bullying", count: 68, percentage: 27.5 },
      { category: "Mental Distress", count: 54, percentage: 21.9 },
      { category: "Ragging", count: 41, percentage: 16.6 },
      { category: "Cyber Blackmail", count: 38, percentage: 15.4 },
      { category: "Institutional Pressure", count: 28, percentage: 11.3 },
      { category: "Bad Touch", count: 12, percentage: 4.9 },
      { category: "Other", count: 6, percentage: 2.4 },
    ],
    severityBreakdown: [
      { category: "L1 (Low)", count: 89, percentage: 36 },
      { category: "L2 (Medium)", count: 112, percentage: 45.3 },
      { category: "L3 (High)", count: 34, percentage: 13.8 },
      { category: "L4 (Critical)", count: 12, percentage: 4.9 },
    ],
    recentActivity: MOCK_REPORTS.slice(0, 4).map(({ id, token, category, district, submittedAt, severity, status, assignedTo }) => ({
      id, token, category, district, submittedAt, severity, status, assignedTo,
    })),
  });
});

export default router;
