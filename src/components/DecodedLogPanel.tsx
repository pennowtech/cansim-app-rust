// src/components/DecodedLogPanel.tsx
import React from "react";

interface Props {
  lines: string[];
}

export const DecodedLogPanel: React.FC<Props> = ({ lines }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl flex flex-col text-[12px] text-slate-800 dark:text-slate-100 shadow-sm">
      <div className="px-3 py-2 border-b border-slate-300 dark:border-slate-700 text-xs font-semibold">
        Decoded Log
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-2 font-mono text-[11px] leading-tight whitespace-pre-wrap">
        {lines.length === 0 ? (
          <div className="text-slate-500 dark:text-slate-400">
            No decoded logs yet.
          </div>
        ) : (
          lines.map((l, i) => <div key={i}>{l}</div>)
        )}
      </div>
    </div>
  );
};
