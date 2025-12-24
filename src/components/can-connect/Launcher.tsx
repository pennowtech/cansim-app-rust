import * as React from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor } from "lucide-react";
import { DesktopLauncher } from "@/components/can-connect/DesktopLauncher";
import { MobileLauncher } from "@/components/can-connect/MobileLauncher";
import { useIsMobileLike } from "@/hooks/useIsMobileLike";

import type { SocketCANCapabilities } from "@/hooks/useCANCapabilities";
import { CANConnectionSettings, SavedConnectionProfile } from "@/types/CANConnectionSettings";
import { useEffect, useState } from "react";
import {
  useCANConnectionStatus,
  type ConnectionState,
  type ConnectionStats,
} from "@/components/can-connect/useCANConnectionStatus";
import { ConnectionPill } from "@/components/can-connect/ConnectionPill";
import { useCanDataSource } from "@/hooks/useCanDataSource";

const defaultConnectionSettings: CANConnectionSettings = {
  mode: "remote",
  remoteProtocol: "grpc",
  host: "127.0.0.1",
  port: 9502,
  iface: "can0",
};

const SAVED_CONNECTIONS_KEY = "canConnect.profiles.v1";
const LAST_SETTINGS_KEY = "canConnect.lastSettings.v1";

function uid() {
  // good enough for local profiles
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function safeJsonParse<T>(s: string | null, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    console.warn("safeJsonParse: failed to parse JSON, returning fallback");
    return fallback;
  }
}

type Props = {
  socketCanCaps: SocketCANCapabilities | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  canDataSource: ReturnType<typeof useCanDataSource>;

  // // CAN connection status
  // connState: ConnectionState;
  // connStats: ConnectionStats;
  // onConnect: () => void;
  // onDisconnect: () => void;
  // onReconnect: () => void;
};

export function CANConnectLauncher(props: Props) {
  const isMobile = useIsMobileLike();
  const isLinux = navigator.platform.toLowerCase().includes("linux");

  const [profiles, setProfiles] = useState<SavedConnectionProfile[]>(() => {
    const arr = safeJsonParse<SavedConnectionProfile[]>(localStorage.getItem(SAVED_CONNECTIONS_KEY), []);
    // return the latest updated first
    return arr.sort((a, b) => b.updatedAt - a.updatedAt);
  });

  const [connectionSettings, setConnectionSettings] = useState<CANConnectionSettings>(() => {
    const saved = safeJsonParse<CANConnectionSettings>(
      localStorage.getItem(LAST_SETTINGS_KEY),
      defaultConnectionSettings,
    );
    return { ...defaultConnectionSettings, ...saved };
  });

  // Persist last draft (so user gets last selections back)
  useEffect(() => {
    localStorage.setItem(LAST_SETTINGS_KEY, JSON.stringify(connectionSettings));
  }, [connectionSettings]);

  // Persist profiles
  useEffect(() => {
    localStorage.setItem(SAVED_CONNECTIONS_KEY, JSON.stringify(profiles));
  }, [profiles]);

  function getProfileName(id: string) {
    const p = profiles.find((x) => x.id === id);
    return p ? p.name : "Unknown Profile";
  }

  function loadProfile(id: string) {
    const p = profiles.find((x) => x.id === id);
    if (!p) return;
    setConnectionSettings({ ...defaultConnectionSettings, ...p.connectionSettings });
  }

  function deleteProfile(id: string) {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  }

  function saveProfile(name: string) {
    console.log("[ui] saving profile:", name, connectionSettings);
    const trimmed = name.trim();
    if (!trimmed) return;

    setProfiles((prevProfile) => {
      // If same name exists, overwrite it (nice UX)
      const existing = prevProfile.find((p) => p.name.toLowerCase() === trimmed.toLowerCase());
      const now = Date.now();

      if (existing) {
        return prevProfile
          .map((p) => (p.id === existing.id ? { ...p, connectionSettings, updatedAt: now } : p))
          .sort((a, b) => b.updatedAt - a.updatedAt);
      }

      const nextProfile: SavedConnectionProfile = {
        id: uid(),
        name: trimmed,
        connectionSettings: connectionSettings,
        updatedAt: now,
      };
      loadProfile(nextProfile.id);
      return [nextProfile, ...prevProfile].sort((a, b) => b.updatedAt - a.updatedAt);
    });
  }

  const handleConnect = async (settings: CANConnectionSettings) => {
    await props.canDataSource.connect(settings);
    console.log("CAN daemon connected: ", props.canDataSource.isConnected);
  };

  const handleFetchIfaces = async () => {
    try {
      await props.canDataSource.connect(connectionSettings); // safe to call even if already connected
      const availableIfaces = await props.canDataSource.fetchInterfaces(connectionSettings);

      setIfaces(availableIfaces);
    } catch (error) {
      console.error("Failed to fetch interfaces", error);
      setIfaces([]);
    }
  };

  const handleLiveCapture = (settings: CANConnectionSettings) => {
    props.canDataSource.startCapture(settings);

    // Close the launcher/dialog
    props.onOpenChange(false);
  };

  const canConnectionStatus = useCANConnectionStatus({ simulate: true });
  const [ifaces, setIfaces] = React.useState<string[]>([]);

  return (
    <>
      <Button onClick={() => props.onOpenChange(true)} variant="default" className="gap-2 hidden">
        {isMobile ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
        Connect
      </Button>
      {isMobile ? (
        <MobileLauncher
          open={props.open}
          onOpenChange={props.onOpenChange}
          connectionSettings={connectionSettings}
          setConnectionSettings={setConnectionSettings}
          handleConnect={handleConnect}
          listIfaces={ifaces}
          fetchIfaces={handleFetchIfaces}
          isLinux={isLinux}
          socketCanCapabilities={props.socketCanCaps}
          profiles={profiles}
          onGetProfileName={getProfileName}
          onSaveProfile={saveProfile}
          onLoadProfile={loadProfile}
          onDeleteProfile={deleteProfile}
          handleLiveCapture={handleLiveCapture}
        />
      ) : (
        <DesktopLauncher
          open={props.open}
          onOpenChange={props.onOpenChange}
          connectionSettings={connectionSettings}
          setConnectionSettings={setConnectionSettings}
          handleConnect={handleConnect}
          listIfaces={ifaces}
          fetchIfaces={handleFetchIfaces}
          isLinux={isLinux}
          socketCanCapabilities={props.socketCanCaps}
          profiles={profiles}
          onSaveProfile={saveProfile}
          onGetProfileName={getProfileName}
          onLoadProfile={loadProfile}
          onDeleteProfile={deleteProfile}
          handleLiveCapture={handleLiveCapture}
        />
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ConnectionPill state={canConnectionStatus.connectionState} stats={canConnectionStatus.stats} />
        <div className="text-xs opacity-70">Drops: {canConnectionStatus.stats.drops}</div>
      </div>{" "}
    </>
  );
}
