import { X, Flame, Clock, Mic, Headphones, Video, Trophy } from "lucide-react";
import { useStats } from "@/hooks/use-stats";
import { formatDuration, resetStats, setGoalMinutes } from "@/lib/stats";

const GOALS = [5, 10, 15, 20];

export default function StatsPanel({ onClose }: { onClose: () => void }) {
  const stats = useStats();

  const tiles = [
    { icon: Clock, label: "Total practice", value: formatDuration(stats.totals.seconds) },
    { icon: Mic, label: "Words spoken", value: `${stats.totals.words}` },
    { icon: Headphones, label: "Phrases mimicked", value: `${stats.totals.phrases}` },
    { icon: Video, label: "Video practice", value: formatDuration(stats.totals.videoSeconds) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display text-foreground">Your progress</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full bg-secondary text-secondary-foreground active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card border border-border/60 rounded-2xl p-4">
            <Flame className="w-5 h-5 text-accent mb-2" />
            <p className="text-2xl font-display text-foreground">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Current streak</p>
          </div>
          <div className="bg-card border border-border/60 rounded-2xl p-4">
            <Trophy className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-display text-foreground">{stats.longestStreak}</p>
            <p className="text-xs text-muted-foreground">Best streak</p>
          </div>
        </div>

        <p className="text-sm font-medium text-foreground mb-2">This week</p>
        <div className="bg-card border border-border/60 rounded-2xl p-4 mb-6">
          <p className="text-2xl font-display text-foreground">{stats.weekMinutes} min</p>
          <p className="text-xs text-muted-foreground">
            practised across the last 7 days · {stats.totals.activeDays} active days all time
          </p>
        </div>

        <p className="text-sm font-medium text-foreground mb-2">All time</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {tiles.map((t) => (
            <div key={t.label} className="bg-card border border-border/60 rounded-2xl p-4">
              <t.icon className="w-5 h-5 text-muted-foreground mb-2" />
              <p className="text-xl font-display text-foreground">{t.value}</p>
              <p className="text-xs text-muted-foreground">{t.label}</p>
            </div>
          ))}
        </div>

        <p className="text-sm font-medium text-foreground mb-2">Daily goal</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {GOALS.map((g) => (
            <button
              key={g}
              onClick={() => setGoalMinutes(g)}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                stats.goalMinutes === g
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {g} min
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (confirm("Reset all your practice history?")) resetStats();
          }}
          className="w-full py-3 rounded-full bg-secondary text-muted-foreground text-sm font-medium active:scale-95"
        >
          Reset progress
        </button>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Your progress is stored on this device only.
        </p>
      </div>
    </div>
  );
}
