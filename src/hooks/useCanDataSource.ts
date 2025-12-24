/**
 * useCanDataSource.ts
 * ------------------------------------------------------------
 * Centralized CAN data source state machine.
 *
 * RESPONSIBILITY
 * - Manage where CAN data comes from:
 *   - demo
 *   - live (local / remote)
 *   - csv
 *   - raw candumps
 * - Provide human-readable source labels
 * - Control start / stop lifecycle
 *
 * CONVENTIONS
 * - No UI
 * - No side effects beyond state updates + logging
 *
 * ALLOWED
 * - useState
 * - useCallback
 *
 * NOT ALLOWED
 * - Direct socket / CAN I/O
 * - File dialogs
 * - UI concerns
 *
 * DESIGN GOAL
 * - Single source of truth for “what is feeding CAN data”
 * - Easy to extend with new sources
 */

import { useCallback, useRef, useState } from "react";
import { CANConnectionSettings } from "@/types/CANConnectionSettings";
import { WsJsonDaemonClient } from "@/can-bridge/ws/WsJsonDaemonClient";

export type DataSourceMode = "demo" | "live" | "csv" | "raw";
export type connectionMode = "local" | "remote";

export function useCanDataSource(logEvent: (t: string, lvl?: string) => void) {
  const [dataSourceMode, setDataSourceMode] = useState<DataSourceMode>("demo");
  const [connectionMode, setConnectionMode] = useState<connectionMode>("local");

  const [dataSourceLabel, setDataSourceLabel] = useState("Demo data (local)");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeIface, setActiveIface] = useState<string | null>(null);

  const wsJsonDaemonClientRef = useRef<WsJsonDaemonClient | null>(null);

  const connect = useCallback(
    async (settings: CANConnectionSettings) => {
      if (settings.mode === "local") {
        // Start live capture on local interface
        setIsConnected(true);
        setConnectionMode("local");
        setDataSourceMode("live");
        setDataSourceLabel(`Live capture on ${settings.iface}`);
        logEvent(`Starting live capture on ${settings.iface}`);
      } else {
        if (settings.remoteProtocol !== "ws") {
          logEvent(`Only WS is wired right now. Selected: ${settings.remoteProtocol}`, "WARN");
          return;
        }
        setDataSourceMode("live");
        const daemonUrl = `ws://${settings.host}:${Number(settings.port)}/ws/text`;
        const client = new WsJsonDaemonClient(daemonUrl);

        try {
          const hello = await client.connect({ clientName: "tauri-ui", timeoutMs: 3000 });
          wsJsonDaemonClientRef.current = client;

          setDataSourceMode("live");
          setDataSourceLabel(`Remote daemon: ${daemonUrl}`);
          logEvent(`Connected to remote daemon: ${hello.server_name} v${hello.version}`);
          setConnectionMode("remote");
          setIsConnected(true);
          console.log("2 CAN daemon connected: ", isConnected);
        } catch (error: any) {
          logEvent(`Connect failed: ${error?.message ?? String(error)}`, "ERROR");
          client.close();
        }
      }
    },
    [logEvent],
  );

  const stop = useCallback(() => {
    if (!isConnected) return;
    setIsConnected(false);
    const iface = activeIface ?? "unknown";

    if (connectionMode == "local") {
      logEvent(`Stopping live capture on local iface ${iface}`);
    } else if (connectionMode == "remote") {
      logEvent(`Stopping live capture on remote iface ${iface}`);
      const client = wsJsonDaemonClientRef.current;
      if (client) {
        client.close();
        wsJsonDaemonClientRef.current = null;
      } else {
        logEvent("No active remote daemon client to close", "WARN");
        return;
      }
    }

    setDataSourceLabel(`Live capture stopped (${iface})`);
    logEvent("Stopped live capture");
  }, [isConnected, activeIface, logEvent]);

  const fetchInterfaces = useCallback(
    async (settings: CANConnectionSettings): Promise<string[]> => {
      logEvent("Fetching can ifaces...");

      // Sometimes isConnected is still false here right after connect() is called.
      // Hence, we do not check isConnected before proceeding.
      // In remote mode, we just try to fetch interfaces anyway if we have a valid wsJsonDaemonClientRef.

      if (settings.mode === "local") {
        logEvent(`Not implemented: fetching local interfaces`, "ERROR");
      } else {
        const client = wsJsonDaemonClientRef.current;
        if (!client) {
          logEvent("No active remote daemon client to fetch interfaces", "WARN");
          return [];
        }

        try {
          const ifaces = await client.listIfaces(3000);
          logEvent(`Fetched ${ifaces.items.length} interfaces from remote daemon`);
          return ifaces.items;
        } catch (error: any) {
          logEvent(`Fetch interfaces failed: ${error?.message ?? String(error)}`, "ERROR");
          return [];
        }
      }
      return [];
    },
    [isConnected, logEvent],
  );

  const startCapture = useCallback(
    async (settings: CANConnectionSettings) => {
      if (!isConnected) {
        logEvent("Cannot set interface: not capturing", "WARN");
        return;
      }
      if (settings.mode === "local") {
        setActiveIface(settings.iface);
        logEvent(`Starting live capture on local iface ${settings.iface}`);
      } else {
        const client = wsJsonDaemonClientRef.current;
        if (!client) {
          logEvent("No active remote daemon client to set interface", "WARN");
          return;
        }

        try {
          const subscribed = await client.subscribe([settings.iface], 3000);
          if (!subscribed.ifaces || !subscribed.ifaces.includes(settings.iface)) {
            logEvent(`Subscribe did not confirm iface ${settings.iface}`, "ERROR");
            return;
          }
          logEvent(`Subscribed to iface ${subscribed.ifaces} on remote daemon`);
          setActiveIface(settings.iface);
          logEvent(`Starting live capture on remote iface: ${settings.iface}`);
        } catch (error: any) {
          logEvent(`Subscribe failed: ${error?.message ?? String(error)}`, "ERROR");
        }
      }
    },
    [isConnected, logEvent],
  );

  const setCsvSource = useCallback((fileName: string) => {
    setDataSourceMode("csv");
    setDataSourceLabel(`CSV: ${fileName}`);
  }, []);

  const setRawSource = useCallback((fileName: string) => {
    setDataSourceMode("raw");
    setDataSourceLabel(`Raw log: ${fileName}`);
  }, []);

  const setDemoSource = useCallback(() => {
    setDataSourceMode("demo");
    setDataSourceLabel("Demo data (local)");
  }, []);

  return {
    dataSourceMode,
    dataSourceLabel,
    isConnected,
    isCapturing,
    connect,
    stop,
    fetchInterfaces,
    startCapture,
    setCsvSource,
    setRawSource,
    setDemoSource,
  };
}
