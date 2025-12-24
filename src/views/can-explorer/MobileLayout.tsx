/**
 * MobileLayout.tsx
 * ------------------------------------------------------------
 * Mobile-first CAN layout implementation.
 *
 * RESPONSIBILITY
 * - Define how CAN UI behaves on small screens
 * - Tabs, sheets, stacked panels
 *
 * CONVENTIONS
 * - Layout-only component
 * - Receives fully prepared data via props
 *
 * ALLOWED
 * - useState for UI-only state (tabs, sheets)
 * - Shadcn / Radix components
 *
 * NOT ALLOWED
 * - Filtering logic
 * - Data mutation
 * - Data source switching
 *
 * DESIGN GOAL
 * - No CAN knowledge
 * - Only describes *how* things are shown on mobile
 */

import { useState } from "react";
import { FilterPanel } from "@/components/FilterPanel";
import { DataTable } from "@/components/DataTable";
import { DetailPanel } from "@/components/DetailPanel";
import { DecodedLogPanel } from "@/components/DecodedLogPanel";
import { EventLogPanel } from "@/components/EventLogPanel";
import { TxPanel } from "@/components/TxPanel";
import { FilterCriteria, MessageRecord, TxParams } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export function MobileLayout(props: {
  dataSourceLabel: string;

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

  defaultCriteria: FilterCriteria;
}) {
  const {
    dataSourceLabel,
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
    defaultCriteria,
  } = props;

  const [filterOpen, setFilterOpen] = useState(false);
  const [mobileCanTab, setMobileCanTab] = useState<"table" | "detail" | "tx" | "logs">("table");

  return (
    <div className="md:hidden flex flex-col min-h-0 gap-2 overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <Button variant="secondary" size="sm" className="gap-2" onClick={() => setFilterOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
        <div className="text-[11px] opacity-70 truncate">Source: {dataSourceLabel}</div>
      </div>

      <Tabs value={mobileCanTab} onValueChange={(v) => setMobileCanTab(v as any)} className="min-h-0 flex flex-col">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="detail">Details</TabsTrigger>
          <TabsTrigger value="tx">TX</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="min-h-0 flex-1 overflow-hidden">
          <div className="h-full min-h-0 overflow-hidden rounded-md border">
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
        </TabsContent>

        <TabsContent value="detail" className="min-h-0 flex-1 overflow-hidden">
          <div className="h-full min-h-0 overflow-auto rounded-md border">
            <DetailPanel record={selected} />
          </div>
        </TabsContent>

        <TabsContent value="tx" className="min-h-0 flex-1 overflow-hidden">
          <div className="h-full min-h-0 overflow-auto rounded-md border">
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
        </TabsContent>

        <TabsContent value="logs" className="min-h-0 flex-1 overflow-hidden">
          <div className="h-full min-h-0 flex flex-col gap-2 overflow-hidden">
            <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
              <DecodedLogPanel lines={decodedLines} />
            </div>
            <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
              <EventLogPanel lines={eventLines} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="pt-4">
            <FilterPanel
              criteria={criteria}
              onApply={(c) => onApplyCriteria(c)}
              onClear={() => onApplyCriteria(defaultCriteria)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
