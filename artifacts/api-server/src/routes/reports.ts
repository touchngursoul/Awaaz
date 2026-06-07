import { Router, type IRouter } from "express";
import {
  SubmitReportBody,
  TrackReportQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const MOCK_TOKENS: Record<string, object> = {
  "AWZ-4821-K": {
    token: "AWZ-4821-K",
    category: "Bullying",
    district: "Patna, Bihar",
    submittedAt: "2024-12-10T09:15:00Z",
    currentStatus: "Support Suggested",
    events: [
      {
        status: "Report Received",
        timestamp: "2024-12-10T09:15:00Z",
        description: "Your anonymous report has been securely received and logged into the system. You are not alone.",
        severity: null,
      },
      {
        status: "Severity Assigned: L2",
        timestamp: "2024-12-10T14:00:00Z",
        description: "Your report has been assessed and classified as Level 2 (Medium) severity.",
        severity: "L2",
      },
      {
        status: "Moderator Review Started",
        timestamp: "2024-12-11T08:30:00Z",
        description: "A trained moderator has begun reviewing your report for detailed assessment.",
        severity: "L2",
      },
      {
        status: "Support Suggested",
        timestamp: "2024-12-11T14:00:00Z",
        description: "Based on the review, a verified counselor and institutional liaison have been notified for support coordination. You may receive guidance through your institution.",
        severity: "L2",
      },
    ],
  },
  "AWZ-9134-M": {
    token: "AWZ-9134-M",
    category: "Mental Distress",
    district: "Gopalganj, Bihar",
    submittedAt: "2024-12-08T16:42:00Z",
    currentStatus: "Follow-up Recommended",
    events: [
      {
        status: "Report Received",
        timestamp: "2024-12-08T16:42:00Z",
        description: "Your anonymous report has been securely received and logged. Thank you for reaching out.",
        severity: null,
      },
      {
        status: "Severity Assigned: L3",
        timestamp: "2024-12-08T19:00:00Z",
        description: "Your report has been assessed as Level 3 (High) severity — priority counselor review initiated.",
        severity: "L3",
      },
      {
        status: "Routed to Verified Counselor",
        timestamp: "2024-12-09T09:00:00Z",
        description: "Your case has been routed to a verified mental health counselor for direct support coordination.",
        severity: "L3",
      },
      {
        status: "Follow-up Recommended",
        timestamp: "2024-12-10T11:00:00Z",
        description: "The counselor recommends a follow-up session. You may reach Tele-MANAS (14416) or iCall (9152987821) for immediate support while your case is being coordinated.",
        severity: "L3",
      },
    ],
  },
  "AWZ-7062-X": {
    token: "AWZ-7062-X",
    category: "Self-Harm Risk",
    district: "Muzaffarpur, Bihar",
    submittedAt: "2024-12-13T22:05:00Z",
    currentStatus: "Escalation Protocol Suggested",
    events: [
      {
        status: "Report Received",
        timestamp: "2024-12-13T22:05:00Z",
        description: "Your anonymous report has been received. This is being treated with the highest priority. Please call 14416 or 112 if you are in immediate danger.",
        severity: null,
      },
      {
        status: "Severity Assigned: L4",
        timestamp: "2024-12-13T22:15:00Z",
        description: "Your report has been assessed as Level 4 (Critical) — immediate protocol triggered.",
        severity: "L4",
      },
      {
        status: "Emergency Support Notice Triggered",
        timestamp: "2024-12-13T22:30:00Z",
        description: "Emergency support guidance has been activated. Tele-MANAS (14416) and district protection channels have been notified for rapid response coordination.",
        severity: "L4",
      },
      {
        status: "Escalation Protocol Suggested",
        timestamp: "2024-12-14T08:00:00Z",
        description: "A district-level escalation protocol has been recommended. Counselor and authorized support team are coordinating. Please contact 14416 for immediate mental health support.",
        severity: "L4",
      },
    ],
  },
  "AWZ-2258-P": {
    token: "AWZ-2258-P",
    category: "Institutional Pressure",
    district: "Gaya, Bihar",
    submittedAt: "2024-12-14T10:20:00Z",
    currentStatus: "Case Closed",
    events: [
      {
        status: "Report Received",
        timestamp: "2024-12-14T10:20:00Z",
        description: "Your anonymous report has been securely received and logged into the system.",
        severity: null,
      },
      {
        status: "Severity Assigned: L1",
        timestamp: "2024-12-14T12:00:00Z",
        description: "Your report has been assessed as Level 1 (Low) severity. Support resources are being prepared.",
        severity: "L1",
      },
      {
        status: "Resources Shared",
        timestamp: "2024-12-14T14:30:00Z",
        description: "Curated resources on student rights, institutional grievance procedures, and counseling support have been shared with your institution's student welfare desk.",
        severity: "L1",
      },
      {
        status: "Case Closed",
        timestamp: "2024-12-16T10:00:00Z",
        description: "This report has been reviewed and resources have been provided. If you need further support, please submit a new report or contact Tele-MANAS (14416).",
        severity: "L1",
      },
    ],
  },
};

router.post("/reports", async (req, res): Promise<void> => {
  const parsed = SubmitReportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const nums = Math.floor(1000 + Math.random() * 9000);
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const token = `AWZ-${nums}-${letter}`;

  res.status(201).json({
    token,
    message: "Your report has been securely submitted. Please save your token to track your report status.",
  });
});

router.get("/reports/track", async (req, res): Promise<void> => {
  const parsed = TrackReportQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid token format" });
    return;
  }

  const { token } = parsed.data;
  const report = MOCK_TOKENS[token.toUpperCase()];

  if (!report) {
    res.status(404).json({ error: "Token not found. Please check your token and try again." });
    return;
  }

  res.json(report);
});

export default router;
