import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { chartData } from "@/lib/mock-data";
import type { TeamMember } from "@/types";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e4e4e7",
  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
};

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Progress</CardTitle>
        <CardDescription>Planned vs actual completion over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData.progress}>
            <defs>
              <linearGradient id="planned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#a1a1aa" />
            <YAxis tick={{ fontSize: 12 }} stroke="#a1a1aa" />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="planned" stroke="#a5b4fc" fill="url(#planned)" strokeWidth={2} />
            <Area type="monotone" dataKey="actual" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TeamBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
        <CardDescription>Individual goal completion rates</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData.teamPerformance} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#a1a1aa" />
            <YAxis tick={{ fontSize: 12 }} stroke="#a1a1aa" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.teamPerformance.map((_, i) => (
                <Cell key={i} fill={i % 2 === 0 ? "#4f46e5" : "#818cf8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function OrgBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Completion</CardTitle>
        <CardDescription>Organization-wide goal completion by department</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData.orgCompletion} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
            <YAxis dataKey="department" type="category" width={100} tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="completion" fill="#4f46e5" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function QuarterlyTimelineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quarterly Timeline</CardTitle>
        <CardDescription>Year-over-year quarterly progress</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData.quarterlyTimeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="progress" fill="#4f46e5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function HeatmapGrid({ data }: { data: TeamMember[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Heatmap</CardTitle>
        <CardDescription>Team member goal completion intensity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {data.map((m) => (
            <div
              key={m.id}
              className="rounded-xl p-4 text-center transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: `rgba(79, 70, 229, ${m.progress / 120})`,
              }}
            >
              <p className="text-xs font-medium text-white/90">{m.name.split(" ")[0]}</p>
              <p className="mt-1 text-lg font-semibold text-white">{m.progress}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
