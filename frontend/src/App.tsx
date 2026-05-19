import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { employeeNav, managerNav, adminNav } from "@/config/navigation";

import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";

import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import MyGoals from "@/pages/employee/MyGoals";
import CreateGoals from "@/pages/employee/CreateGoals";
import CheckIns from "@/pages/employee/CheckIns";
import GoalHistory from "@/pages/employee/GoalHistory";
import Notifications from "@/pages/employee/Notifications";
import Profile from "@/pages/employee/Profile";

import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import TeamGoals from "@/pages/manager/TeamGoals";
import ApprovalQueue from "@/pages/manager/ApprovalQueue";
import QuarterlyReviews from "@/pages/manager/QuarterlyReviews";
import FeedbackLogs from "@/pages/manager/FeedbackLogs";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import GoalCycles from "@/pages/admin/GoalCycles";
import Reports from "@/pages/admin/Reports";
import AuditLogs from "@/pages/admin/AuditLogs";
import OrgAnalytics from "@/pages/admin/OrgAnalytics";
import Settings from "@/pages/admin/Settings";

function RootRedirect() {
  const { user, rolePath } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={rolePath(user.role)} replace />;
}

function EmployeeLayout() {
  return (
    <AppLayout items={employeeNav} basePath="/employee">
      <PageTransition />
    </AppLayout>
  );
}

function ManagerLayout() {
  return (
    <AppLayout items={managerNav} basePath="/manager">
      <PageTransition />
    </AppLayout>
  );
}

function AdminLayout() {
  return (
    <AppLayout items={adminNav} basePath="/admin">
      <PageTransition />
    </AppLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<RootRedirect />} />

            <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
              <Route path="/employee" element={<EmployeeLayout />}>
                <Route index element={<EmployeeDashboard />} />
                <Route path="goals" element={<MyGoals />} />
                <Route path="goals/create" element={<CreateGoals />} />
                <Route path="check-ins" element={<CheckIns />} />
                <Route path="history" element={<GoalHistory />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
              <Route path="/manager" element={<ManagerLayout />}>
                <Route index element={<ManagerDashboard />} />
                <Route path="team-goals" element={<TeamGoals />} />
                <Route path="approvals" element={<ApprovalQueue />} />
                <Route path="reviews" element={<QuarterlyReviews />} />
                <Route path="feedback" element={<FeedbackLogs />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="cycles" element={<GoalCycles />} />
                <Route path="reports" element={<Reports />} />
                <Route path="audit" element={<AuditLogs />} />
                <Route path="analytics" element={<OrgAnalytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
