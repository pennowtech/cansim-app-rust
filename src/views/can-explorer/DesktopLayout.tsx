/**
 * DesktopLayout.tsx
 * ------------------------------------------------------------
 * Desktop CAN layout with resizable panels.
 *
 * RESPONSIBILITY
 * - Grid-based desktop layout
 * - Panel positioning
 * - Delegates resizing behavior to hooks
 *
 * CONVENTIONS
 * - Layout-only
 * - No state except callbacks
 *
 * ALLOWED
 * - CSS grid / flex layouts
 * - Mouse event forwarding (splitter)
 *
 * NOT ALLOWED
 * - Resizing math
 * - CAN logic
 * - Filtering logic
 *
 * DESIGN GOAL
 * - Desktop UX is fully isolated here
 * - Easy to redesign without touching logic
 */

import { FilterPanel } from "@/components/FilterPanel";
import { DataTable } from "@/components/DataTable";
import { DetailPanel } from "@/components/DetailPanel";
import { DecodedLogPanel } from "@/components/DecodedLogPanel";
import { EventLogPanel } from "@/components/EventLogPanel";
import { TxPanel } from "@/components/TxPanel";
import { FilterCriteria, MessageRecord, TxParams } from "@/types";

export function DesktopLayout(props: {
  criteria: FilterCriteria;
  onApplyCriteria: (c: FilterCriteria) => void;
  onClearCriteria: () => void;

  records: MessageRecord[];
  visibleRecords: MessageRecord[];
  selected: MessageRecord | null;
  onSelect: (r: MessageRecord | null) => void;
  onSetFilterField: (field: keyof FilterCriteria, value: string) => void;

  tx: TxParams;
  onChangeTx: (next: TxParams) => void;
  onSendTx: (iface: string, params: TxParams) => void;

  decodedLines: string[];
  eventLines: { level: string; text: string }[];
  logEvent: (t: string, lvl?: string) => void;

  onLoadTxFromRow: (row: MessageRecord) => void;
  onSendRowToCan: (row: MessageRecord) => void;

  detailWidth: number;
  onSplitterMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const {
    criteria,
    onApplyCriteria,
    onClearCriteria,
    records,
    visibleRecords,
    selected,
    onSelect,
    onSetFilterField,
    tx,
    onChangeTx,
    onSendTx,
    decodedLines,
    eventLines,
    logEvent,
    onLoadTxFromRow,
    onSendRowToCan,
    detailWidth,
    onSplitterMouseDown,
  } = props;

  return (
    <div className="hidden md:flex flex-col min-h-0 gap-2 overflow-hidden">
      <div
        className="flex-1 min-h-0 grid gap-2 overflow-hidden"
        style={{ gridTemplateColumns: `260px minmax(0,1fr) 4px ${detailWidth}px 320px` }}
      >
        <div className="h-full min-h-0">
          <FilterPanel criteria={criteria} onApply={onApplyCriteria} onClear={onClearCriteria} />
        </div>

        <div className="h-full min-h-0">
          <DataTable
            records={visibleRecords}
            allRecords={records}
            onSelect={onSelect}
            selected={selected}
            onSetFilterField={onSetFilterField}
            onLoadTxFromRow={onLoadTxFromRow}
            onSendRowToCan={onSendRowToCan}
            logEvent={logEvent}
          />
        </div>

        <div
          className="h-full min-h-0 cursor-col-resize bg-slate-200 dark:bg-slate-700 rounded-md"
          onMouseDown={onSplitterMouseDown}
        />

        <div className="h-full min-h-0">
          <DetailPanel record={selected} />
        </div>

        <div className="h-full min-h-0">
          <TxPanel
            selectedRow={selected}
            tx={tx}
            onChangeTx={onChangeTx}
            onSend={onSendTx}
            logEvent={logEvent}
            onSendRowToCan={onSendRowToCan}
            onLoadFromRow={onLoadTxFromRow}
          />
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)] gap-2 h-40 min-h-0">
        <DecodedLogPanel lines={decodedLines} />
        <EventLogPanel lines={eventLines} />
      </div>
    </div>
  );
}
