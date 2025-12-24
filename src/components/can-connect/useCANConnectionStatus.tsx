import { useCallback, useEffect, useRef, useState } from "react";
import { CANConnectionSettings } from "@/types/CANConnectionSettings";

export type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

export type ConnectionStats = {
  latencyMs?: number;
  drops: number;
  lastError?: string;
  since?: number; // epoch ms when entered current connected session
};

type Props = {
  // TODO: in our real app, we’ll replace this with Tauri commands or client SDK calls
  // to connect to CAN backend. For now, we can simulate connection behavior.
  simulate?: boolean;
};

function now() {
  return Date.now();
}

export function useCANConnectionStatus(props: Props) {
  const simulate = props.simulate ?? true;

  const [stats, setStats] = useState<ConnectionStats>({ drops: 0 });
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");

  // Keep current settings used for "reconnect" etc.
  const lastCANConnectionSettingsRef = useRef<CANConnectionSettings | null>(null);

  // Simulated ping timer
  const pingTimer = useRef<number | null>(null);

  const stopPing = useCallback(() => {
    if (pingTimer.current != null) {
      window.clearInterval(pingTimer.current);
      pingTimer.current = null;
    }
  }, []);

  const startPing = useCallback(() => {
    stopPing();
    pingTimer.current = window.setInterval(() => {
      // fake latency signal with some jitter
      const latency = 10 + Math.round(Math.random() * 40);
      setStats((s) => ({ ...s, latencyMs: latency }));
    }, 1500);
  }, [stopPing]);

  const connect = useCallback(
    async (canConnectionSettings: CANConnectionSettings) => {
      lastCANConnectionSettingsRef.current = canConnectionSettings;
      setConnectionState("connecting");
      setStats((s) => ({ ...s, lastError: undefined }));

      try {
        // TODO: Replace this block with our real connection call:
        // await canClient.connect(canConnectionSettings)
        if (simulate) {
          await new Promise((r) => setTimeout(r, 450));
          // random failure chance to see "error" UI occasionally
          const fail = Math.random() < 0.05;
          if (fail) throw new Error("Simulated connect error");
        }

        setConnectionState("connected");
        setStats((s) => ({ ...s, since: now() }));
        if (simulate) startPing();
      } catch (e: any) {
        stopPing();
        setConnectionState("error");
        setStats((s) => ({ ...s, lastError: e?.message ?? String(e) }));
      }
    },
    [simulate, startPing, stopPing],
  );

  const disconnect = useCallback(async () => {
    try {
      // Call our real disconnect logic here:
      // await canClient.disconnect()
    } finally {
      stopPing();
      setConnectionState("disconnected");
      setStats((s) => ({ ...s, latencyMs: undefined, since: undefined }));
    }
  }, [stopPing]);

  const reconnect = useCallback(async () => {
    if (!lastCANConnectionSettingsRef.current) return;
    await connect(lastCANConnectionSettingsRef.current);
  }, [connect]);

  // Simulate occasional drops while connected
  useEffect(() => {
    if (!simulate) return;
    if (connectionState !== "connected") return;

    const t = window.setInterval(() => {
      const drop = Math.random() < 0.03; // 3% chance each tick
      if (!drop) return;

      setStats((s) => ({ ...s, drops: s.drops + 1 }));
      // show brief error->connecting->connected cycle
      setConnectionState("error");
      setStats((s) => ({ ...s, lastError: "Simulated drop" }));
      stopPing();

      window.setTimeout(() => {
        setConnectionState("connecting");
        window.setTimeout(() => {
          setConnectionState("connected");
          startPing();
        }, 400);
      }, 350);
    }, 2000);

    return () => window.clearInterval(t);
  }, [simulate, connectionState, startPing, stopPing]);

  return { connectionState, stats, connect, disconnect, reconnect };
}
