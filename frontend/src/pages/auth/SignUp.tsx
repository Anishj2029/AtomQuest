import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail, Lock, User, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { AuthIllustration } from "@/components/illustrations/AuthIllustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, rolePath } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const ok = await register({
      name,
      email,
      password,
      department,
      title,
    });
    setLoading(false);

    if (ok) {
      toast({ title: "Account created", description: "Welcome to GoalTrack.", variant: "success" });
      navigate(rolePath("employee"));
    } else {
      toast({ title: "Sign up failed", description: "Please check your details and try again.", variant: "error" });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden xl:flex xl:w-1/2 items-center justify-center bg-gradient-to-br from-sky-600 to-indigo-700 text-white">
        <AuthIllustration />
      </div>
      <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 lg:px-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-lg rounded-[2rem] border border-zinc-200 bg-white/95 p-10 shadow-2xl">
          <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Create your account</h1>
          <p className="mt-3 text-sm text-zinc-500">Register with your work email to access GoalTrack.</p>
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input id="name" type="text" placeholder="Jane Doe" className="pl-9" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input id="email" type="email" placeholder="you@company.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-9" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input id="department" type="text" placeholder="Product" className="pl-9" value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" type="text" placeholder="Senior Product Designer" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

              <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50/95 p-5">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-zinc-400">Why GoalTrack?</p>
            <p className="mt-2 text-sm text-zinc-600">Get started quickly with a secure, collaborative goal-setting workspace for your team.</p>
          </div>
          <div className="mt-6 text-center text-sm text-zinc-500">
            Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">Sign in</Link>
          </div>
          <footer className="mt-10 text-center text-xs text-zinc-400">
            GoalTrack © 2026 · Built for modern teams
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
