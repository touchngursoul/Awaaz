import { useState } from "react";
import { Search, CheckCircle, Clock, AlertTriangle, Shield } from "lucide-react";
import { useTrackReport, getTrackReportQueryKey } from "@workspace/api-client-react";

const SEVERITY_COLORS: Record<string, string> = {
  L1: "bg-green-100 text-green-800 border-green-200",
  L2: "bg-yellow-100 text-yellow-800 border-yellow-200",
  L3: "bg-orange-100 text-orange-800 border-orange-200",
  L4: "bg-red-100 text-red-800 border-red-200",
};

function TimelineEvent({ event, isLast, isLatest }: { event: { status: string; timestamp: string; description: string; severity?: string | null }; isLast: boolean; isLatest: boolean }) {
  const date = new Date(event.timestamp);
  const formatted = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${isLatest && !isLast ? "border-primary bg-primary" : "border-green-500 bg-green-500"}`}>
          {isLatest && !isLast ? (
            <Clock className="w-4 h-4 text-white" />
          ) : (
            <CheckCircle className="w-4 h-4 text-white" />
          )}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
      </div>
      <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="font-semibold text-secondary text-sm">{event.status}</p>
          {event.severity && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${SEVERITY_COLORS[event.severity] ?? "bg-muted text-muted-foreground border-border"}`}>
              {event.severity}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-1">{formatted}</p>
        <p className="text-sm text-foreground leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
}

export function Track() {
  const [inputToken, setInputToken] = useState("");
  const [submittedToken, setSubmittedToken] = useState("");

  const { data, isLoading, error } = useTrackReport(
    { token: submittedToken },
    { query: { enabled: !!submittedToken, queryKey: getTrackReportQueryKey({ token: submittedToken }) } }
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = inputToken.trim().toUpperCase();
    setSubmittedToken(cleaned);
  }

  const sampleTokens = [
    { token: "AWZ-4821-K", label: "L2 · Bullying · Patna" },
    { token: "AWZ-9134-M", label: "L3 · Mental Distress · Gopalganj" },
    { token: "AWZ-7062-X", label: "L4 · Self-Harm Risk · Muzaffarpur" },
    { token: "AWZ-2258-P", label: "L1 · Institutional Pressure · Gaya" },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-secondary mb-2">Track Your Report</h1>
          <p className="text-muted-foreground text-sm">Enter your unique token to check the status and actions taken on your report. No account needed.</p>
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-xs text-amber-700 font-medium">Demo — uses mock data only</span>
          </div>
        </div>

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
                  onClick={() => { setInputToken(t.token); setSubmittedToken(t.token); }}
                  className="flex items-center justify-between text-xs px-3 py-2.5 rounded-lg bg-muted hover:bg-muted-foreground/10 text-secondary border border-border transition-colors text-left"
                >
                  <span className="font-mono font-bold">{t.token}</span>
                  <span className="text-muted-foreground ml-2">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Looking up your report...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm text-center">
            <AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-secondary mb-2">Token not found</h3>
            <p className="text-muted-foreground text-sm">
              No demo report found for token <span className="font-mono font-bold">{submittedToken}</span>. Please check your token or submit a demo report first, then use that token here.
            </p>
          </div>
        )}

        {data && !isLoading && (
          <div className="space-y-4">
            <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider">Report Token</p>
                  <p data-testid="text-tracked-token" className="font-black text-secondary text-xl font-mono">{data.token}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider">Status</p>
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-semibold">{data.currentStatus}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Category</p>
                  <p className="text-sm font-medium text-secondary">{data.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">District</p>
                  <p className="text-sm font-medium text-secondary">{data.district}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Submitted</p>
                  <p className="text-sm font-medium text-secondary">
                    {new Date(data.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-secondary text-sm uppercase tracking-wider mb-6">Status Timeline</h3>
              <div className="space-y-0">
                {data.events.map((event, i) => (
                  <TimelineEvent
                    key={i}
                    event={event}
                    isLast={i === data.events.length - 1}
                    isLatest={i === data.events.length - 1}
                  />
                ))}
              </div>
            </div>

            <div className="bg-accent/40 border border-accent-border rounded-xl p-4 flex items-start gap-3">
              <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground leading-relaxed">
                Your identity remains completely anonymous throughout this process. The moderator team cannot see who you are — only the content of your report.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
