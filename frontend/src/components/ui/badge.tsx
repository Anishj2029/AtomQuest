import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10",
        success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10",
        warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10",
        danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
        neutral: "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-500/10",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: VariantProps<typeof badgeVariants>["variant"] }> = {
    not_started: { label: "Not Started", variant: "neutral" },
    on_track: { label: "On Track", variant: "default" },
    completed: { label: "Completed", variant: "success" },
    pending_approval: { label: "Pending", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    rejected: { label: "Rejected", variant: "danger" },
    locked: { label: "Locked", variant: "neutral" },
  };
  const item = map[status] ?? { label: status, variant: "neutral" as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
