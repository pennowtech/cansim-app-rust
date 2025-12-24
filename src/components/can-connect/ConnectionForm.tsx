import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CANConnectionSettings, RemoteProtocol } from "@/types/CANConnectionSettings";
import { CheckCircle2Icon, PlugZap, Save, Trash2 } from "lucide-react";
import { HelpHint } from "@/components/help-hint";
import { SocketCANCapabilities } from "@/hooks/useCANCapabilities";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  connectionSettings: CANConnectionSettings;
  setConnectionSettings: React.Dispatch<React.SetStateAction<CANConnectionSettings>>;

  // capabilities
  isLinux: boolean;
  socketCanCapabilities: SocketCANCapabilities | null;

  // ifaces
  listIfaces: string[];
  // Fetch available ifaces
  fetchIfaces?: () => void;

  // CAN connection state (for display)
  connectionState?: "disconnected" | "connecting" | "connected" | "error";
  latencyMs?: number;
  drops?: number;

  // CAN connection handlers
  handleConnect: () => void;
  handleLiveCapture: () => void;

  // Connection profiles
  profiles: { id: string; name: string }[];
  onGetProfileName: (id: string) => string;
  onSaveProfile: (name: string) => void;
  onLoadProfile: (id: string) => void;
  onDeleteProfile: (id: string) => void;
};

export function ConnectionForm(props: Props) {
  const {
    connectionSettings,
    setConnectionSettings,
    isLinux,
    socketCanCapabilities,
    listIfaces,
    fetchIfaces,
    handleConnect,
    handleLiveCapture,
  } = props;
  const [profileName, setProfileName] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const localDisabled = !isLinux || !socketCanCapabilities?.socketcan_available;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="grid gap-2">
            <Label>Save profile</Label>
            <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="e.g. Office WS" />
          </div>

          <Button
            type="button"
            className="gap-2"
            onClick={() => {
              props.onSaveProfile(profileName);
              setProfileName("");
              toast.success("Profile Saved: " + profileName);
              toast("Event has been created.");
            }}
            disabled={!profileName.trim()}
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>

        <div className="grid gap-2">
          <Label>Load profile</Label>
          <Select onValueChange={(id) => props.onLoadProfile(id)} disabled={props.profiles.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder={props.profiles.length ? "Select a saved profile" : "No saved profiles"} />
            </SelectTrigger>
            <SelectContent>
              {props.profiles.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {props.profiles.length > 0 && (
            <div className="flex flex-wrap gap-2 hidden">
              {props.profiles.slice(0, 4).map((p) => (
                <Button
                  key={p.id}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                  onClick={() => props.onLoadProfile(p.id)}
                >
                  {p.name}
                  <span className="opacity-60">·</span>
                  <span
                    className="inline-flex items-center gap-1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      props.onDeleteProfile(p.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Tabs
        value={connectionSettings.mode}
        onValueChange={(v) => setConnectionSettings((d) => ({ ...d, mode: v as any }))}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="remote">Remote</TabsTrigger>
          <TabsTrigger value="local">Local (SocketCAN)</TabsTrigger>
        </TabsList>

        <TabsContent value="remote" className="space-y-4 pt-4">
          <HelpHint text="Connect to a remote CAN daemon over the network." mobileText="" />
          <div className="grid gap-2">
            <Label>Protocol</Label>
            <Select
              value={connectionSettings.remoteProtocol}
              onValueChange={(v) => setConnectionSettings((d) => ({ ...d, remoteProtocol: v as RemoteProtocol }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ws">WebSocket</SelectItem>
                <SelectItem value="tcp">TCP</SelectItem>
                <SelectItem value="grpc">gRPC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Host</Label>
              <Input
                value={connectionSettings.host}
                onChange={(e) => setConnectionSettings((d) => ({ ...d, host: e.target.value }))}
                placeholder="127.0.0.1"
                inputMode="text"
              />
            </div>

            <div className="grid gap-2">
              <Label>Port</Label>
              <Input
                value={String(connectionSettings.port)}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setConnectionSettings((d) => ({ ...d, port: Number.isFinite(n) ? n : d.port }));
                }}
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label>CAN interface</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    fetchIfaces?.();
                  }}
                >
                  Fetch
                </Button>
                <HelpHint
                  text="Fetch available CAN interfaces from the remote daemon. Make sure the daemon is running and reachable on above host/port."
                  mobileText=""
                />{" "}
              </div>
            </div>
            <Select
              value={connectionSettings.iface}
              disabled={listIfaces.length === 0}
              onValueChange={(v) => setConnectionSettings((d) => ({ ...d, iface: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interface (can0, vcan0...)" />
              </SelectTrigger>
              <SelectContent>
                {listIfaces.map((x) => (
                  <SelectItem key={x} value={x}>
                    {x}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="local" className="space-y-4 pt-4">
          <HelpHint text="Connect to a local CAN interface using SocketCAN (Linux only)." mobileText="" />
          {!isLinux && (
            <Alert>
              <AlertTitle>SocketCAN is Linux-only</AlertTitle>
              <AlertDescription>
                You’re on a non-Linux platform. Use Remote mode to connect to a daemon.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label>Local CAN interface</Label>
            <Select
              disabled={localDisabled}
              value={connectionSettings.iface}
              onValueChange={(v) => setConnectionSettings((d) => ({ ...d, iface: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interface (can0...)" />
              </SelectTrigger>
              <SelectContent>
                {listIfaces.map((x) => (
                  <SelectItem key={x} value={x}>
                    {x}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
      <Button onClick={handleLiveCapture} disabled={!connectionSettings.iface} className="gap-2">
        <PlugZap className="h-4 w-4" />
        Start Capture (Not implemented yet)
      </Button>
      {props.socketCanCapabilities?.socketcan_available ? (
        <Alert>
          <AlertTitle>Local mode unavailable</AlertTitle>
          <AlertDescription>{props.socketCanCapabilities?.socketcan_reason}</AlertDescription>
        </Alert>
      ) : null}

      <HelpHint
        text="Select how you want to connect to a CAN interface. Either remotely over TCP/gRPC/WebSocket or locally using
        SocketCAN (Linux only)."
      />
    </div>
  );
}
