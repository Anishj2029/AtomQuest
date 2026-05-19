import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { AuthIllustration } from "@/components/illustrations/AuthIllustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEMO = [
  { role: "employee" as const, email: "sarah.chen@company.com",    password: "demo123" },
  { role: "manager"  as const, email: "james.mitchell@company.com", password: "demo123" },
  { role: "admin"    as const, email: "elena.rodriguez@company.com",password: "demo123" },
];

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const { login, rolePath }     = useAuth();
  const { toast }               = useToast();
  const navigate                = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      // role is embedded in the user returned by login
      const stored = localStorage.getItem("goaltrack_user");
      const user   = stored ? JSON.parse(stored) : null;
      toast({ title: "Welcome back", description: `Signed in as ${user?.name ?? email}`, variant: "success" });
      navigate(rolePath(user?.role ?? "employee"));
    } else {
      toast({ title: "Sign in failed", description: "Invalid email or password", variant: "error" });
    }
  };

  const quickLogin = async (d: typeof DEMO[0]) => {
    setEmail(d.email);
    setPassword(d.password);
    setLoading(true);
    const ok = await login(d.email, d.password);
    setLoading(false);
    if (ok) {
      const stored = localStorage.getItem("goaltrack_user");
      const user   = stored ? JSON.parse(stored) : null;
      toast({ title: "Welcome back", description: `Signed in as ${user?.name ?? d.email}`, variant: "success" });
      navigate(rolePath(user?.role ?? "employee"));
    } else {
      toast({ title: "Sign in failed", description: "Invalid email or password", variant: "error" });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden xl:flex xl:w-1/2 items-center justify-center bg-gradient-to-br from-indigo-600 to-sky-600 text-white">
        <AuthIllustration />
      </div>
      <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 lg:px-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-lg rounded-[2rem] border border-zinc-200 bg-white/95 p-10 shadow-2xl">
          <div className="mb-8 flex items-center gap-3 rounded-3xl bg-indigo-600 px-4 py-3 text-white shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white font-bold">G</div>
            <div>
              <p className="text-sm uppercase tracking-[.3em] text-indigo-200">GoalTrack</p>
              <p className="text-base font-semibold">Team goal management, simplified</p>
            </div>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Sign in to GoalTrack</h1>
          <p className="mt-3 text-sm text-zinc-500">Enter your credentials to access your dashboard.</p>
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input id="email" type="email" placeholder="you@company.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-9" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50/95 p-5">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-zinc-400">Demo accounts</p>
            <p className="mt-2 text-sm text-zinc-600">Use one of the preset accounts below to preview employee, manager, and admin dashboards.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {DEMO.map((d) => (
                <button key={d.role} type="button" onClick={() => quickLogin(d)} className="rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition hover:ring-indigo-300 capitalize">
                  {d.role}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-zinc-500">
            Don&apos;t have an account? <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">Sign up</Link>
          </div>
          <footer className="mt-10 text-center text-xs text-zinc-400">
            GoalTrack © 2026 · Secure goal management for teams
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
