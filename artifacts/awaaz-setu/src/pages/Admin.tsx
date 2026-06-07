import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { FileText, AlertTriangle, CheckCircle, Clock, Eye, EyeOff, X, ChevronRight, Users, TrendingUp, Activity } from "lucide-react";
import {
  useListAdminReports,
  useGetAdminStats,
  useGetAdminReport,
  getGetAdminReportQueryKey,
  useRouteReport,
  getListAdminReportsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const SEVERITY_CONFIG: Record<string, { label: string; classes: string; dot: string }> = {
  L1: { label: "L1 Low", classes: "bg-green-100 text-green-800 border-green-200", dot: "bg-green-500" },
  L2: { label: "L2 Medium", classes: "bg-yellow-100 text-yellow-800 border-yellow-200", dot: "bg-yellow-500" },
  L3: { label: "L3 High", classes: "bg-orange-100 text-orange-800 border-orange-200", dot: "bg-orange-500" },
  L4: { label: "L4 Critical", classes: "bg-red-100 text-red-800 border-red-200", dot: "bg-red-500" },
};

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
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-black text-secondary mb-0.5">{value}</div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      {sub && <div className="text-xs text-muted-foreground/60 mt-0.5">{sub}</div>}
    </div>
  );
}

function ReportDetailModal({ reportId, onClose }: { reportId: string; onClose: () => void }) {
  const [statementVisible, setStatementVisible] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const routeReport = useRouteReport();

  const { data, isLoading } = useGetAdminReport(reportId, {
    query: { enabled: !!reportId, queryKey: getGetAdminReportQueryKey(reportId) },
  });

  function handleAction(action: string, label: string) {
    routeReport.mutate(
      { id: reportId, data: { action } },
      {
        onSuccess: () => {
          toast({ title: `Action taken: ${label}`, description: "Report status updated successfully." });
          queryClient.invalidateQueries({ queryKey: getListAdminReportsQueryKey() });
          onClose();
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-card-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h2 className="font-bold text-secondary">Report Detail</h2>
            {data && <p className="text-xs text-muted-foreground font-mono mt-0.5">{data.token}</p>}
          </div>
          <button
            data-testid="button-modal-close"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {isLoading && (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}

        {data && (
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Category", value: data.category },
                { label: "District", value: data.district },
                { label: "Severity", value: <SeverityBadge severity={data.severity} /> },
                { label: "Status", value: data.status },
              ].map((item) => (
                <div key={item.label} className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <div className="text-sm font-medium text-secondary">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-muted/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Anonymous Statement</p>
                <button
                  data-testid="button-toggle-statement"
                  onClick={() => setStatementVisible(!statementVisible)}
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  {statementVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {statementVisible ? "Hide" : "View Statement"}
                </button>
              </div>
              {statementVisible ? (
                <p className="text-sm text-foreground leading-relaxed">{data.statement}</p>
              ) : (
                <div className="h-12 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Click "View Statement" to reveal the anonymised content</p>
                </div>
              )}
            </div>

            {data.evidenceFiles && data.evidenceFiles.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Evidence Files</p>
                <div className="space-y-2">
                  {data.evidenceFiles.map((f) => (
                    <div key={f.name} className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-2.5">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground flex-1">{f.name}</span>
                      <span className="text-xs text-muted-foreground">{f.type}</span>
                      {f.size && <span className="text-xs text-muted-foreground">{f.size}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Timeline</p>
              <div className="space-y-3">
                {data.timeline.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-secondary">{ev.status}</p>
                      <p className="text-xs text-muted-foreground">{new Date(ev.timestamp).toLocaleString("en-IN")}</p>
                      <p className="text-xs text-foreground mt-0.5">{ev.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <button
                data-testid="button-route-counselor"
                onClick={() => handleAction("route_counselor", "Route to Counselor")}
                disabled={routeReport.isPending}
                className="flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm"
              >
                <Users className="w-4 h-4" />
                Route to Counselor
              </button>
              <button
                data-testid="button-escalate"
                onClick={() => handleAction("escalate_district", "Escalate to District Committee")}
                disabled={routeReport.isPending}
                className="flex items-center justify-center gap-2 bg-destructive text-white font-semibold py-3 rounded-xl hover:bg-destructive/90 disabled:opacity-50 transition-colors text-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                Escalate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Admin() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: reports, isLoading: reportsLoading } = useListAdminReports();
  const { data: stats } = useGetAdminStats();

  const CHART_COLORS = ["hsl(201,78%,38%)", "hsl(218,55%,35%)", "hsl(170,60%,38%)", "hsl(38,85%,55%)", "hsl(4,75%,54%)"];

  return (
    <div className="min-h-screen bg-background">
      {selectedId && <ReportDetailModal reportId={selectedId} onClose={() => setSelectedId(null)} />}

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 min-h-screen bg-sidebar border-r border-sidebar-border">
          <div className="p-5 border-b border-sidebar-border">
            <p className="text-sidebar-foreground/50 text-xs uppercase tracking-widest">Admin Portal</p>
            <p className="text-sidebar-foreground font-bold mt-0.5">District Officer</p>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {[
              { label: "Dashboard", icon: Activity, active: true },
              { label: "All Reports", icon: FileText, active: false },
              { label: "Critical Cases", icon: AlertTriangle, active: false },
              { label: "Resolved", icon: CheckCircle, active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  item.active ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-sidebar-border">
            <div className="bg-sidebar-accent rounded-lg p-3">
              <p className="text-sidebar-foreground/50 text-xs mb-0.5">Demo Mode</p>
              <p className="text-sidebar-foreground text-xs">This is a pilot preview dashboard</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-secondary">Dashboard Overview</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Awaaz Setu — District Admin Panel</p>
            </div>
            <div className="flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-800 text-xs font-medium">System Live</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Stat cards */}
            {stats ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={FileText} label="Total Reports" value={stats.totalReports} sub="All time" color="bg-primary/10 text-primary" />
                <StatCard icon={AlertTriangle} label="Active Critical" value={stats.activeCritical} sub="L4 — require immediate action" color="bg-red-100 text-red-600" />
                <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved} sub="Cases closed" color="bg-green-100 text-green-600" />
                <StatCard icon={Clock} label="Pending Triage" value={stats.pendingTriage} sub="Awaiting review" color="bg-yellow-100 text-yellow-600" />
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1,2,3,4].map((i) => <div key={i} className="bg-card border border-card-border rounded-xl h-24 animate-pulse" />)}
              </div>
            )}

            {/* Charts */}
            {stats && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-secondary text-sm mb-1">Reports by Category</h3>
                  <p className="text-xs text-muted-foreground mb-4">Distribution of incident types</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.categoryBreakdown} margin={{ left: -20 }}>
                      <XAxis dataKey="category" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(214,22%,87%)" }}
                        cursor={{ fill: "hsl(216,20%,93%)" }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {stats.categoryBreakdown.map((_: unknown, index: number) => (
                          <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-secondary text-sm mb-1">Severity Breakdown</h3>
                  <p className="text-xs text-muted-foreground mb-4">Report distribution by severity level</p>
                  <div className="space-y-3">
                    {stats.severityBreakdown.map((sv: { category: string; count: number; percentage: number }, i: number) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-secondary">{sv.category}</span>
                          <span className="text-sm font-bold text-secondary">{sv.count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${sv.percentage}%`, background: CHART_COLORS[i] }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{sv.percentage.toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reports table */}
            <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-secondary text-sm">Incoming Reports</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Click any row to view full details and take action</p>
                </div>
                {reports && <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground font-medium">{reports.length} reports</span>}
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
                    {reportsLoading ? (
                      [1,2,3].map((i) => (
                        <tr key={i}>
                          {[1,2,3,4,5,6,7].map((j) => (
                            <td key={j} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td>
                          ))}
                        </tr>
                      ))
                    ) : reports?.map((report) => (
                      <tr
                        key={report.id}
                        data-testid={`row-report-${report.id}`}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedId(report.id)}
                      >
                        <td className="px-4 py-3 font-mono font-bold text-secondary text-xs">{report.token}</td>
                        <td className="px-4 py-3 text-foreground">{report.category}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{report.district}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {new Date(report.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </td>
                        <td className="px-4 py-3"><SeverityBadge severity={report.severity} /></td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground">{report.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            data-testid={`button-view-${report.id}`}
                            onClick={(e) => { e.stopPropagation(); setSelectedId(report.id); }}
                            className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
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
          </div>
        </div>
      </div>
    </div>
  );
}
