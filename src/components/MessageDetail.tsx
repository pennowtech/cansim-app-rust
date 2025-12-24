// src/components/MessageDetail.tsx
import React from "react";
import type { RxRow } from "./RxTable";

interface Props {
  row: RxRow | null;
}

export const MessageDetail: React.FC<Props> = ({ row }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl flex flex-col text-[12px] text-slate-800 dark:text-slate-100 shadow-sm">
      <div className="px-3 py-2 border-b border-slate-300 dark:border-slate-700 text-xs font-semibold">
        Detail
      </div>
      <pre className="flex-1 overflow-auto text-[12px] p-3 bg-slate-50 dark:bg-slate-950/60 whitespace-pre-wrap font-mono">
        {row
          ? JSON.stringify(
              {
                index: row.index,
                time: row.time,
                interface: row.iface,
                direction: row.dir,
                arb_id_hex: row.arb_id.toString(16),
                payload_hex: row.payload
                  .map((b) => b.toString(16).padStart(2, "0"))
                  .join(" "),
                decoded: row.json,
              },
              null,
              2,
            )
          : "// select a row to see details"}
      </pre>
    </div>
  );
};
