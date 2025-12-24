import { Badge } from "@/components/ui/badge";

import type { ConnectionState, ConnectionStats } from "@/components/can-connect/useCANConnectionStatus";

export function ConnectionPill(props: { state: ConnectionState; stats: ConnectionStats }) {
  const { state, stats } = props;

  const text =
    state === "connected"
      ? `Connected${typeof stats.latencyMs === "number" ? ` · ${stats.latencyMs}ms` : ""}`
      : state === "connecting"
        ? "Connecting…"
        : state === "error"
          ? `Error${stats.lastError ? ` · ${stats.lastError}` : ""}`
          : "Disconnected";

  // Badge colors are handled by our theme; we keep it simple and readable.
  return (
    <Badge variant={state === "connected" ? "default" : state === "error" ? "destructive" : "secondary"}>{text}</Badge>
  );
}
