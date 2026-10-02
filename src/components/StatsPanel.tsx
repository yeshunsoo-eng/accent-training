import { Flame, Clock, Mic, Headphones, Video, Trophy } from "lucide-react";
import { useStats } from "@/hooks/use-stats";
import { formatDuration, resetStats, setGoalMinutes } from "@/lib/stats";
import { Button } from "@/components/ui/button";

const GOALS = [5, 10, 15, 20];

export default function StatsPanel() {
  const stats = useStats();
  const progress = Math.min(100, Math.round((stats.todayMinutes / stats.goalMinutes) * 100));

  const tiles = [
    { icon: Clock, label: "Total practice", value: formatDuration(stats.totals.seconds) },
    { icon: Mic, label: "Words spoken", value: `${stats.totals.words}` },
    { icon: Headphones, label: "Phrases mimicked", value: `${stats.totals.phrases}` },
    { icon: Video, label: "Video practice", value: formatDuration(stats.totals.videoSeconds) },
  ];

  return (
    <section className="animate-fade-up">
        <div className="mb-6 rounded-lg bg-primary p-5 text-primary-foreground">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-sm text-primary-foreground/80">Today’s practice</p>
              <p className="mt-1 text-3xl font-display tabular-nums">{stats.todayMinutes} min</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Flame className="h-5 w-5" />
              {stats.currentStreak} day streak
            </div>
          </div>
          <div className="mb-2 h-2 overflow-hidden rounded-full bg-primary-foreground/20">
            <div className="h-full rounded-full bg-primary-foreground transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-primary-foreground/80">{stats.todayMinutes} of {stats.goalMinutes} minute goal</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card border border-border/60 rounded-lg p-4">
            <Flame className="w-5 h-5 text-accent mb-2" />
            <p className="text-2xl font-display text-foreground">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Current streak</p>
          </div>
          <div className="bg-card border border-border/60 rounded-lg p-4">
            <Trophy className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-display text-foreground">{stats.longestStreak}</p>
            <p className="text-xs text-muted-foreground">Best streak</p>
          </div>
        </div>

        <p className="text-sm font-semibold text-foreground mb-2">This week</p>
        <div className="bg-card border border-border/60 rounded-lg p-4 mb-6">
          <div className="mb-4 flex items-baseline justify-between">
            <p className="text-2xl font-display text-foreground">{stats.weekMinutes} min</p>
            <p className="text-xs text-muted-foreground">{stats.totals.activeDays} active days all time</p>
          </div>
          <div className="flex justify-between">
            {stats.last7.map((day) => (
              <div key={day.key} className="flex flex-col items-center gap-1.5">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${day.active ? "bg-primary text-primary-foreground" : day.isToday ? "border border-primary text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {day.label}
                </span>
                <span className="text-[10px] text-muted-foreground">{day.isToday ? "Today" : ""}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm font-medium text-foreground mb-2">All time</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {tiles.map((t) => (
            <div key={t.label} className="bg-card border border-border/60 rounded-lg p-4">
              <t.icon className="w-5 h-5 text-muted-foreground mb-2" />
              <p className="text-xl font-display text-foreground">{t.value}</p>
              <p className="text-xs text-muted-foreground">{t.label}</p>
            </div>
          ))}
        </div>

        <p className="text-sm font-medium text-foreground mb-2">Daily goal</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {GOALS.map((g) => (
            <Button
              key={g}
              onClick={() => setGoalMinutes(g)}
              variant={stats.goalMinutes === g ? "default" : "secondary"}
              size="sm"
              className="w-full px-1"
            >
              {g} min
            </Button>
          ))}
        </div>

        <Button
          onClick={() => {
            if (confirm("Reset all your practice history?")) resetStats();
          }}
          variant="secondary"
          className="w-full text-muted-foreground"
        >
          Reset progress
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Your progress is stored on this device only.
        </p>
    </section>
  );
}
