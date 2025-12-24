// src/components/EventLogPanel.tsx
import React from "react";

type EventLine = { level: string; text: string };

function levelStyle(levelRaw: string) {
  const level = (levelRaw || "INFO").toUpperCase();

  // light theme + dark theme friendly
  switch (level) {
    case "ERROR":
    case "FATAL":
      return {
        badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
        bar: "border-l-red-400 dark:border-l-red-500",
      };
    case "WARN":
    case "WARNING":
      return {
        badge:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
        bar: "border-l-amber-400 dark:border-l-amber-500",
      };
    case "DEBUG":
      return {
        badge:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200",
        bar: "border-l-purple-400 dark:border-l-purple-500",
      };
    case "TRACE":
      return {
        badge:
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        bar: "border-l-slate-300 dark:border-l-slate-600",
      };
    case "SUCCESS":
      return {
        badge:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
        bar: "border-l-emerald-400 dark:border-l-emerald-500",
      };
    case "INFO":
    default:
      return {
        badge:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
        bar: "border-l-blue-400 dark:border-l-blue-500",
      };
  }
}

export const EventLogPanel: React.FC<{ lines: EventLine[] }> = ({ lines }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl flex flex-col h-full min-h-0 overflow-hidden shadow-sm">
      <div className="px-3 py-2 border-b border-slate-300 dark:border-slate-700 text-xs font-semibold">
        Event Log
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-2 text-[11px] leading-tight">
        {lines.length === 0 ? (
          <div className="text-slate-500 dark:text-slate-400">
            No events yet.
          </div>
        ) : (
          <div className="space-y-1">
            {lines.map((l, i) => {
              const st = levelStyle(l.level);
              const lvl = (l.level || "INFO").toUpperCase();
              return (
                <div
                  key={i}
                  className={
                    "border-l-2 " +
                    st.bar +
                    " pl-2 pr-1 py-1 rounded-sm bg-transparent"
                  }
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={
                        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold " +
                        st.badge
                      }
                    >
                      {lvl}
                    </span>
                    <span className="text-slate-800 dark:text-slate-100 break-words">
                      {l.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
