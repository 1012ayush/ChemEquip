import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  className?: string;
  unit?: string;
}

export function StatCard({ title, value, icon, trend, className, unit }: StatCardProps) {
  return (
    <div className={cn("dashboard-card p-6 flex items-start justify-between group", className)}>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-1">
          <h4 className="text-3xl font-display font-bold text-foreground tracking-tight">{value}</h4>
          {unit && <span className="text-sm text-muted-foreground font-medium">{unit}</span>}
        </div>
        {trend && (
          <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            {trend}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        {icon}
      </div>
    </div>
  );
}
