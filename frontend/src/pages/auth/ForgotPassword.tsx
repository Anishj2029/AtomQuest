import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { AuthIllustration } from "@/components/illustrations/AuthIllustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";

export default function ForgotPassword() {
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: "Reset link sent", description: "Check your email for password reset instructions", variant: "success" });
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md">
          <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="mt-2 text-sm text-zinc-500">We will send a secure link to your work email</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input id="email" type="email" placeholder="you@company.com" className="pl-9" required />
              </div>
            </div>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
          <div className="mt-6 text-center text-sm text-zinc-500">
            Need a new account? <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">Sign up</Link>
          </div>
        </motion.div>
      </div>
      <AuthIllustration />
    </div>
  );
}
