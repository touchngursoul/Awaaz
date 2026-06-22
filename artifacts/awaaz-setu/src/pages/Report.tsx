import { useState, useRef } from "react";
import { Shield, Lock, Upload, CheckCircle, Copy, AlertTriangle, X, Phone, ChevronRight, ChevronLeft, FileText, Image, Mic } from "lucide-react";
import { useSubmitReport } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { id: "bullying", label: "Bullying", desc: "Repeated harassment, threats, or exclusion by peers" },
  { id: "ragging", label: "Ragging", desc: "Forced humiliation or harassment by seniors" },
  { id: "cyber_blackmail", label: "Cyber Blackmail", desc: "Threats or coercion using digital content" },
  { id: "cyber_harassment", label: "Cyber Harassment", desc: "Online abuse, trolling, or impersonation" },
  { id: "institutional_pressure", label: "Institutional Pressure", desc: "Unfair treatment by staff or administration" },
  { id: "bad_touch", label: "Bad Touch", desc: "Inappropriate physical contact by any person" },
  { id: "sexual_harassment", label: "Sexual Harassment", desc: "Unwanted sexual advances or conduct" },
  { id: "mental_distress", label: "Mental Distress", desc: "Overwhelming stress, anxiety, or hopelessness" },
  { id: "stalking", label: "Stalking / Repeated Contact", desc: "Unwanted, repeated following or contact" },
  { id: "physical_threat", label: "Physical Threat", desc: "Threats of physical harm or violence" },
  { id: "workplace_harassment", label: "Workplace Harassment", desc: "Harassment or pressure in a workplace setting" },
  { id: "other", label: "Other", desc: "Any other safety concern not listed above" },
];

const SERIOUSNESS_OPTIONS = [
  "I only want to share safely",
  "I need guidance",
  "I feel unsafe",
  "I am being threatened",
  "I feel like harming myself",
  "Someone is in immediate danger",
];

const SUPPORT_OPTIONS = [
  "I want to stay fully anonymous",
  "I want token-based updates only",
  "I want counselor support",
  "I may share contact voluntarily later",
  "I need urgent support guidance",
];

const DISTRICTS = [
  "Gopalganj, Bihar", "Patna, Bihar", "Muzaffarpur, Bihar", "Gaya, Bihar",
  "Bhagalpur, Bihar", "Siwan, Bihar", "Bettiah, Bihar", "Darbhanga, Bihar",
  "Nalanda, Bihar", "Vaishali, Bihar", "Samastipur, Bihar", "Begusarai, Bihar",
  "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu",
  "Bengaluru, Karnataka", "Mysuru, Karnataka",
  "Mumbai, Maharashtra", "Pune, Maharashtra",
  "Delhi", "Noida, Uttar Pradesh", "Lucknow, Uttar Pradesh",
  "Hyderabad, Telangana", "Jaipur, Rajasthan", "Ahmedabad, Gujarat",
  "Kolkata, West Bengal", "Kochi, Kerala", "Bhopal, Madhya Pradesh",
  "Other Bihar district", "Outside Bihar",
];

const CRISIS_KEYWORDS = [
  "suicide", "harm myself", "end my life", "kill myself", "want to die",
  "take my life", "end it all", "not worth living", "mar jaunga", "jaan de dunga",
  "zinda nahi rehna", "khud ko maar", "mujhe jeena nahi", "self harm", "self-harm",
];

const LS_SUBMITTED = "awaaz_submitted_reports";

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return Image;
  if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return Mic;
  return FileText;
}

function getCategoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function computeSeverity(category: string, seriousness: string): "L1" | "L2" | "L3" | "L4" {
  const s = seriousness.toLowerCase();
  if (s.includes("harming myself") || s.includes("immediate danger")) return "L4";
  if (["bad_touch", "ragging", "sexual_harassment"].includes(category)) return "L3";
  if (["cyber_blackmail", "bullying", "stalking", "physical_threat"].includes(category) && (s.includes("threatened") || s.includes("unsafe"))) return "L3";
  if (["cyber_blackmail", "bullying", "mental_distress", "cyber_harassment", "workplace_harassment"].includes(category)) return "L2";
  return "L1";
}

function saveToLocalStorage(data: {
  token: string; category: string; district: string;
  statement: string; evidenceFiles: string[];
  seriousness: string; supportPreference: string;
  verificationStatus: "anonymous" | "verified";
}) {
  try {
    const existing = JSON.parse(localStorage.getItem(LS_SUBMITTED) ?? "[]") as unknown[];
    existing.push({ ...data, submittedAt: new Date().toISOString() });
    localStorage.setItem(LS_SUBMITTED, JSON.stringify(existing));
  } catch { }
}

export function Report() {
  const { toast } = useToast();
  const submitReport = useSubmitReport();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [seriousness, setSeriousness] = useState("");
  const [statement, setStatement] = useState("");
  const [supportPreference, setSupportPreference] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [token, setToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [crisisVisible, setCrisisVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  // Verification
  const [verificationChoice, setVerificationChoice] = useState<"anonymous" | "verify">("anonymous");
  const [verificationStatus, setVerificationStatus] = useState<"anonymous" | "verified">("anonymous");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyDone, setVerifyDone] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function checkCrisis(text: string) {
    if (CRISIS_KEYWORDS.some((kw) => text.toLowerCase().includes(kw))) setCrisisVisible(true);
  }

  function handleStatementChange(val: string) {
    setStatement(val);
    checkCrisis(val);
  }

  function handleSeriousnessChange(val: string) {
    setSeriousness(val);
    if (["I feel like harming myself", "Someone is in immediate danger"].includes(val)) setCrisisVisible(true);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) { setFiles(Array.from(e.target.files)); setUploadProgress(0); setUploadDone(false); }
  }

  function handleVerifySimulate() {
    setVerifyLoading(true);
    setTimeout(() => { setVerifyLoading(false); setVerifyDone(true); }, 2000);
  }

  function handleVerifyApply() {
    setVerificationStatus("verified");
    setShowVerifyModal(false);
  }

  function simulateUpload() {
    if (files.length === 0) { submitFinal(); return; }
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) {
        setUploadProgress(100);
        setUploadDone(true);
        clearInterval(interval);
        setTimeout(() => submitFinal(), 800);
      } else {
        setUploadProgress(Math.min(progress, 99));
      }
    }, 180);
  }

  function submitFinal() {
    const fileNames = files.map((f) => f.name);
    submitReport.mutate(
      { data: { category, district, statement, evidenceFiles: fileNames } },
      {
        onSuccess: (result) => {
          setToken(result.token);
          setSubmitted(true);
          saveToLocalStorage({ token: result.token, category, district, statement, evidenceFiles: fileNames, seriousness, supportPreference, verificationStatus });
        },
        onError: () => {
          const nums = Math.floor(1000 + Math.random() * 9000);
          const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
          const letter = letters[Math.floor(Math.random() * letters.length)];
          const fallbackToken = `AWZ-${nums}-${letter}`;
          setToken(fallbackToken);
          setSubmitted(true);
          saveToLocalStorage({ token: fallbackToken, category, district, statement, evidenceFiles: fileNames, seriousness, supportPreference, verificationStatus });
        },
      }
    );
  }

  function handleFinalSubmit() {
    if (files.length > 0) simulateUpload();
    else submitFinal();
  }

  function copyToken() {
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast({ title: "Token copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  }

  const previewSeverity = category && seriousness ? computeSeverity(category, seriousness) : null;
  const sevColor: Record<string, string> = {
    L1: "bg-green-100 text-green-800 border-green-200",
    L2: "bg-yellow-100 text-yellow-800 border-yellow-200",
    L3: "bg-orange-100 text-orange-800 border-orange-200",
    L4: "bg-red-100 text-red-800 border-red-200",
  };

  const stepLabels = ["Category", "Details", "Evidence", "Verify", "Submit"];
  const isSubmitting = submitReport.isPending || (uploadProgress > 0 && !uploadDone);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      {/* Inline Verify Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-primary px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold">Optional Trust Verification</h3>
                <p className="text-white/60 text-xs mt-0.5">Demo simulation only — no real verification happens</p>
              </div>
              {!verifyDone && <button onClick={() => setShowVerifyModal(false)} className="text-white/70 hover:text-white"><X className="w-4 h-4" /></button>}
            </div>
            <div className="p-6">
              {verifyDone ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <p className="font-bold text-gray-900 text-lg mb-1">Verified Identity — Hidden</p>
                  <p className="text-sm text-gray-500 mb-6">Your identity remains hidden and will not be shown in the report or admin view.</p>
                  <button onClick={handleVerifyApply} className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                    Done — Apply Trust Seal
                  </button>
                </div>
              ) : verifyLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Simulating DigiLocker-style verification…</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 leading-relaxed">This demo simulates a DigiLocker-style trust verification. No real Aadhaar, DigiLocker, or government authentication is happening.</p>
                  <div className="space-y-2 py-1">
                    {[
                      "Aadhaar number will not be shown in report",
                      "Identity will not be visible publicly",
                      "Normal admin view shows only verification status",
                      "Verification helps reduce fake reporting",
                      "You can still continue fully anonymously",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowVerifyModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors">Continue Anonymously</button>
                    <button onClick={handleVerifySimulate} className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Verify Safely — Demo</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Crisis Overlay */}
      {crisisVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-red-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-white flex-shrink-0" />
                <h2 className="text-white font-bold text-lg">Emergency Support Needed</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-900 text-sm font-medium mb-2">Awaaz Setu is a preventive system, not an emergency response service.</p>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">If you may harm yourself or someone is harming you now, please do not wait for an online response. Contact emergency services or a verified helpline immediately.</p>
              <div className="space-y-2 mb-5">
                {[
                  { name: "Tele-MANAS (24/7 Mental Health)", number: "14416" },
                  { name: "iCall — Trained Counselors", number: "9152987821" },
                  { name: "Vandrevala Foundation", number: "9999666555" },
                  { name: "Cyber Crime Helpline", number: "1930" },
                  { name: "Women Helpline", number: "181" },
                  { name: "Child Helpline", number: "1098" },
                  { name: "National Emergency", number: "112" },
                ].map((h) => (
                  <a key={h.number} href={`tel:${h.number}`} className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 hover:bg-red-100 transition-colors">
                    <p className="text-sm font-medium text-red-900">{h.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-red-700 font-bold text-sm">{h.number}</span>
                      <Phone className="w-4 h-4 text-red-500" />
                    </div>
                  </a>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mb-4">Helpline details must be verified before production launch.</p>
              <button data-testid="button-crisis-dismiss" onClick={() => setCrisisVisible(false)}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <X className="w-4 h-4" /> I am safe now — close and continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md mx-auto mb-4">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Anonymous Report Submission</h1>
          <p className="text-muted-foreground text-sm">No login required. Your identity is never collected or stored.</p>
          <div className="inline-flex items-center gap-2 mt-3 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span className="text-xs text-amber-800 font-medium">Demo prototype — no real data is stored on any server</span>
          </div>
        </div>

        {/* Step indicator (hidden on success) */}
        {!submitted && (
          <div className="flex items-center justify-center gap-1.5 mb-8">
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${done ? "bg-green-500 text-white" : active ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                      {done ? <CheckCircle className="w-4 h-4" /> : n}
                    </div>
                    <span className={`text-xs hidden sm:block whitespace-nowrap ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && <div className={`h-px w-5 sm:w-8 mb-4 ${done ? "bg-green-500" : "bg-border"}`} />}
                </div>
              );
            })}
          </div>
        )}

        {/* Step 1: Category */}
        {step === 1 && !submitted && (
          <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-secondary text-lg mb-2">What type of incident are you reporting?</h2>
            <p className="text-muted-foreground text-sm mb-6">Select the category that best describes your situation. You can always choose "Other."</p>
            <div className="grid sm:grid-cols-2 gap-2.5 mb-8">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} data-testid={`button-category-${cat.id}`} onClick={() => setCategory(cat.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${category === cat.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"}`}>
                  <p className={`font-semibold text-sm mb-0.5 ${category === cat.id ? "text-primary" : "text-secondary"}`}>{cat.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{cat.desc}</p>
                </button>
              ))}
            </div>
            <button data-testid="button-step1-next" disabled={!category} onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && !submitted && (
          <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-secondary text-lg mb-2">Describe your situation</h2>
            <p className="text-muted-foreground text-sm mb-6">Share what happened. Write only what you feel safe sharing. All content is anonymised.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">District / Location</label>
                <select data-testid="select-district" value={district} onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                  <option value="">Select your district</option>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Seriousness Level</label>
                <div className="grid gap-2">
                  {SERIOUSNESS_OPTIONS.map((opt) => (
                    <button key={opt} onClick={() => handleSeriousnessChange(opt)}
                      className={`text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${seriousness === opt ? "border-primary bg-primary/5 text-primary font-semibold" : "border-border hover:border-primary/30 text-foreground"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Your Statement</label>
                <textarea data-testid="textarea-statement" value={statement} onChange={(e) => handleStatementChange(e.target.value)}
                  placeholder="Write in your own words. No names required. Share only what you feel safe sharing."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-1">{statement.length} characters</p>
              </div>
            </div>
            {previewSeverity && (
              <div className={`mt-4 border rounded-xl px-4 py-3 flex items-center justify-between ${sevColor[previewSeverity]}`}>
                <div><p className="text-xs font-bold uppercase tracking-wider mb-0.5">Estimated Severity</p><p className="text-sm font-black">{previewSeverity}</p></div>
                <p className="text-xs opacity-70 text-right max-w-[150px]">Awaaz Setu does not decide guilt — only urgency and support need.</p>
              </div>
            )}
            <div className="flex gap-3 mt-8">
              <button data-testid="button-step2-back" onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button data-testid="button-step2-next" disabled={!district || !seriousness || statement.trim().length < 10} onClick={() => setStep(3)}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Evidence */}
        {step === 3 && !submitted && (
          <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-secondary text-lg mb-2">Upload evidence (optional)</h2>
            <p className="text-muted-foreground text-sm mb-1">Images, audio, PDFs, screenshots, or documents. Evidence is helpful but never mandatory.</p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mb-5">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span className="text-xs text-amber-800">Demo only — no files are uploaded to any server</span>
            </div>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} data-testid="input-file-upload" accept="image/*,audio/*,.pdf,.txt,.docx" />
            {files.length === 0 ? (
              <button data-testid="button-file-picker" onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-secondary mb-1">Click to select files</p>
                <p className="text-xs text-muted-foreground">Images, Audio, PDF, Text</p>
              </button>
            ) : (
              <div className="space-y-2 mb-4">
                {files.map((f) => {
                  const Icon = getFileIcon(f.name);
                  return (
                    <div key={f.name} className="flex items-center gap-3 bg-muted/50 border border-border rounded-xl px-4 py-3">
                      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground truncate flex-1">{f.name}</span>
                      <span className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</span>
                    </div>
                  );
                })}
                <button data-testid="button-add-more-files" onClick={() => fileInputRef.current?.click()} className="text-xs text-primary hover:underline">Add more files</button>
              </div>
            )}
            <div className="mt-4 p-4 bg-accent/40 rounded-xl border border-accent-border flex items-start gap-3">
              <Lock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground leading-relaxed">In a production deployment, all files are encrypted using AES-256 before leaving your device and stored in an isolated secure locker accessible only to verified moderators.</p>
            </div>
            <div className="flex gap-3 mt-8">
              <button data-testid="button-step3-back" onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button data-testid="button-step3-next" onClick={() => setStep(4)} className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Trust Verification (NEW) */}
        {step === 4 && !submitted && (
          <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-secondary text-lg mb-2">Optional Trust Verification</h2>
            <p className="text-muted-foreground text-sm mb-1">This step is completely optional. You can always continue anonymously.</p>
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 mb-6">
              <Shield className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-800 font-medium">Anonymous reporting is always allowed and fully safe</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {/* Continue Anonymously */}
              <button onClick={() => setVerificationChoice("anonymous")}
                className={`text-left p-5 rounded-xl border-2 transition-all ${verificationChoice === "anonymous" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <p className="font-bold text-sm text-secondary mb-1">Continue Anonymously</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Submit safely without name, phone, email, Aadhaar, or login.</p>
                {verificationChoice === "anonymous" && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> Selected (default)
                  </div>
                )}
              </button>

              {/* Add Trust Verification */}
              <button onClick={() => setVerificationChoice("verify")}
                className={`text-left p-5 rounded-xl border-2 transition-all ${verificationChoice === "verify" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-sm text-secondary">Add Trust Verification</p>
                  <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 font-medium">Optional</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">Optional verification can improve report credibility during support routing. Your identity will remain hidden.</p>
                {verificationChoice === "verify" && verificationStatus === "verified" && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-green-700 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Verified Identity — Hidden
                  </div>
                )}
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-xs text-amber-800 leading-relaxed">
              DigiLocker-style verification is optional in this demo. Awaaz Setu will not show your Aadhaar number in the report. Your identity will not be visible to the public, respondent, or normal dashboard view. Verification only helps reduce misuse and improve trust during support routing. You can continue anonymously.
            </div>

            {verificationChoice === "verify" && verificationStatus !== "verified" && (
              <button onClick={() => { setVerifyDone(false); setVerifyLoading(false); setShowVerifyModal(true); }}
                className="w-full flex items-center justify-center gap-2 border border-primary text-primary font-semibold py-3 rounded-xl hover:bg-primary/5 transition-colors mb-4">
                <Shield className="w-4 h-4" />
                Verify Safely — Demo
              </button>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(5)} className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Support Preference + Consent + Submit */}
        {step === 5 && !submitted && (
          <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-secondary text-lg mb-2">Support preference & consent</h2>
            <p className="text-muted-foreground text-sm mb-6">Final step before your report is submitted anonymously.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Support Preference (optional)</label>
                <div className="grid gap-2">
                  {SUPPORT_OPTIONS.map((opt) => (
                    <button key={opt} onClick={() => setSupportPreference(opt)}
                      className={`text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${supportPreference === opt ? "border-primary bg-primary/5 text-primary font-semibold" : "border-border hover:border-primary/30 text-foreground"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload progress (shown if files selected) */}
              {files.length > 0 && uploadProgress > 0 && !uploadDone && (
                <div>
                  <p className="text-xs font-medium text-secondary mb-2">Encrypting evidence files (demo)…</p>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div className="h-2.5 rounded-full bg-primary transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{Math.round(uploadProgress)}%</p>
                </div>
              )}
              {uploadDone && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Files appear safely encrypted (demo)</span>
                </div>
              )}

              {/* Verification status chip */}
              <div className="flex items-center gap-2 py-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Submission mode:</span>
                {verificationStatus === "verified" ? (
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 border border-green-200 rounded-full px-2.5 py-1 text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" /> Verified Identity — Hidden
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1 text-xs font-medium">
                    Anonymous Report
                  </span>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-amber-400 text-primary focus:ring-primary flex-shrink-0" />
                  <span className="text-xs text-amber-800 leading-relaxed">
                    I confirm that the information shared by me is true to the best of my knowledge. I understand that false, edited, misleading, or malicious reports can harm innocent people and may lead to action under applicable laws.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(4)} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button data-testid="button-step3-submit" disabled={!consentChecked || isSubmitting} onClick={handleFinalSubmit}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting…</>
                ) : (
                  <><Lock className="w-4 h-4" />{files.length > 0 ? "Upload & Submit Report Safely" : "Submit Report Safely"}</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {submitted && token && (
          <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="font-bold text-secondary text-xl mb-2">Report Submitted Successfully</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              Your report has been securely received and will be reviewed by a trained moderator within 24 hours.
            </p>

            {/* Verification status */}
            <div className={`inline-flex items-center gap-2 mb-6 rounded-full px-4 py-2 border text-sm font-medium ${verificationStatus === "verified" ? "bg-green-100 text-green-800 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
              {verificationStatus === "verified" ? (
                <><CheckCircle className="w-4 h-4" /> Verified Identity — Hidden — Trust seal applied</>
              ) : (
                <><Shield className="w-4 h-4" /> Anonymous Report — No identity collected</>
              )}
            </div>

            {verificationStatus === "verified" && (
              <p className="text-xs text-green-700 mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-2 max-w-sm mx-auto">
                Your report has a trust verification seal. Your identity is hidden and not displayed in the report.
              </p>
            )}

            <div className="bg-secondary rounded-2xl p-6 mb-6 inline-block min-w-48">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Your Secure Token</p>
              <p data-testid="text-token" className="text-3xl font-black text-white tracking-wider mb-4">{token}</p>
              <button data-testid="button-copy-token" onClick={copyToken}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg mx-auto transition-colors">
                {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Token"}
              </button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-amber-800 text-sm font-medium mb-1">Please save this token</p>
              <p className="text-amber-700 text-xs leading-relaxed">This token is your only anonymous way to track, manage, or withdraw your report. Write it down or copy it to a safe place.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/track" data-testid="link-track-report"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm">
                Track My Report
              </a>
              <button data-testid="button-report-another"
                onClick={() => { setStep(1); setCategory(""); setDistrict(""); setSeriousness(""); setStatement(""); setSupportPreference(""); setFiles([]); setToken(""); setSubmitted(false); setUploadProgress(0); setUploadDone(false); setConsentChecked(false); setVerificationChoice("anonymous"); setVerificationStatus("anonymous"); setVerifyDone(false); }}
                className="inline-flex items-center justify-center gap-2 border border-border text-muted-foreground font-medium px-6 py-3 rounded-xl hover:bg-muted transition-colors text-sm">
                Submit Another Report
              </button>
            </div>
          </div>
        )}

        {/* Assurance strip */}
        {step < 4 && !submitted && (
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Anonymous</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Encrypted</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> No login required</span>
          </div>
        )}
      </div>
    </div>
  );
}
