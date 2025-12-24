/**
 * App.tsx
 * ------------------------------------------------------------
 * Root application component.
 *
 * RESPONSIBILITY
 * - Owns top-level application state:
 *   - active tab (CAN / MQTT)
 *   - global theme
 *   - shared CAN data state (records, selection, TX params)
 * - Wires together high-level views (CanExplorer, MqttExplorer)
 * - Defines global layout shell (header + main area)
 *
 * CONVENTIONS
 * - This file MUST remain small and readable
 * - No business logic
 * - No layout logic specific to CAN or MQTT
 * - No hooks with complex logic
 *
 * ALLOWED
 * - useState for global state
 * - Passing props downward
 * - Very light conditional rendering
 *
 * NOT ALLOWED
 * - Data fetching
 * - Filtering logic
 * - Mobile / desktop layout decisions
 * - CAN protocol logic
 *
 * IF THIS FILE GROWS > ~120 LINES
 * - You are probably doing something wrong
 * - Extract logic into CanView or a hook
 *
 * DESIGN GOAL
 * - “I should understand the whole app in 30 seconds by reading this file”
 */

import React, { useMemo, useState } from "react";
import { useTheme } from "@/theme-provider";
import { AppHeader } from "@/app/AppHeader";
import { CanExplorer } from "@/views/can-explorer/CanExplorer";
import { MqttExplorer } from "@/views/mqtt-explorer/MqttExplorer";
import { FilterCriteria, MessageRecord, TxParams } from "@/types";
import { generateDemoData } from "@/demoData";
import { defaultCriteria, defaultTx } from "@/app/AppDefaults";
import { useEventLogs } from "@/hooks/useEventLogs";
import { StatsBar } from "./components/StatsBar";
import { recordMatches } from "./filtering";
import { useCanDataSource } from "./hooks/useCanDataSource";

const App: React.FC = () => {
  const [theme, resolvedTheme, setTheme] = useTheme();

  const [activeTab, setActiveTab] = useState<"can" | "mqtt">("can");

  const [records, setRecords] = useState<MessageRecord[]>(() => generateDemoData());
  const [criteria, setCriteria] = useState<FilterCriteria>(defaultCriteria);
  const [selected, setSelected] = useState<MessageRecord | null>(null);
  const [tx, setTx] = useState<TxParams>(defaultTx);

  const { decodedLines, eventLines, logEvent, clearLogs } = useEventLogs();
  const visibleRecords = useMemo(() => records.filter((r) => recordMatches(r, criteria)), [records, criteria]);
  const canDataSource = useCanDataSource(logEvent);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground transition-colors">
      <AppHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dataSourceLabel={"(provided by CanView)"} // optional: lift label up if you want
        theme={theme}
        resolvedTheme={resolvedTheme}
        onThemeChange={setTheme}
      />

      <main className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "mqtt" ? (
          <div className="h-full min-h-0 p-2">
            <MqttExplorer />
          </div>
        ) : (
          <CanExplorer
            criteria={criteria}
            setCriteria={setCriteria}
            selected={selected}
            setSelected={setSelected}
            records={records}
            setRecords={setRecords}
            tx={tx}
            setTx={setTx}
            canDataSource={canDataSource}
            decodedLines={decodedLines}
            eventLines={eventLines}
            logEvent={logEvent}
            clearLogs={clearLogs}
          />
        )}
      </main>
      {
        <footer className="shrink-0 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <StatsBar
            all={records}
            visible={visibleRecords}
            connection={{
              state: canDataSource.isCapturing ? "connected" : "disconnected",
              label: canDataSource.dataSourceLabel,
            }}
          />
        </footer>
      }
    </div>
  );
};

export default App;
