/**
 * CanExplorer.tsx
 * ------------------------------------------------------------
 * High-level CAN viewer controller.
 *
 * RESPONSIBILITY
 * - Owns CAN-view-specific orchestration
 * - Coordinates:
 *   - data source selection (demo / live / csv / raw)
 *   - filtering
 *   - record selection
 *   - TX actions
 * - Chooses mobile vs desktop layout
 *
 * CONVENTIONS
 * - This file is allowed to be “medium-sized”
 * - Uses hooks heavily
 * - Does NOT render low-level UI elements directly
 *
 * ALLOWED
 * - useMemo for filtering
 * - Event handlers
 * - Data-source transitions
 *
 * NOT ALLOWED
 * - Raw DOM manipulation
 * - Complex resizing math (use hooks)
 * - UI layout markup duplication
 *
 * DESIGN GOAL
 * - This is the “brain” of the CAN tab
 * - Layouts and hooks do the heavy lifting
 */

import { useMemo, useRef, useState } from "react";
import { exportCsvFromRust, importCsvFromRust } from "@/api/can";
import { recordMatches } from "@/filtering";
import { generateDemoData } from "@/demoData";
import { FilterCriteria, MessageRecord, TxParams } from "@/types";
import { CANConnectLauncher } from "@/components/can-connect/Launcher";
import { MainToolbar } from "@/components/MainToolbar";
import { StatsBar } from "@/components/StatsBar";
import { useCANCapabilities } from "@/hooks/useCANCapabilities";
import { useIsMobileLike } from "@/hooks/useIsMobileLike";
import { useHorizontalSplitter } from "@/hooks/useHorizontalSplitter";
import { useCanDataSource } from "@/hooks/useCanDataSource";
import { MobileLayout } from "@/views/can-explorer/MobileLayout";
import { DesktopLayout } from "@/views/can-explorer/DesktopLayout";
import { CANConnectionSettings } from "@/types/CANConnectionSettings";
import { defaultCriteria, defaultTx } from "@/app/AppDefaults";

export function CanExplorer(props: {
  criteria: FilterCriteria;
  setCriteria: (c: FilterCriteria) => void;
  selected: MessageRecord | null;
  setSelected: (r: MessageRecord | null) => void;
  records: MessageRecord[];
  setRecords: (r: MessageRecord[]) => void;
  tx: TxParams;
  setTx: (t: TxParams) => void;

  canDataSource: ReturnType<typeof useCanDataSource>;
  decodedLines: string[];
  eventLines: { level: string; text: string }[];
  logEvent: (t: string, lvl?: string) => void;
  clearLogs: () => void;
}) {
  const {
    criteria,
    setCriteria,
    selected,
    setSelected,
    records,
    setRecords,
    tx,
    setTx,
    canDataSource,
    decodedLines,
    eventLines,
    logEvent,
    clearLogs,
  } = props;

  const isMobile = useIsMobileLike();
  const { panelWidth, onSplitterMouseDown } = useHorizontalSplitter(340);

  const { socketCanCaps, socketCanCapsError } = useCANCapabilities();
  const [canDialogOpen, setCanDialogOpen] = useState(false);

  // Data source central state

  const visibleRecords = useMemo(() => records.filter((r) => recordMatches(r, criteria)), [records, criteria]);

  const setFilterField = (field: keyof FilterCriteria, value: string) => {
    setCriteria({ ...criteria, [field]: value });
  };

  const onSendRowToCan = (row: MessageRecord) => {
    logEvent(`Send row → CAN: Arb=${row.arbitration_id_hex}, Data=${row.data_hex}`);
  };

  const onLoadTxFromRow = (row: MessageRecord) => {
    setTx({
      ...tx,
      arb_hex: row.arbitration_id_hex ?? "",
      data_hex: row.data_hex ?? "",
      payload_hex: row.data_hex ?? "",
    });
    logEvent(`Loaded row into TxPanel (#${row.index})`);
  };

  const onSendTx = (iface: string, params: TxParams) => {
    logEvent(`TX on ${iface}: arb="${params.arb_hex}" data="${params.data_hex}" payload="${params.payload_hex}"`);
  };

  const handleStartLiveClick = () => {
    // lift this into state in App if you want; showing conceptually
    setCanDialogOpen(true);
  };

  // CSV import/export: keep here (or extract to another hook later)
  const handleExportCsv = async () => {
    await exportCsvFromRust(visibleRecords);
    logEvent(`Exported ${visibleRecords.length} rows to CSV`);
  };

  const handleImportCsv = async () => {
    const result = await importCsvFromRust();
    if (!result) return;
    const { records: recs, fileName } = result;

    setRecords(recs);
    setSelected(null);
    setCriteria(defaultCriteria);
    clearLogs();

    canDataSource.setCsvSource(fileName);
    logEvent(`Loaded ${recs.length} rows from ${fileName}`, "WARN");
  };

  const handleLoadDemo = () => {
    const demo = generateDemoData();
    setRecords(demo);
    setSelected(null);
    setCriteria(defaultCriteria);
    clearLogs();

    canDataSource.setDemoSource();
    logEvent(`Loaded ${demo.length} demo messages`);
  };

  return (
    <>
      <MainToolbar
        isCapturing={canDataSource.isCapturing}
        onStartLive={handleStartLiveClick}
        onStopLive={canDataSource.stop}
        onExportCsv={handleExportCsv}
        onImportCsv={handleImportCsv}
        onExportRaw={() => {}}
        onImportRaw={() => {}}
        onLoadDemo={handleLoadDemo}
      />

      <div className="h-full min-h-0 p-2 flex flex-col gap-2 overflow-hidden">
        {isMobile ? (
          <MobileLayout
            dataSourceLabel={canDataSource.dataSourceLabel}
            criteria={criteria}
            onApplyCriteria={setCriteria}
            onClearCriteria={() => setCriteria(defaultCriteria)}
            records={records}
            visibleRecords={visibleRecords}
            selected={selected}
            onSelect={setSelected}
            onSetFilterField={setFilterField}
            tx={tx}
            onChangeTx={setTx}
            onSendTx={onSendTx}
            decodedLines={decodedLines}
            eventLines={eventLines}
            logEvent={logEvent}
            onLoadTxFromRow={onLoadTxFromRow}
            onSendRowToCan={onSendRowToCan}
            defaultCriteria={defaultCriteria}
          />
        ) : (
          <DesktopLayout
            criteria={criteria}
            onApplyCriteria={setCriteria}
            onClearCriteria={() => setCriteria(defaultCriteria)}
            records={records}
            visibleRecords={visibleRecords}
            selected={selected}
            onSelect={setSelected}
            onSetFilterField={setFilterField}
            tx={tx}
            onChangeTx={setTx}
            onSendTx={onSendTx}
            decodedLines={decodedLines}
            eventLines={eventLines}
            logEvent={logEvent}
            onLoadTxFromRow={onLoadTxFromRow}
            onSendRowToCan={onSendRowToCan}
            detailWidth={panelWidth}
            onSplitterMouseDown={onSplitterMouseDown}
          />
        )}
      </div>

      <CANConnectLauncher
        socketCanCaps={socketCanCaps}
        open={canDialogOpen}
        onOpenChange={setCanDialogOpen}
        canDataSource={canDataSource}
      />
    </>
  );
}
