import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/awareness/stats", async (_req, res): Promise<void> => {
  res.json({
    totalIncidents: 312,
    statesReporting: 18,
    topCategory: "Bullying",
    byState: [
      { state: "Tamil Nadu", count: 25, topCategory: "Bullying" },
      { state: "Karnataka", count: 24, topCategory: "Ragging" },
      { state: "Maharashtra", count: 23, topCategory: "Cyber Blackmail" },
      { state: "Uttar Pradesh", count: 18, topCategory: "Mental Distress" },
      { state: "Delhi", count: 20, topCategory: "Institutional Pressure" },
      { state: "West Bengal", count: 16, topCategory: "Bullying" },
      { state: "Gujarat", count: 14, topCategory: "Mental Distress" },
      { state: "Bihar", count: 15, topCategory: "Ragging" },
      { state: "Rajasthan", count: 12, topCategory: "Cyber Blackmail" },
      { state: "Odisha", count: 10, topCategory: "Bullying" },
      { state: "Telangana", count: 19, topCategory: "Institutional Pressure" },
      { state: "Madhya Pradesh", count: 11, topCategory: "Mental Distress" },
      { state: "Punjab", count: 9, topCategory: "Bullying" },
      { state: "Assam", count: 7, topCategory: "Bad Touch" },
      { state: "Jharkhand", count: 6, topCategory: "Ragging" },
      { state: "Kerala", count: 13, topCategory: "Cyber Blackmail" },
      { state: "Haryana", count: 8, topCategory: "Bullying" },
      { state: "Chhattisgarh", count: 5, topCategory: "Mental Distress" },
    ],
    byCategory: [
      { category: "Bullying", count: 89, percentage: 28.5 },
      { category: "Mental Distress", count: 71, percentage: 22.8 },
      { category: "Ragging", count: 54, percentage: 17.3 },
      { category: "Cyber Blackmail", count: 48, percentage: 15.4 },
      { category: "Institutional Pressure", count: 32, percentage: 10.3 },
      { category: "Bad Touch", count: 14, percentage: 4.5 },
      { category: "Other", count: 4, percentage: 1.3 },
    ],
    disclaimer:
      "This awareness dashboard is based on media-reported incidents and internal compilation. It is not an official government crime record, not a legal finding, and not proof against any person or institution.",
  });
});

export default router;
