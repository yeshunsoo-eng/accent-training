import { Flame, ChevronRight } from "lucide-react";
import { useStats } from "@/hooks/use-stats";

export default function ProgressCard({ onOpen }: { onOpen: () => void }) {
  const stats = useStats();
  const pct = Math.min(100, Math.round((stats.todayMinutes / stats.goalMinutes) * 100));

  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-card border border-border/60 rounded-2xl p-5 transition-all duration-300 hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <Flame className="w-4 h-4 text-accent" />
          </span>
          <span className="text-sm font-medium text-foreground">
            {stats.currentStreak > 0
              ? `${stats.currentStreak}-day streak`
              : "Start your streak today"}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs text-muted-foreground">Today</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {stats.todayMinutes} / {stats.goalMinutes} min
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between">
        {stats.last7.map((d, i) => (
          <div key={d.key} className="flex flex-col items-center gap-1.5">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-colors ${
                d.active
                  ? "bg-primary text-primary-foreground"
                  : d.isToday
                  ? "border border-primary/50 text-muted-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {d.label}
            </span>
            <span className="sr-only">{d.key}</span>
            <span className="text-[10px] text-muted-foreground">{i === 6 ? "Today" : ""}</span>
          </div>
        ))}
      </div>
    </button>
  );
}
