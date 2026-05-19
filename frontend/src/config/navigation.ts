import {
  LayoutDashboard,
  Target,
  CalendarCheck,
  History,
  Bell,
  User,
  Users,
  ClipboardCheck,
  MessageSquare,
  FileBarChart,
  ScrollText,
  Building2,
  Settings,
  UserCog,
  RefreshCw,
} from "lucide-react";
import type { NavItem } from "@/components/layout/Sidebar";

export const employeeNav: NavItem[] = [
  { label: "Dashboard", path: "", icon: LayoutDashboard },
  { label: "My Goals", path: "/goals", icon: Target },
  { label: "Quarterly Check-ins", path: "/check-ins", icon: CalendarCheck },
  { label: "Goal History", path: "/history", icon: History },
  { label: "Notifications", path: "/notifications", icon: Bell },
  { label: "Profile", path: "/profile", icon: User },
];

export const managerNav: NavItem[] = [
  { label: "Dashboard", path: "", icon: LayoutDashboard },
  { label: "Team Goals", path: "/team-goals", icon: Users },
  { label: "Approval Queue", path: "/approvals", icon: ClipboardCheck },
  { label: "Quarterly Reviews", path: "/reviews", icon: CalendarCheck },
  { label: "Feedback Logs", path: "/feedback", icon: MessageSquare },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", path: "", icon: LayoutDashboard },
  { label: "User Management", path: "/users", icon: UserCog },
  { label: "Goal Cycles", path: "/cycles", icon: RefreshCw },
  { label: "Reports", path: "/reports", icon: FileBarChart },
  { label: "Audit Logs", path: "/audit", icon: ScrollText },
  { label: "Organization Analytics", path: "/analytics", icon: Building2 },
  { label: "Settings", path: "/settings", icon: Settings },
];
