import { useEffect, useState } from "react";

export function useSessionState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    const stored = sessionStorage.getItem(key);
    if (!stored) return defaultValue;

    try {
      const parsed = JSON.parse(stored);

      // Parse date fields for TimeSlot
      if (Array.isArray(parsed)) {
        return parsed.map((slot) => ({
          ...slot,
          start: new Date(slot.start),
          end: new Date(slot.end),
        })) as T;
      }

      return parsed;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
