import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  index = 0,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass-panel rounded-2xl p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-zinc-400">{subtitle}</p>}
          {trend && (
            <p className={cn("mt-2 text-xs font-medium", trend.positive ? "text-emerald-600" : "text-amber-600")}>
              {trend.value}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
