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
    district: "Chennai, Tamil Nadu",
    submittedAt: "2024-12-10T09:15:00Z",
    currentStatus: "Routed to Verified Counselor",
    events: [
      {
        status: "Report Received",
        timestamp: "2024-12-10T09:15:00Z",
        description: "Your anonymous report has been securely received and logged into the system.",
        severity: null,
      },
      {
        status: "Under Review",
        timestamp: "2024-12-10T11:30:00Z",
        description: "A trained moderator has begun reviewing your report for assessment.",
        severity: null,
      },
      {
        status: "Severity Assigned: L2",
        timestamp: "2024-12-10T14:00:00Z",
        description: "Your report has been assessed and classified as Level 2 (Medium) severity requiring counseling intervention.",
        severity: "L2",
      },
      {
        status: "Routed to Verified Counselor",
        timestamp: "2024-12-11T09:00:00Z",
        description: "Your case has been routed to a verified counselor in your district. Support will be initiated through your institution.",
        severity: "L2",
      },
    ],
  },
  "AWZ-7392-M": {
    token: "AWZ-7392-M",
    category: "Ragging",
    district: "Bengaluru, Karnataka",
    submittedAt: "2024-12-08T16:42:00Z",
    currentStatus: "Action Completed",
    events: [
      {
        status: "Report Received",
        timestamp: "2024-12-08T16:42:00Z",
        description: "Your anonymous report has been securely received and logged into the system.",
        severity: null,
      },
      {
        status: "Severity Assigned: L4",
        timestamp: "2024-12-08T18:00:00Z",
        description: "Your report has been assessed as Level 4 (Critical) — immediate escalation initiated.",
        severity: "L4",
      },
      {
        status: "Escalated to District Committee",
        timestamp: "2024-12-09T08:30:00Z",
        description: "Due to the critical severity, this case has been escalated to the District Anti-Ragging Committee under UGC Regulations.",
        severity: "L4",
      },
      {
        status: "Investigation Initiated",
        timestamp: "2024-12-09T14:00:00Z",
        description: "The District Committee has initiated a formal inquiry. The process is ongoing.",
        severity: "L4",
      },
      {
        status: "Action Completed",
        timestamp: "2024-12-12T10:00:00Z",
        description: "The committee has completed its action. Support resources have been provided. Your safety is our priority.",
        severity: "L4",
      },
    ],
  },
  "AWZ-2847-P": {
    token: "AWZ-2847-P",
    category: "Mental Distress",
    district: "Pune, Maharashtra",
    submittedAt: "2024-12-13T08:20:00Z",
    currentStatus: "Support Resources Shared",
    events: [
      {
        status: "Report Received",
        timestamp: "2024-12-13T08:20:00Z",
        description: "Your anonymous report has been securely received and logged into the system.",
        severity: null,
      },
      {
        status: "Severity Assigned: L1",
        timestamp: "2024-12-13T10:00:00Z",
        description: "Your report has been assessed as Level 1 (Low) — support resources will be shared.",
        severity: "L1",
      },
      {
        status: "Support Resources Shared",
        timestamp: "2024-12-13T11:30:00Z",
        description: "Curated mental wellness resources, helpline numbers, and institutional support contacts have been shared with your institution's counseling desk for reach-out.",
        severity: "L1",
      },
    ],
  },
  "AWZ-9156-R": {
    token: "AWZ-9156-R",
    category: "Cyber Blackmail",
    district: "Patna, Bihar",
    submittedAt: "2024-12-14T22:05:00Z",
    currentStatus: "Report Received",
    events: [
      {
        status: "Report Received",
        timestamp: "2024-12-14T22:05:00Z",
        description: "Your anonymous report has been securely received. A moderator will review it shortly. You are not alone.",
        severity: null,
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
