import * as React from "react";
import { invoke } from "@tauri-apps/api/core";

export type SocketCANCapabilities = {
  platform: string;
  socketcan_available: boolean;
  socketcan_reason: string;
};

export function useCANCapabilities() {
  const [socketCANCaps, setSocketCANCaps] = React.useState<SocketCANCapabilities | null>(null);
  const [socketCanCapsError, setSocketCanCapsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const c = await invoke<SocketCANCapabilities>("get_can_apabilities");
        setSocketCANCaps(c);
      } catch (e: any) {
        setSocketCanCapsError(e?.toString?.() ?? "Failed to load can capabilities");
      }
    })();
  }, []);

  return { socketCANCaps, socketCanCapsError };
}
