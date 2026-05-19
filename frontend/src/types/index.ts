export type UserRole = "employee" | "manager" | "admin";

export type GoalStatus = "not_started" | "on_track" | "completed" | "pending_approval" | "approved" | "rejected" | "locked";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  title: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  uom: string;
  target: number;
  actual?: number;
  weightage: number;
  status: GoalStatus;
  quarter: string;
  employeeId: string;
  employeeName?: string;
  comments?: string;
  updatedAt: string;
}

export interface CheckIn {
  id: string;
  goalId: string;
  goalTitle: string;
  planned: number;
  actual: number;
  status: GoalStatus;
  comment: string;
  quarter: string;
}

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  type: "goal" | "checkin" | "approval" | "system";
}

export interface TeamMember {
  id: string;
  name: string;
  department: string;
  progress: number;
  goalsCount: number;
  status: GoalStatus;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface GoalCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "upcoming" | "closed";
  participants: number;
}
