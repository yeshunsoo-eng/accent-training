const KEY = "accent-coach-stats-v1";

export type DayStats = {
  seconds: number;
  words: number;
  phrases: number;
  videoSeconds: number;
};

export type StatsData = {
  goalMinutes: number;
  days: Record<string, DayStats>;
};

const emptyDay = (): DayStats => ({ seconds: 0, words: 0, phrases: 0, videoSeconds: 0 });

const defaultData = (): StatsData => ({ goalMinutes: 10, days: {} });

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function loadStats(): StatsData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw) as Partial<StatsData>;
    return {
      goalMinutes: typeof parsed.goalMinutes === "number" ? parsed.goalMinutes : 10,
      days: parsed.days && typeof parsed.days === "object" ? parsed.days : {},
    };
  } catch {
    return defaultData();
  }
}

const listeners = new Set<() => void>();

export function subscribeStats(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function save(data: StatsData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function recordActivity(patch: Partial<DayStats>) {
  const data = loadStats();
  const key = todayKey();
  const day = { ...emptyDay(), ...(data.days[key] ?? {}) };
  day.seconds += patch.seconds ?? 0;
  day.words += patch.words ?? 0;
  day.phrases += patch.phrases ?? 0;
  day.videoSeconds += patch.videoSeconds ?? 0;
  data.days[key] = day;
  save(data);
}

export function setGoalMinutes(goalMinutes: number) {
  const data = loadStats();
  data.goalMinutes = goalMinutes;
  save(data);
}

export function resetStats() {
  save(defaultData());
}

function isActive(day?: DayStats) {
  if (!day) return false;
  return day.seconds > 0 || day.words > 0 || day.phrases > 0 || day.videoSeconds > 0;
}

function dayKeyOffset(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return todayKey(d);
}

export type StatsSummary = {
  goalMinutes: number;
  today: DayStats;
  todayMinutes: number;
  currentStreak: number;
  longestStreak: number;
  last7: { key: string; label: string; active: boolean; isToday: boolean }[];
  totals: DayStats & { activeDays: number };
  weekMinutes: number;
};

export function summarise(data: StatsData = loadStats()): StatsSummary {
  const today = { ...emptyDay(), ...(data.days[todayKey()] ?? {}) };

  // current streak
  let currentStreak = 0;
  for (let i = isActive(data.days[todayKey()]) ? 0 : 1; i < 3650; i++) {
    if (isActive(data.days[dayKeyOffset(i)])) currentStreak++;
    else break;
  }

  // longest streak
  const activeKeys = Object.keys(data.days).filter((k) => isActive(data.days[k])).sort();
  let longestStreak = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of activeKeys) {
    const d = new Date(`${k}T00:00:00`);
    if (prev && (d.getTime() - prev.getTime()) / 86400000 === 1) run++;
    else run = 1;
    prev = d;
    longestStreak = Math.max(longestStreak, run);
  }

  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const offset = 6 - i;
    const d = new Date();
    d.setDate(d.getDate() - offset);
    const key = todayKey(d);
    return { key, label: labels[d.getDay()], active: isActive(data.days[key]), isToday: offset === 0 };
  });

  const totals = Object.values(data.days).reduce(
    (acc, d) => ({
      seconds: acc.seconds + d.seconds,
      words: acc.words + d.words,
      phrases: acc.phrases + d.phrases,
      videoSeconds: acc.videoSeconds + d.videoSeconds,
      activeDays: acc.activeDays + (isActive(d) ? 1 : 0),
    }),
    { ...emptyDay(), activeDays: 0 }
  );

  const weekMinutes = Math.round(
    last7.reduce((sum, d) => sum + (data.days[d.key]?.seconds ?? 0), 0) / 60
  );

  return {
    goalMinutes: data.goalMinutes,
    today,
    todayMinutes: Math.round(today.seconds / 60),
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    last7,
    totals,
    weekMinutes,
  };
}

export function formatDuration(seconds: number) {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
