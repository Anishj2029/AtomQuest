// Central API client — all backend calls go through here.
// Token is read from localStorage on every request so it's always fresh.

const BASE = import.meta.env.VITE_API_URL ?? "/api";

function getToken(): string | null {
  try {
    const raw = localStorage.getItem("goaltrack_token");
    return raw ?? null;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const json = await res.json().catch(() => ({ message: "Unknown error" }));

  if (!res.ok) {
    throw new Error(json.message ?? `HTTP ${res.status}`);
  }
  return json.data as T;
}

const get  = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body) });
const patch = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
const del  = <T>(path: string) => request<T>(path, { method: "DELETE" });

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login:  (email: string, password: string) =>
    post<{ token: string; user: ApiUser }>("/auth/login", { email, password }),
  register: (body: RegisterPayload) =>
    post<{ token: string; user: ApiUser }>("/auth/register", body),
  me: () => get<ApiUser>("/auth/me"),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersApi = {
  list:   (params?: string) => get<ApiUser[]>(`/users${params ? `?${params}` : ""}`),
  byId:   (id: string)      => get<ApiUser>(`/users/${id}`),
  update: (id: string, body: Partial<ApiUser>) => patch<ApiUser>(`/users/${id}`, body),
};

// ─── Goals ────────────────────────────────────────────────────────────────────
export interface UpdateGoalPayload extends Partial<CreateGoalPayload> {
  status?: ApiGoal["status"];
  description?: string;
  comments?: string;
  managerFeedback?: string;
  isLocked?: boolean;
}

export const goalsApi = {
  list:    (params?: string) => get<ApiGoal[]>(`/goals${params ? `?${params}` : ""}`),
  byId:    (id: string)      => get<ApiGoal>(`/goals/${id}`),
  create:  (body: CreateGoalPayload) => post<ApiGoal>("/goals", body),
  update:  (id: string, body: UpdateGoalPayload) => patch<ApiGoal>(`/goals/${id}`, body),
  delete:  (id: string)      => del<null>(`/goals/${id}`),
  submit:  (id: string)      => post<ApiGoal>(`/goals/${id}/submit`),
  approve: (id: string, feedback?: string) => post<ApiGoal>(`/goals/${id}/approve`, { feedback }),
  reject:  (id: string, feedback: string)  => post<ApiGoal>(`/goals/${id}/reject`, { feedback }),
  unlock:  (id: string)      => post<ApiGoal>(`/goals/${id}/unlock`),
};

// ─── Check-ins ────────────────────────────────────────────────────────────────
export const checkInsApi = {
  list:   (params?: string) => get<ApiCheckIn[]>(`/checkins${params ? `?${params}` : ""}`),
  create: (body: CreateCheckInPayload) => post<ApiCheckIn>("/checkins", body),
  update: (id: string, body: Partial<CreateCheckInPayload>) => patch<ApiCheckIn>(`/checkins/${id}`, body),
};

// ─── Cycles ───────────────────────────────────────────────────────────────────
export const cyclesApi = {
  list:   () => get<ApiCycle[]>("/cycles"),
  create: (body: CreateCyclePayload) => post<ApiCycle>("/cycles", body),
  update: (id: string, body: Partial<CreateCyclePayload>) => patch<ApiCycle>(`/cycles/${id}`, body),
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const auditApi = {
  list: (params?: string) =>
    get<{ logs: ApiAuditLog[]; pagination: { total: number; page: number; pages: number } }>(
      `/auditlogs${params ? `?${params}` : ""}`
    ),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationsApi = {
  list:       () => get<ApiNotification[]>("/notifications"),
  markRead:   (id: string) => patch<ApiNotification>(`/notifications/${id}/read`),
  markAllRead: () => patch<null>("/notifications/read-all"),
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsApi = {
  employee: (quarter?: string) =>
    get<EmployeeAnalytics>(`/analytics/employee${quarter ? `?quarter=${quarter}` : ""}`),
  team: (quarter?: string) =>
    get<TeamAnalytics>(`/analytics/team${quarter ? `?quarter=${quarter}` : ""}`),
  org: (quarter?: string) =>
    get<OrgAnalytics>(`/analytics/org${quarter ? `?quarter=${quarter}` : ""}`),
};

// ─── API Types (backend shape) ────────────────────────────────────────────────
export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: "employee" | "manager" | "admin";
  department: string;
  title: string;
  managerId?: string | ApiUser;
  isActive: boolean;
  createdAt: string;
}

export interface ApiGoal {
  _id: string;
  employeeId: ApiUser | string;
  managerId?: ApiUser | string;
  cycleId?: string;
  title: string;
  description: string;
  uomType: string;
  target: number;
  actual: number;
  weightage: number;
  status: "draft" | "submitted" | "pending_approval" | "approved" | "rejected" | "on_track" | "completed" | "locked";
  quarter: string;
  comments: string;
  managerFeedback: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCheckIn {
  _id: string;
  goalId: ApiGoal | string;
  employeeId: ApiUser | string;
  plannedValue: number;
  actualValue: number;
  status: "not_started" | "on_track" | "completed" | "at_risk";
  comment: string;
  quarter: string;
  submittedAt: string;
}

export interface ApiCycle {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "closed";
  participants: number;
  createdBy?: ApiUser | string;
}

export interface ApiAuditLog {
  _id: string;
  action: string;
  changedBy: ApiUser | string;
  targetType: string;
  targetId: string;
  oldValue?: unknown;
  newValue?: unknown;
  details: string;
  timestamp: string;
}

export interface ApiNotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: "goal" | "checkin" | "approval" | "system";
  createdAt: string;
}

export interface EmployeeAnalytics {
  total: number;
  completed: number;
  onTrack: number;
  pending: number;
  completionPct: number;
  byQuarter: { _id: string; count: number; avgCompletion: number }[];
  goals: ApiGoal[];
}

export interface TeamAnalytics {
  teamSize: number;
  avgCompletion: number;
  pendingApprovals: number;
  memberStats: { id: string; name: string; department: string; goalsCount: number; progress: number; pending: number }[];
}

export interface OrgAnalytics {
  totalEmployees: number;
  totalGoals: number;
  orgCompletion: number;
  statusDistribution: Record<string, number>;
  departmentStats: { _id: string; totalGoals: number; avgCompletion: number }[];
}

// ─── Payload types ────────────────────────────────────────────────────────────
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
  title?: string;
  managerId?: string;
}

export interface CreateGoalPayload {
  title: string;
  description?: string;
  uomType: string;
  target: number;
  weightage: number;
  quarter: string;
  cycleId?: string;
}

export interface CreateCheckInPayload {
  goalId: string;
  plannedValue: number;
  actualValue: number;
  status?: string;
  comment?: string;
  quarter: string;
}

export interface CreateCyclePayload {
  name: string;
  startDate: string;
  endDate: string;
  status?: string;
}
