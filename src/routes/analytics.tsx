import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · MBUX" }] }),
  component: Analytics,
});

type RequestData = {
  id: number;
  vehicle: string;
  issue: string;
  location: string;
  nearestWorkshop: string;
  distanceKm: number;
  timestamp: string;
};

type WorkshopLoad = {
  name: string;
  location: string;
  currentLoad: number;
  maxCapacity: number;
  avgWaitMins: number;
  requestsToday: number;
};

const SAMPLE_REQUESTS: RequestData[] = [
  { id: 1, vehicle: "GLC 300 · MB001", issue: "Brake Pad Wear", location: "Whitefield, Bangalore", nearestWorkshop: "Whitefield", distanceKm: 2.3, timestamp: "09:14 AM" },
  { id: 2, vehicle: "E 220d · MB047", issue: "Battery Warning", location: "Marathahalli, Bangalore", nearestWorkshop: "Whitefield", distanceKm: 4.1, timestamp: "09:32 AM" },
  { id: 3, vehicle: "A 200 · MB112", issue: "Low Tire Pressure", location: "Koramangala, Bangalore", nearestWorkshop: "JP Nagar", distanceKm: 3.8, timestamp: "10:05 AM" },
  { id: 4, vehicle: "GLE 450 · MB089", issue: "Engine Overheating", location: "Electronic City, Bangalore", nearestWorkshop: "JP Nagar", distanceKm: 5.2, timestamp: "10:18 AM" },
  { id: 5, vehicle: "C 300 · MB203", issue: "Wiper System Fault", location: "Indiranagar, Bangalore", nearestWorkshop: "Whitefield", distanceKm: 6.7, timestamp: "10:45 AM" },
  { id: 6, vehicle: "S 500 · MB015", issue: "Suspension Warning", location: "Hebbal, Bangalore", nearestWorkshop: "Whitefield", distanceKm: 9.1, timestamp: "11:02 AM" },
  { id: 7, vehicle: "GLA 250 · MB331", issue: "Coolant Low", location: "Bannerghatta, Bangalore", nearestWorkshop: "JP Nagar", distanceKm: 4.5, timestamp: "11:20 AM" },
  { id: 8, vehicle: "CLA 200 · MB278", issue: "ABS Warning", location: "HSR Layout, Bangalore", nearestWorkshop: "JP Nagar", distanceKm: 3.2, timestamp: "11:38 AM" },
  { id: 9, vehicle: "GLC 43 · MB099", issue: "Brake Pad Wear", location: "Sarjapur, Bangalore", nearestWorkshop: "Whitefield", distanceKm: 7.8, timestamp: "11:55 AM" },
  { id: 10, vehicle: "E 350 · MB156", issue: "Battery Warning", location: "Jayanagar, Bangalore", nearestWorkshop: "JP Nagar", distanceKm: 2.1, timestamp: "12:10 PM" },
  { id: 11, vehicle: "AMG GT · MB002", issue: "Check Engine", location: "MG Road, Bangalore", nearestWorkshop: "Whitefield", distanceKm: 8.4, timestamp: "12:30 PM" },
  { id: 12, vehicle: "GLS 450 · MB067", issue: "Transmission Warning", location: "Yelahanka, Bangalore", nearestWorkshop: "Whitefield", distanceKm: 12.3, timestamp: "12:48 PM" },
];

const WORKSHOPS: WorkshopLoad[] = [
  { name: "Whitefield", location: "No. 12, ITPL Main Rd", currentLoad: 150, maxCapacity: 200, avgWaitMins: 45, requestsToday: 150 },
  { name: "JP Nagar", location: "15, 7th Phase", currentLoad: 98, maxCapacity: 200, avgWaitMins: 25, requestsToday: 98 },
];

const SUGGESTION = {
  title: "New Workshop Recommendation",
  location: "Sarjapur Road, Bangalore",
  reason: "248 total requests across 2 workshops in the last 30 days. Whitefield is at 75% capacity with 150 requests. High request density from Sarjapur, HSR Layout & Electronic City. A new facility here would reduce Whitefield load by ~35% and cut average customer travel time by 12 minutes.",
  projectedLoad: { whitefield: 40, jpNagar: 32, newCenter: 28 },
};

const BAR_COLORS = ["#22d3ee", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];
const PIE_COLORS = ["#22d3ee", "#f59e0b"];

function Analytics() {
  const [visibleRequests, setVisibleRequests] = useState<number>(0);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [animatingBars, setAnimatingBars] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleRequests((prev) => {
        if (prev >= SAMPLE_REQUESTS.length) {
          clearInterval(interval);
          setTimeout(() => setAnimatingBars(true), 400);
          setTimeout(() => setShowSuggestion(true), 1200);
          return prev;
        }
        return prev + 1;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const whiteFieldReqs = SAMPLE_REQUESTS.slice(0, visibleRequests).filter((r) => r.nearestWorkshop === "Whitefield");
  const jpNagarReqs = SAMPLE_REQUESTS.slice(0, visibleRequests).filter((r) => r.nearestWorkshop === "JP Nagar");

  const issueChartData = useMemo(() => [
    { issue: "Brake Pad Wear", count: 52 },
    { issue: "Battery Warning", count: 41 },
    { issue: "Low Tire Pressure", count: 38 },
    { issue: "Engine Overheating", count: 29 },
    { issue: "Wiper System Fault", count: 24 },
    { issue: "ABS Warning", count: 22 },
    { issue: "Suspension Warning", count: 18 },
    { issue: "Coolant Low", count: 14 },
    { issue: "Check Engine", count: 10 },
  ], []);

  const workshopPieData = useMemo(() => [
    { name: "Whitefield", value: 150 },
    { name: "JP Nagar", value: 98 },
  ], []);

  return (
    <div>
      <TopBar active="analytics" />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-primary">Mercedes-Benz Bangalore</div>
          <h1 className="mt-1 text-3xl font-semibold">Workshop Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Request distribution and workshop load balancing insights — last 30 days.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Workshop Load Cards */}
          {WORKSHOPS.map((ws) => {
            const reqs = ws.requestsToday;
            const loadPct = Math.round((reqs / ws.maxCapacity) * 100);
            return (
              <div key={ws.name} className="mb-glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-primary">{ws.name}</div>
                    <div className="mt-1 text-lg font-semibold">Mercedes {ws.name}</div>
                    <div className="text-xs text-muted-foreground">{ws.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono font-semibold">{reqs}</div>
                    <div className="text-xs text-muted-foreground">requests (last 30 days)</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Load</span>
                    <span>{loadPct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${loadPct > 70 ? "bg-mb-red" : loadPct > 40 ? "bg-mb-amber" : "bg-mb-green"}`}
                      style={{ width: `${animatingBars ? loadPct : 0}%` }}
                    />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-border bg-surface/60 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg Wait</div>
                    <div className="mt-0.5 text-sm font-medium">{ws.avgWaitMins} min</div>
                  </div>
                  <div className="rounded-lg border border-border bg-surface/60 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Capacity</div>
                    <div className="mt-0.5 text-sm font-medium">{reqs}/{ws.maxCapacity}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Request Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="mb-glass rounded-2xl p-5">
            <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Requests by Issue Type · 248 total (last 30 days)
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={issueChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="issue" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={800}>
                  {issueChartData.map((_, idx) => (
                    <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-glass rounded-2xl p-5">
            <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Workshop Distribution
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={workshopPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  nameKey="name"
                  animationDuration={1000}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {workshopPieData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Suggestion */}
        <div className={`mt-8 transition-all duration-700 ${showSuggestion ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="rounded-2xl border-2 border-mb-cyan/40 bg-mb-cyan/5 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mb-cyan/20 text-mb-cyan text-lg">
                ✦
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.3em] text-mb-cyan">AI Recommendation</div>
                <div className="mt-1 text-xl font-semibold">{SUGGESTION.title}</div>
                <div className="mt-1 text-sm font-medium text-mb-cyan">{SUGGESTION.location}</div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {SUGGESTION.reason}
                </p>

                <div className="mt-5">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                    Projected Load Distribution
                  </div>
                  <div className="space-y-2">
                    <LoadBar label="Whitefield" pct={SUGGESTION.projectedLoad.whitefield} color="bg-mb-cyan" animate={showSuggestion} />
                    <LoadBar label="JP Nagar" pct={SUGGESTION.projectedLoad.jpNagar} color="bg-mb-amber" animate={showSuggestion} />
                    <LoadBar label="Sarjapur (New)" pct={SUGGESTION.projectedLoad.newCenter} color="bg-mb-green" animate={showSuggestion} />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <StatCard label="Load Reduction" value="−35%" sub="Whitefield" />
                  <StatCard label="Travel Saved" value="12 min" sub="avg per customer" />
                  <StatCard label="Coverage" value="+18 km²" sub="new service area" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoadBar({ label, pct, color, animate }: { label: string; pct: number; color: string; animate: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-xs text-muted-foreground">{label}</div>
      <div className="flex-1 h-3 rounded-full bg-surface overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: animate ? `${pct}%` : "0%" }}
        />
      </div>
      <div className="w-8 text-right text-xs font-mono font-medium">{pct}%</div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold text-mb-cyan">{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}
