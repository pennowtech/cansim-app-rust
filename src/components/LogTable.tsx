// src/components/LogTable.tsx
import React, { useEffect, useRef } from "react";

export interface LogRow {
  timestamp: string;
  arbitration_id: number;
  payload: number[];
  unique_id: number;
}

interface Props {
  rows: LogRow[];
}

const MAX_ROWS = 10000;

export const LogTable: React.FC<Props> = ({ rows }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [rows.length]);

  const viewRows =
    rows.length > MAX_ROWS ? rows.slice(rows.length - MAX_ROWS) : rows;

  return (
    <div className="h-80 overflow-y-auto border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-[12px] text-slate-800 dark:text-slate-100 font-mono">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700">
          <tr>
            <th className="px-2 py-1 text-left">Time</th>
            <th className="px-2 py-1 text-left">ArbID</th>
            <th className="px-2 py-1 text-left">Payload</th>
            <th className="px-2 py-1 text-left">Unique ID</th>
          </tr>
        </thead>
        <tbody>
          {viewRows.map((row, idx) => (
            <tr
              key={`${row.unique_id}-${idx}`}
              className="odd:bg-slate-50 dark:odd:bg-slate-900/60"
            >
              <td className="px-2 py-1">{row.timestamp}</td>
              <td className="px-2 py-1">{`0x${row.arbitration_id.toString(16)}`}</td>
              <td className="px-2 py-1">
                {row.payload
                  .map((b) => b.toString(16).padStart(2, "0"))
                  .join(" ")}
              </td>
              <td className="px-2 py-1">{row.unique_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={bottomRef} />
    </div>
  );
};
