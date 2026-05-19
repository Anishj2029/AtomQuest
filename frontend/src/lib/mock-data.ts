import type { ActivityItem, AuditLog, CheckIn, Goal, GoalCycle, TeamMember, User } from "@/types";

export const mockUsers: Record<string, User & { password: string }> = {
  employee: {
    id: "u1",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    password: "demo123",
    role: "employee",
    department: "Product",
    title: "Senior Product Designer",
  },
  manager: {
    id: "u2",
    name: "James Mitchell",
    email: "james.mitchell@company.com",
    password: "demo123",
    role: "manager",
    department: "Product",
    title: "Director of Product",
  },
  admin: {
    id: "u3",
    name: "Elena Rodriguez",
    email: "elena.rodriguez@company.com",
    password: "demo123",
    role: "admin",
    department: "Human Resources",
    title: "HR Operations Lead",
  },
};

export const employeeGoals: Goal[] = [
  {
    id: "g1",
    title: "Increase NPS score",
    description: "Improve customer satisfaction through UX refinements",
    uom: "Points",
    target: 72,
    actual: 68,
    weightage: 25,
    status: "on_track",
    quarter: "Q2 2026",
    employeeId: "u1",
    updatedAt: "2026-05-10",
  },
  {
    id: "g2",
    title: "Ship design system v2",
    description: "Complete component library and documentation",
    uom: "%",
    target: 100,
    actual: 75,
    weightage: 30,
    status: "on_track",
    quarter: "Q2 2026",
    employeeId: "u1",
    updatedAt: "2026-05-12",
  },
  {
    id: "g3",
    title: "Reduce design review cycle",
    description: "Streamline feedback loops with engineering",
    uom: "Days",
    target: 3,
    actual: 4,
    weightage: 20,
    status: "not_started",
    quarter: "Q2 2026",
    employeeId: "u1",
    updatedAt: "2026-05-08",
  },
  {
    id: "g4",
    title: "Mentor junior designers",
    description: "Conduct bi-weekly coaching sessions",
    uom: "Sessions",
    target: 12,
    actual: 5,
    weightage: 25,
    status: "on_track",
    quarter: "Q2 2026",
    employeeId: "u1",
    updatedAt: "2026-05-14",
  },
];

export const teamGoals: Goal[] = [
  ...employeeGoals,
  {
    id: "g5",
    title: "Launch mobile app beta",
    description: "Coordinate cross-functional beta release",
    uom: "%",
    target: 100,
    actual: 45,
    weightage: 35,
    status: "pending_approval",
    quarter: "Q2 2026",
    employeeId: "u4",
    employeeName: "Alex Kim",
    updatedAt: "2026-05-15",
  },
  {
    id: "g6",
    title: "Reduce churn rate",
    description: "Implement retention initiatives",
    uom: "%",
    target: 5,
    actual: 3.2,
    weightage: 30,
    status: "on_track",
    quarter: "Q2 2026",
    employeeId: "u5",
    employeeName: "Maria Santos",
    updatedAt: "2026-05-13",
  },
];

export const checkIns: CheckIn[] = employeeGoals.map((g, i) => ({
  id: `c${i}`,
  goalId: g.id,
  goalTitle: g.title,
  planned: g.target,
  actual: g.actual ?? 0,
  status: g.status,
  comment: "",
  quarter: "Q2 2026",
}));

export const activities: ActivityItem[] = [
  { id: "a1", message: "Goal sheet submitted for Q2 review", timestamp: "2026-05-14T10:30:00", type: "goal" },
  { id: "a2", message: "Check-in completed for Design system v2", timestamp: "2026-05-13T15:20:00", type: "checkin" },
  { id: "a3", message: "Manager approved goal weightage changes", timestamp: "2026-05-12T09:00:00", type: "approval" },
  { id: "a4", message: "Quarterly cycle Q2 2026 is now active", timestamp: "2026-05-01T08:00:00", type: "system" },
];

export const teamMembers: TeamMember[] = [
  { id: "u1", name: "Sarah Chen", department: "Product", progress: 72, goalsCount: 4, status: "on_track" },
  { id: "u4", name: "Alex Kim", department: "Engineering", progress: 45, goalsCount: 5, status: "pending_approval" },
  { id: "u5", name: "Maria Santos", department: "Marketing", progress: 88, goalsCount: 4, status: "on_track" },
  { id: "u6", name: "David Park", department: "Sales", progress: 62, goalsCount: 3, status: "on_track" },
  { id: "u7", name: "Lisa Wong", department: "Product", progress: 91, goalsCount: 4, status: "completed" },
];

export const auditLogs: AuditLog[] = [
  { id: "al1", action: "Goal Unlocked", user: "Elena Rodriguez", target: "Sarah Chen — Q2 Goals", timestamp: "2026-05-15T11:00:00", details: "Admin override for late submission" },
  { id: "al2", action: "Cycle Created", user: "Elena Rodriguez", target: "Q3 2026", timestamp: "2026-05-10T14:30:00", details: "New goal cycle with 248 participants" },
  { id: "al3", action: "User Role Updated", user: "Elena Rodriguez", target: "Alex Kim", timestamp: "2026-05-08T09:15:00", details: "Changed from Employee to Manager" },
  { id: "al4", action: "Report Exported", user: "James Mitchell", target: "Team Performance Q2", timestamp: "2026-05-05T16:45:00", details: "CSV export — 24 records" },
];

export const goalCycles: GoalCycle[] = [
  { id: "cy1", name: "Q2 2026", startDate: "2026-04-01", endDate: "2026-06-30", status: "active", participants: 248 },
  { id: "cy2", name: "Q1 2026", startDate: "2026-01-01", endDate: "2026-03-31", status: "closed", participants: 235 },
  { id: "cy3", name: "Q3 2026", startDate: "2026-07-01", endDate: "2026-09-30", status: "upcoming", participants: 0 },
];

export const chartData = {
  progress: [
    { month: "Jan", planned: 20, actual: 15 },
    { month: "Feb", planned: 40, actual: 32 },
    { month: "Mar", planned: 60, actual: 48 },
    { month: "Apr", planned: 75, actual: 58 },
    { month: "May", planned: 90, actual: 72 },
  ],
  teamPerformance: [
    { name: "Sarah", value: 72 },
    { name: "Alex", value: 45 },
    { name: "Maria", value: 88 },
    { name: "David", value: 62 },
    { name: "Lisa", value: 91 },
  ],
  orgCompletion: [
    { department: "Product", completion: 78 },
    { department: "Engineering", completion: 65 },
    { department: "Marketing", completion: 82 },
    { department: "Sales", completion: 71 },
    { department: "HR", completion: 94 },
  ],
  quarterlyTimeline: [
    { quarter: "Q1", progress: 100 },
    { quarter: "Q2", progress: 72 },
    { quarter: "Q3", progress: 0 },
    { quarter: "Q4", progress: 0 },
  ],
};

export const adminUsers = [
  { id: "u1", name: "Sarah Chen", email: "sarah.chen@company.com", role: "Employee", department: "Product", status: "Active" },
  { id: "u4", name: "Alex Kim", email: "alex.kim@company.com", role: "Employee", department: "Engineering", status: "Active" },
  { id: "u2", name: "James Mitchell", email: "james.mitchell@company.com", role: "Manager", department: "Product", status: "Active" },
  { id: "u3", name: "Elena Rodriguez", email: "elena.rodriguez@company.com", role: "Admin", department: "HR", status: "Active" },
  { id: "u8", name: "Tom Bradley", email: "tom.bradley@company.com", role: "Employee", department: "Sales", status: "Inactive" },
];
