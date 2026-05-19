import { motion } from "framer-motion";

export function AuthIllustration() {
  return (
    <div className="relative hidden h-full flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-950 lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),_transparent_50%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-lg px-12"
      >
        <div className="w-full max-w-sm drop-shadow-2xl rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur-md mb-8">
          <div className="flex gap-2 mb-6">
            <div className="h-3 w-12 rounded-full bg-white/40" />
            <div className="h-3 w-24 rounded-full bg-white/20" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex gap-4 items-center mb-6">
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-indigo-400 shrink-0">
              <img src="/illustration.png" alt="Team" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="h-3 w-32 rounded-full bg-white/50 mb-2" />
              <div className="text-sm font-medium text-white">Project alpha target met! 🚀</div>
              <div className="text-xs text-indigo-200 mt-1">Goal updated by Sarah</div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-8 w-20 rounded-lg bg-indigo-600" />
            <div className="h-8 w-20 rounded-lg bg-white/15" />
          </div>
        </div>
        <h2 className="mt-10 text-3xl font-semibold tracking-tight text-white">
          Align goals. Drive performance.
        </h2>
        <p className="mt-3 text-lg text-zinc-400">
          Enterprise goal setting and tracking for teams that move with clarity and purpose.
        </p>
        <div className="mt-8 flex gap-6 text-sm text-zinc-500">
          <span>✓ Quarterly cycles</span>
          <span>✓ Role-based access</span>
          <span>✓ Real-time insights</span>
        </div>
      </motion.div>
    </div>
  );
}
