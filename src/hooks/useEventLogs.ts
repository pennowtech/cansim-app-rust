/**
 * useEventLogs.ts
 * ------------------------------------------------------------
 * Centralized logging hook for UI panels.
 *
 * RESPONSIBILITY
 * - Store decoded CAN logs
 * - Store app/system event logs
 * - Provide append + clear APIs
 *
 * CONVENTIONS
 * - No formatting
 * - No persistence
 *
 * ALLOWED
 * - useState
 * - useCallback
 *
 * NOT ALLOWED
 * - Console logging
 * - Side effects
 *
 * DESIGN GOAL
 * - All logs flow through one place
 * - Easy to later add persistence or export
 */

import { useCallback, useState } from "react";

export function useEventLogs() {
  const [decodedLines, setDecodedLines] = useState<string[]>([]);
  const [eventLines, setEventLines] = useState<{ level: string; text: string }[]>([]);

  const logEvent = useCallback((text: string, level: string = "INFO") => {
    setEventLines((prev) => [...prev, { level, text }]);
  }, []);

  const appendDecodedLine = useCallback((line: string) => {
    setDecodedLines((prev) => [...prev, line]);
  }, []);

  const clearLogs = useCallback(() => {
    setDecodedLines([]);
    setEventLines([]);
  }, []);

  return { decodedLines, eventLines, logEvent, appendDecodedLine, clearLogs };
}
