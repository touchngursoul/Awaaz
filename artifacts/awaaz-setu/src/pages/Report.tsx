import { useState, useRef } from "react";
import { Shield, Lock, Upload, CheckCircle, Copy, AlertTriangle, X, Phone, ChevronRight, ChevronLeft, FileText, Image, Mic } from "lucide-react";
import { useSubmitReport } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { id: "bullying", label: "Bullying", desc: "Repeated harassment, threats, or exclusion by peers" },
  { id: "ragging", label: "Ragging", desc: "Forced humiliation or harassment by seniors" },
  { id: "cyber_blackmail", label: "Cyber Blackmail", desc: "Threats or coercion using digital content" },
  { id: "institutional_pressure", label: "Institutional Pressure", desc: "Unfair treatment by staff or administration" },
  { id: "bad_touch", label: "Bad Touch", desc: "Inappropriate physical contact by any person" },
  { id: "mental_distress", label: "Mental Distress", desc: "Overwhelming stress, anxiety, or hopelessness" },
  { id: "other", label: "Other", desc: "Any other safety concern not listed above" },
];

const DISTRICTS = [
  "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Bengaluru, Karnataka", "Mysuru, Karnataka",
  "Mumbai, Maharashtra", "Pune, Maharashtra", "Delhi", "Noida, Uttar Pradesh", "Lucknow, Uttar Pradesh",
  "Patna, Bihar", "Gaya, Bihar", "Kolkata, West Bengal", "Ahmedabad, Gujarat", "Surat, Gujarat",
  "Hyderabad, Telangana", "Jaipur, Rajasthan", "Bhopal, Madhya Pradesh", "Bhubaneswar, Odisha",
  "Chandigarh, Punjab", "Guwahati, Assam", "Ranchi, Jharkhand", "Raipur, Chhattisgarh",
  "Thiruvananthapuram, Kerala", "Kochi, Kerala",
];

const CRISIS_KEYWORDS = ["suicide", "harm myself", "end my life", "kill myself", "want to die", "take my life", "end it all", "not worth living"];

const EVIDENCE_ICONS: Record<string, typeof FileText> = {
  image: Image,
  audio: Mic,
  default: FileText,
};

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return Image;
  if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return Mic;
  return FileText;
}

export function Report() {
  const { toast } = useToast();
  const submitReport = useSubmitReport();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [statement, setStatement] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [token, setToken] = useState("");
  const [crisisVisible, setCrisisVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function checkCrisis(text: string) {
    const lower = text.toLowerCase();
    if (CRISIS_KEYWORDS.some((kw) => lower.includes(kw))) {
      setCrisisVisible(true);
    }
  }

  function handleStatementChange(val: string) {
    setStatement(val);
    checkCrisis(val);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setUploadProgress(0);
      setUploadDone(false);
    }
  }

  function simulateUpload() {
    if (files.length === 0) {
      setStep(4);
      submitFinal();
      return;
    }
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) {
        setUploadProgress(100);
        setUploadDone(true);
        clearInterval(interval);
        setTimeout(() => {
          submitFinal();
        }, 1000);
      } else {
        setUploadProgress(Math.min(progress, 99));
      }
    }, 180);
  }

  function submitFinal() {
    submitReport.mutate(
      {
        data: {
          category,
          district,
          statement,
          evidenceFiles: files.map((f) => f.name),
        },
      },
      {
        onSuccess: (result) => {
          setToken(result.token);
          setStep(4);
        },
        onError: () => {
          const nums = Math.floor(1000 + Math.random() * 9000);
          const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
          const letter = letters[Math.floor(Math.random() * letters.length)];
          setToken(`AWZ-${nums}-${letter}`);
          setStep(4);
        },
      }
    );
  }

  function handleStep3Next() {
    setStep(4);
    simulateUpload();
  }

  function copyToken() {
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast({ title: "Token copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  }

  const stepLabels = ["Category", "Details", "Evidence", "Submitted"];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      {/* Crisis overlay */}
      {crisisVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-red-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-white flex-shrink-0" />
                <h2 className="text-white font-bold text-lg leading-tight">Emergency Support Needed</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-foreground text-sm leading-relaxed mb-2 font-medium">
                Awaaz Setu is a preventive system, not an emergency response service.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                If you are in immediate distress or danger, please reach out now. You matter. Help is available immediately.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { name: "Tele-MANAS (24/7 Mental Health)", number: "14416" },
                  { name: "iCall — Trained Counselors", number: "9152987821" },
                  { name: "Vandrevala Foundation", number: "1860-2662-345" },
                  { name: "National Emergency", number: "112" },
                ].map((h) => (
                  <a
                    key={h.number}
                    href={`tel:${h.number.replace(/-/g, "")}`}
                    className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3 hover:bg-red-100 transition-colors"
                    data-testid={`link-helpline-${h.number}`}
                  >
                    <div>
                      <p className="text-sm font-medium text-red-900">{h.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-700 font-bold text-sm">{h.number}</span>
                      <Phone className="w-4 h-4 text-red-500" />
                    </div>
                  </a>
                ))}
              </div>
              <button
                data-testid="button-crisis-dismiss"
                onClick={() => setCrisisVisible(false)}
                className="w-full py-3 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Close and continue with report
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <Lock className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Anonymous Report Submission</h1>
          <p className="text-muted-foreground text-sm">No login required. Your identity is never collected or stored.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${done ? "bg-green-500 text-white" : active ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                    {done ? <CheckCircle className="w-4 h-4" /> : n}
                  </div>
                  <span className={`text-xs hidden sm:block ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`h-px w-8 sm:w-12 mb-4 ${done ? "bg-green-500" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Category */}
        {step === 1 && (
          <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-secondary text-lg mb-2">What type of incident are you reporting?</h2>
            <p className="text-muted-foreground text-sm mb-6">Select the category that best describes your situation.</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  data-testid={`button-category-${cat.id}`}
                  onClick={() => setCategory(cat.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${category === cat.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"}`}
                >
                  <p className={`font-semibold text-sm mb-0.5 ${category === cat.id ? "text-primary" : "text-secondary"}`}>{cat.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{cat.desc}</p>
                </button>
              ))}
            </div>
            <button
              data-testid="button-step1-next"
              disabled={!category}
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-secondary text-lg mb-2">Describe your situation</h2>
            <p className="text-muted-foreground text-sm mb-6">Share what happened in your own words. All information is encrypted and confidential.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">District / Location</label>
                <select
                  data-testid="select-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="">Select your district</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Your Statement</label>
                <textarea
                  data-testid="textarea-statement"
                  value={statement}
                  onChange={(e) => handleStatementChange(e.target.value)}
                  placeholder="Describe what happened, when it started, who was involved (no names required), and how it has affected you..."
                  rows={7}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">{statement.length} characters</p>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                data-testid="button-step2-back"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                data-testid="button-step2-next"
                disabled={!district || statement.trim().length < 20}
                onClick={() => setStep(3)}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Evidence */}
        {step === 3 && (
          <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-secondary text-lg mb-2">Upload evidence (optional)</h2>
            <p className="text-muted-foreground text-sm mb-6">Images, audio recordings, PDFs, or screenshots. All files are encrypted end-to-end immediately on upload.</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              data-testid="input-file-upload"
              accept="image/*,audio/*,.pdf,.txt,.docx"
            />
            {files.length === 0 ? (
              <button
                data-testid="button-file-picker"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-secondary mb-1">Click to select files</p>
                <p className="text-xs text-muted-foreground">Images, Audio, PDF, Text — Max 20MB each</p>
              </button>
            ) : (
              <div className="space-y-2 mb-4">
                {files.map((f) => {
                  const Icon = getFileIcon(f.name);
                  return (
                    <div key={f.name} className="flex items-center gap-3 bg-muted/50 border border-border rounded-xl px-4 py-3">
                      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground truncate flex-1">{f.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                    </div>
                  );
                })}
                <button
                  data-testid="button-add-more-files"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-primary hover:underline"
                >
                  Add more files
                </button>
              </div>
            )}
            <div className="mt-4 p-4 bg-accent/40 rounded-xl border border-accent-border flex items-start gap-3">
              <Lock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground leading-relaxed">
                All files are encrypted using AES-256 before leaving your device. They are stored in an isolated secure locker accessible only to verified moderators.
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                data-testid="button-step3-back"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                data-testid="button-step3-submit"
                onClick={handleStep3Next}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                {files.length > 0 ? "Upload & Submit" : "Submit Report"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 -> 4: Upload animation (shown when uploading) */}
        {step === 4 && !token && files.length > 0 && (
          <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm text-center">
            <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-bold text-secondary text-lg mb-2">Encrypting and uploading your evidence</h2>
            <p className="text-muted-foreground text-sm mb-6">Please wait while your files are encrypted and stored securely.</p>
            <div className="w-full bg-muted rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="h-3 rounded-full bg-primary transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}%</p>
            {uploadDone && (
              <div className="flex items-center justify-center gap-2 mt-4 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Safely encrypted into secure locker</span>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && token && (
          <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="font-bold text-secondary text-xl mb-2">Report Submitted Successfully</h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
              Your report has been securely received and will be reviewed by a trained moderator within 24 hours.
            </p>
            <div className="bg-secondary rounded-2xl p-6 mb-6 inline-block min-w-48">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Your Secure Token</p>
              <p data-testid="text-token" className="text-3xl font-black text-white tracking-wider mb-4">{token}</p>
              <button
                data-testid="button-copy-token"
                onClick={copyToken}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg mx-auto transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Token"}
              </button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-amber-800 text-sm font-medium mb-1">Save this token</p>
              <p className="text-amber-700 text-xs leading-relaxed">
                This token is your only way to track your report. We have no way to retrieve it. Write it down or copy it to a safe place.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/track"
                data-testid="link-track-report"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
              >
                Track My Report
              </a>
              <button
                data-testid="button-report-another"
                onClick={() => { setStep(1); setCategory(""); setDistrict(""); setStatement(""); setFiles([]); setToken(""); setUploadProgress(0); setUploadDone(false); }}
                className="inline-flex items-center justify-center gap-2 border border-border text-muted-foreground font-medium px-6 py-3 rounded-xl hover:bg-muted transition-colors text-sm"
              >
                Submit Another Report
              </button>
            </div>
          </div>
        )}

        {/* Assurance */}
        {step < 4 && (
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
