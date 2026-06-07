import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Info, TrendingUp, MapPin } from "lucide-react";
import { useGetAwarenessStats, getGetAwarenessStatsQueryKey } from "@workspace/api-client-react";

const CHART_COLORS = [
  "hsl(201,78%,38%)", "hsl(218,55%,35%)", "hsl(170,60%,38%)",
  "hsl(38,85%,55%)", "hsl(4,75%,54%)", "hsl(280,60%,55%)", "hsl(160,55%,40%)",
];

export function Awareness() {
  const { data, isLoading } = useGetAwarenessStats({
    query: { queryKey: getGetAwarenessStatsQueryKey() },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading awareness data...</p>
        </div>
      </div>
    );
  }

  const sortedStates = data ? [...data.byState].sort((a, b) => b.count - a.count) : [];
  const maxCount = sortedStates[0]?.count ?? 1;

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-secondary py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5" style={{ color: "hsl(201,78%,65%)" }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(201,78%,65%)" }}>Awareness Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Incident Awareness Statistics</h1>
          <p className="text-white/60 max-w-2xl text-sm leading-relaxed">
            A compilation of media-reported and internally observed incidents across Indian states, presented to raise institutional awareness and enable resource allocation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary cards */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
              <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider">Total Incidents Compiled</p>
              <p data-testid="stat-total" className="text-3xl font-black text-secondary">{data.totalIncidents}</p>
            </div>
            <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
              <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider">States Reporting</p>
              <p data-testid="stat-states" className="text-3xl font-black text-secondary">{data.statesReporting}</p>
            </div>
            <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm col-span-2 md:col-span-1">
              <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider">Most Reported Category</p>
              <p data-testid="stat-top-category" className="text-xl font-black text-secondary">{data.topCategory}</p>
            </div>
          </div>
        )}

        {/* State-wise distribution */}
        <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-secondary text-sm">Incidents by State</h2>
          </div>
          {data && (
            <div className="p-6 space-y-3">
              {sortedStates.map((state, i) => (
                <div key={state.state} className="flex items-center gap-4">
                  <div className="w-32 sm:w-44 text-sm text-secondary font-medium truncate flex-shrink-0">
                    {state.state}
                  </div>
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-5 rounded-full transition-all duration-500"
                        style={{
                          width: `${(state.count / maxCount) * 100}%`,
                          background: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-10 text-right flex-shrink-0">
                    <span data-testid={`stat-state-${state.state}`} className="text-sm font-bold text-secondary">{state.count}</span>
                  </div>
                  <div className="hidden sm:block w-32 text-xs text-muted-foreground truncate flex-shrink-0">
                    Top: {state.topCategory}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category chart */}
        {data && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-secondary text-sm mb-1">Category Distribution</h3>
              <p className="text-xs text-muted-foreground mb-5">Breakdown of reported incident types</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.byCategory} margin={{ left: -20 }}>
                  <XAxis dataKey="category" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(214,22%,87%)" }}
                    cursor={{ fill: "hsl(216,20%,93%)" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.byCategory.map((_: unknown, index: number) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-secondary text-sm mb-1">Category Percentages</h3>
              <p className="text-xs text-muted-foreground mb-5">Share of total compiled incidents</p>
              <div className="space-y-3">
                {data.byCategory.map((cat: { category: string; count: number; percentage: number }, i: number) => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-secondary font-medium">{cat.category}</span>
                      <span className="text-xs font-bold text-secondary">{cat.count} ({cat.percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${cat.percentage}%`, background: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mandatory disclaimer */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm mb-2 uppercase tracking-wide">Important Disclaimer</p>
              <p data-testid="text-disclaimer" className="text-amber-800 text-sm leading-relaxed">
                {data?.disclaimer ?? "This awareness dashboard is based on media-reported incidents and internal compilation. It is not an official government crime record, not a legal finding, and not proof against any person or institution."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
