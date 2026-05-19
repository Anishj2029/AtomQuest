# GoalTrack — Full Project Documentation

## Does It Require a Backend to Run?

**Currently: No.** The app is 100% frontend-only. All data lives in `src/lib/mock-data.ts` (in-memory arrays). Auth uses `localStorage`. No API calls are made anywhere.

**To make it production-ready: Yes.** You need a backend + MongoDB to persist goals, users, check-ins, approvals, and audit logs across sessions and users. See the [MongoDB Integration Plan](#mongodb-integration-plan) section at the bottom.

---

## Project Structure

```
goal-portal/
├── src/
│   ├── App.tsx                    # Root router + role-based layouts
│   ├── main.tsx                   # React entry point
│   ├── index.css                  # Tailwind v4 entry
│   ├── config/navigation.ts       # Sidebar nav items per role
│   ├── context/AuthContext.tsx    # Auth state + login/logout
│   ├── lib/
│   │   ├── mock-data.ts           # All static demo data
│   │   └── utils.ts               # Shared utility functions
│   ├── types/index.ts             # TypeScript interfaces
│   ├── components/
│   │   ├── auth/ProtectedRoute.tsx
│   │   ├── charts/GoalCharts.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── shared/
│   │   │   ├── DataTable.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── KpiCard.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── SearchBar.tsx
│   │   └── ui/                    # Radix-based primitives
│   └── pages/
│       ├── auth/Login.tsx, ForgotPassword.tsx
│       ├── employee/  (7 pages)
│       ├── manager/   (5 pages)
│       └── admin/     (7 pages)
```

---

## Types (`src/types/index.ts`)

| Type | Fields | Description |
|------|--------|-------------|
| `UserRole` | `"employee" \| "manager" \| "admin"` | Role enum |
| `GoalStatus` | `"not_started" \| "on_track" \| "completed" \| "pending_approval" \| "approved" \| "rejected" \| "locked"` | Goal lifecycle states |
| `User` | `id, name, email, role, department, avatar?, title` | Authenticated user |
| `Goal` | `id, title, description, uom, target, actual?, weightage, status, quarter, employeeId, employeeName?, comments?, updatedAt` | Core goal entity |
| `CheckIn` | `id, goalId, goalTitle, planned, actual, status, comment, quarter` | Quarterly check-in record |
| `ActivityItem` | `id, message, timestamp, type` | Feed/notification item |
| `TeamMember` | `id, name, department, progress, goalsCount, status` | Manager's team view |
| `AuditLog` | `id, action, user, target, timestamp, details` | Admin audit trail |
| `GoalCycle` | `id, name, startDate, endDate, status, participants` | Quarterly cycle config |

---

## Context (`src/context/AuthContext.tsx`)

### `AuthProvider`
Wraps the app. Reads persisted user from `localStorage` on mount.

### `useAuth()` — returns:

| Member | Type | Description |
|--------|------|-------------|
| `user` | `User \| null` | Currently logged-in user |
| `login(email, password)` | `() => boolean` | Matches against `mockUsers`, stores to `localStorage`, returns `true` on success |
| `logout()` | `() => void` | Clears state and `localStorage` |
| `rolePath(role)` | `(UserRole) => string` | Maps role → base route (`/employee`, `/manager`, `/admin`) |

---

## Routing (`src/App.tsx`)

### Layout Components

| Component | Route | Role Guard |
|-----------|-------|------------|
| `EmployeeLayout` | `/employee/*` | `employee` only |
| `ManagerLayout` | `/manager/*` | `manager` only |
| `AdminLayout` | `/admin/*` | `admin` only |

### `RootRedirect`
Redirects `/` → `/login` if unauthenticated, or → role's base path if logged in.

### Route Map

| Path | Component |
|------|-----------|
| `/login` | `Login` |
| `/forgot-password` | `ForgotPassword` |
| `/employee` | `EmployeeDashboard` |
| `/employee/goals` | `MyGoals` |
| `/employee/goals/create` | `CreateGoals` |
| `/employee/check-ins` | `CheckIns` |
| `/employee/history` | `GoalHistory` |
| `/employee/notifications` | `Notifications` |
| `/employee/profile` | `Profile` |
| `/manager` | `ManagerDashboard` |
| `/manager/team-goals` | `TeamGoals` |
| `/manager/approvals` | `ApprovalQueue` |
| `/manager/reviews` | `QuarterlyReviews` |
| `/manager/feedback` | `FeedbackLogs` |
| `/admin` | `AdminDashboard` |
| `/admin/users` | `UserManagement` |
| `/admin/cycles` | `GoalCycles` |
| `/admin/reports` | `Reports` |
| `/admin/audit` | `AuditLogs` |
| `/admin/analytics` | `OrgAnalytics` |
| `/admin/settings` | `Settings` |

---

## Components

### `ProtectedRoute` (`src/components/auth/ProtectedRoute.tsx`)
- Props: `allowedRoles?: UserRole[]`
- Redirects to `/login` if no user; redirects to user's own role path if role not in `allowedRoles`; otherwise renders `<Outlet />`

### `AppLayout` (`src/components/layout/AppLayout.tsx`)
- Props: `items: NavItem[], basePath: string, children`
- Renders `Sidebar` + `Navbar` + scrollable `<main>`

### `Sidebar` (`src/components/layout/Sidebar.tsx`)
- Props: `items: NavItem[], basePath: string`
- Collapsible (72px ↔ 256px) with Framer Motion label fade
- Active link highlighted via React Router `NavLink`

### `Navbar` (`src/components/layout/Navbar.tsx`)
- Sticky top bar with `SearchBar`, bell icon, and user dropdown (Profile / Settings / Sign out)
- Sign out calls `logout()` then navigates to `/login`

### `PageTransition` (`src/components/layout/PageTransition.tsx`)
- Wraps `<Outlet />` with Framer Motion fade+slide on route change (keyed by `location.pathname`)

### `DataTable<T>` (`src/components/shared/DataTable.tsx`)
- Generic table component
- Props: `columns: Column<T>[], data: T[], emptyMessage?: string`
- Each `Column` has: `key, header, cell: (row: T) => ReactNode, className?`
- Rows animate in with staggered opacity via Framer Motion

### `KpiCard` (`src/components/shared/KpiCard.tsx`)
- Props: `title, value, subtitle?, icon, trend?: { value, positive? }, index?`
- Animated entrance with `index * 0.05s` delay
- Shows optional trend label in green (positive) or amber

### `PageHeader` (`src/components/shared/PageHeader.tsx`)
- Props: `title, description?, actions?`
- Renders heading + optional right-side action slot (e.g. buttons)

### `SearchBar` (`src/components/shared/SearchBar.tsx`)
- Props: `value?, onChange?, placeholder?, className?`
- Controlled or uncontrolled search input with search icon

### `EmptyState` (`src/components/shared/EmptyState.tsx`)
- Props: `icon, title, description`
- Centered empty placeholder with icon

---

## Charts (`src/components/charts/GoalCharts.tsx`)

All charts use Recharts inside `ResponsiveContainer`. Data sourced from `chartData` in `mock-data.ts`.

| Component | Chart Type | Data Key | Description |
|-----------|-----------|----------|-------------|
| `ProgressChart` | AreaChart | `chartData.progress` | Planned vs actual monthly progress |
| `TeamBarChart` | BarChart | `chartData.teamPerformance` | Per-member completion % |
| `OrgBarChart` | BarChart (horizontal) | `chartData.orgCompletion` | Department completion % |
| `QuarterlyTimelineChart` | BarChart | `chartData.quarterlyTimeline` | Q1–Q4 progress bars |
| `HeatmapGrid` | CSS grid | `TeamMember[]` prop | Color-intensity grid by progress % |

---

## Pages

### Employee Pages

#### `EmployeeDashboard`
- KPI cards: Active Goals, Completion %, Next Check-in, On Track count
- Charts: `ProgressChart`, `QuarterlyTimelineChart`
- Recent activity feed from `activities`
- Upcoming check-ins with progress bars

#### `MyGoals`
- Filterable/searchable table of `employeeGoals`
- Columns: Goal, UoM, Target, Actual, Weight, Progress bar, Status badge
- Filter by status via `FilterSelect`

#### `CreateGoals`
- Multi-goal form (up to 8 goals)
- `addGoal()` — appends new empty goal form (max 8)
- `removeGoal(id)` — removes goal by id (min 1)
- `update(id, field, value)` — updates a single field on a goal
- `handleSubmit(e)` — validates total weightage === 100%, shows toast, navigates to `/employee/goals`
- Live weightage progress bar with validation warning

#### `CheckIns`
- Table with Radix Slider for actual value input per goal
- `updateRow(id, patch)` — merges partial update into check-in row
- Status dropdown per row
- Overall comments textarea + submit button

#### `GoalHistory`
- Read-only table combining Q1 (completed) + Q2 (current) goals
- Columns: Quarter, Goal, Weight, Status

#### `Notifications`
- List of activity items with read/unread ring highlight
- Falls back to `EmptyState` if empty

#### `Profile`
- Editable name + job title; read-only email + department
- Save triggers success toast (no persistence in current mock state)

---

### Manager Pages

#### `ManagerDashboard`
- KPI cards: Team Members, Pending Approvals, Avg. Completion, At Risk
- Charts: `TeamBarChart`, `HeatmapGrid`
- Recent submissions card linking to approval queue

#### `TeamGoals`
- Searchable table of all `teamGoals`
- Columns: Employee, Goal, Target/Actual, Weight, Status

#### `ApprovalQueue`
- `handleAction(id, action)` — sets goal status to `"approved"` or `"rejected"`, shows toast
- `toggleLock(id)` — toggles goal between `"locked"` and `"approved"`
- `GoalApprovalCard` sub-component — editable title, manager comment textarea, Approve/Reject/Lock buttons
- Confirm dialog before approve/reject

#### `QuarterlyReviews`
- Card per team member showing overall progress bar + top 2 goals
- Review comments textarea + save button per member

#### `FeedbackLogs`
- Static table of manager coaching notes
- Columns: Employee, Date, Feedback

---

### Admin Pages

#### `AdminDashboard`
- KPI cards: Total Employees, Active Cycles, Org Completion, Departments
- Charts: `OrgBarChart`, `HeatmapGrid`

#### `UserManagement`
- Searchable table of `adminUsers`
- Columns: Name, Email, Role, Department, Status badge, Edit button
- Add user button (UI only, no form in current state)

#### `GoalCycles`
- Table of `goalCycles` with period, participants, status badge
- Active cycles show "Unlock goals" button → confirm dialog
- `exportReport(name, type)` — triggers success toast

#### `Reports`
- 4 report cards (Org Summary, Dept Performance, Cycle Audit, Approval Metrics)
- CSV and Excel export buttons per report (toast only, no real file download)

#### `AuditLogs`
- Read-only table of `auditLogs`
- Columns: Action, User, Target, Timestamp, Details

#### `OrgAnalytics`
- `OrgBarChart` + `ProgressChart` side by side
- `HeatmapGrid` full width below

#### `Settings`
- Max goals per employee (number input)
- Default cycle duration (select: Quarterly / Bi-annual / Annual)
- Save triggers success toast

---

## Utility Functions (`src/lib/utils.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `cn` | `(...inputs: ClassValue[]) => string` | Merges Tailwind classes using `clsx` + `tailwind-merge` |
| `formatDate` | `(date: string \| Date) => string` | Formats to `"May 10, 2026"` using `Intl.DateTimeFormat` |
| `formatPercent` | `(value: number) => string` | Returns `"72%"` string |

---

## Navigation Config (`src/config/navigation.ts`)

Three exported arrays of `NavItem[]` — one per role:

| Export | Role | Items |
|--------|------|-------|
| `employeeNav` | Employee | Dashboard, My Goals, Quarterly Check-ins, Goal History, Notifications, Profile |
| `managerNav` | Manager | Dashboard, Team Goals, Approval Queue, Quarterly Reviews, Feedback Logs |
| `adminNav` | Admin | Dashboard, User Management, Goal Cycles, Reports, Audit Logs, Organization Analytics, Settings |

Each `NavItem`: `{ label: string, path: string, icon: LucideIcon }`

---

## Mock Data (`src/lib/mock-data.ts`)

| Export | Type | Description |
|--------|------|-------------|
| `mockUsers` | `Record<string, User & { password }>` | 3 demo users (employee, manager, admin) |
| `employeeGoals` | `Goal[]` | 4 goals for Sarah Chen (Q2 2026) |
| `teamGoals` | `Goal[]` | `employeeGoals` + 2 extra team member goals |
| `checkIns` | `CheckIn[]` | Derived from `employeeGoals` |
| `activities` | `ActivityItem[]` | 4 activity feed items |
| `teamMembers` | `TeamMember[]` | 5 team members with progress % |
| `auditLogs` | `AuditLog[]` | 4 admin audit entries |
| `goalCycles` | `GoalCycle[]` | Q1 (closed), Q2 (active), Q3 (upcoming) |
| `chartData` | object | `progress`, `teamPerformance`, `orgCompletion`, `quarterlyTimeline` arrays |
| `adminUsers` | array | 5 users for admin user management table |

---

## UI Primitives (`src/components/ui/`)

All built on Radix UI primitives with Tailwind styling:

| File | Radix Primitive | Key Exports |
|------|----------------|-------------|
| `badge.tsx` | — | `Badge`, `StatusBadge` (maps `GoalStatus` → color) |
| `button.tsx` | `@radix-ui/react-slot` | `Button` (variants: default, outline, ghost, secondary, destructive) |
| `card.tsx` | — | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` |
| `dialog.tsx` | `@radix-ui/react-dialog` | `ConfirmDialog` (title, description, confirmLabel, variant, onConfirm) |
| `input.tsx` | — | `Input` |
| `label.tsx` | `@radix-ui/react-label` | `Label` |
| `progress.tsx` | `@radix-ui/react-progress` | `Progress` (value 0–100) |
| `select.tsx` | `@radix-ui/react-select` | `Select`, `FilterSelect` |
| `skeleton.tsx` | — | `Skeleton` |
| `tabs.tsx` | `@radix-ui/react-tabs` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| `textarea.tsx` | — | `Textarea` |
| `toast.tsx` | `@radix-ui/react-toast` | `ToastProvider`, `useToast()` → `toast({ title, description?, variant? })` |

---

## MongoDB Integration Plan

To replace mock data with a real MongoDB backend, here's the recommended approach:

### Backend Stack
- **Node.js + Express** (or **Fastify**) REST API
- **Mongoose** ODM for MongoDB schemas
- **JWT** for authentication (replace `localStorage` plain-object auth)

### MongoDB Collections

```
users          → User documents (hashed passwords, role, department)
goals          → Goal documents (linked to userId, cycleId)
checkins       → CheckIn documents (linked to goalId)
goalcycles     → GoalCycle documents
auditlogs      → AuditLog documents (append-only)
feedbacklogs   → Manager feedback entries
notifications  → ActivityItem documents per user
```

### Mongoose Schema Examples

```js
// User
{ name, email, passwordHash, role, department, title, createdAt }

// Goal
{ title, description, uom, target, actual, weightage, status,
  quarter, cycleId, employeeId, managerId, comments, updatedAt }

// CheckIn
{ goalId, employeeId, planned, actual, status, comment, quarter, submittedAt }

// GoalCycle
{ name, startDate, endDate, status, participants }

// AuditLog
{ action, userId, targetDescription, details, timestamp }
```

### API Endpoints Needed

| Method | Endpoint | Used By |
|--------|----------|---------|
| POST | `/api/auth/login` | `AuthContext.login()` |
| GET | `/api/goals?employeeId=` | `MyGoals`, `EmployeeDashboard` |
| POST | `/api/goals` | `CreateGoals.handleSubmit()` |
| PATCH | `/api/goals/:id` | `ApprovalQueue.handleAction()`, `CheckIns.updateRow()` |
| GET | `/api/goals/team?managerId=` | `TeamGoals`, `ManagerDashboard` |
| GET | `/api/checkins?employeeId=` | `CheckIns` |
| POST | `/api/checkins` | `CheckIns` submit |
| GET | `/api/cycles` | `GoalCycles` |
| POST | `/api/cycles` | `GoalCycles` create |
| GET | `/api/users` | `UserManagement` |
| GET | `/api/audit` | `AuditLogs` |
| GET | `/api/analytics/org` | `OrgAnalytics`, `AdminDashboard` |

### Frontend Changes Required

1. Replace `mockUsers` auth in `AuthContext.login()` with `fetch('/api/auth/login', ...)`
2. Store JWT token in `localStorage` instead of raw user object
3. Add an `api.ts` service layer (axios or fetch wrapper with auth headers)
4. Replace all `import { ... } from "@/lib/mock-data"` in pages with `useEffect` + API calls
5. Add loading states (use existing `Skeleton` component)
6. Add error boundaries / error toasts on failed requests

