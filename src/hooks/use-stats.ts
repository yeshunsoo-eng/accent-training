import { useEffect, useState } from "react";
import { loadStats, subscribeStats, summarise, type StatsSummary } from "@/lib/stats";

export function useStats(): StatsSummary {
  const [summary, setSummary] = useState<StatsSummary>(() => summarise(loadStats()));

  useEffect(() => {
    const update = () => setSummary(summarise(loadStats()));
    update();
    const unsub = subscribeStats(update);
    window.addEventListener("focus", update);
    return () => {
      unsub();
      window.removeEventListener("focus", update);
    };
  }, []);

  return summary;
}
