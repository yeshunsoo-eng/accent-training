import { useEffect, useRef } from "react";
import { recordActivity } from "@/lib/stats";

const TICK = 15; // seconds

/**
 * Logs practice time in 15-second chunks while `active` is true.
 * Flushes any remaining seconds on unmount.
 */
export function usePracticeClock(active: boolean) {
  const pending = useRef(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      pending.current += 1;
      if (pending.current >= TICK) {
        recordActivity({ seconds: pending.current });
        pending.current = 0;
      }
    }, 1000);
    return () => {
      clearInterval(id);
      if (pending.current > 0) {
        recordActivity({ seconds: pending.current });
        pending.current = 0;
      }
    };
  }, [active]);
}
